// AgentTracer — captures every AI SDK step and tool call for a single agent run.
//
// Usage:
//   const tracer = new AgentTracer({ agentType, modelId, query, systemPrompt });
//   await tracer.start();
//   const response = await runCompanyHealthAgent(query, tracer.callbacks());
//   const trace  = await tracer.finish(response);

import { randomUUID } from "crypto";
import { estimateCostUsd } from "./cost";
import {
  lsCreateRun,
  lsCreateToolRun,
  lsEndToolRun,
  lsFinalizeRun,
  lsLogStep,
} from "./langsmith";
import type {
  AgentCallbacks,
  AgentRunTrace,
  StepTrace,
  ToolCallTrace,
} from "./types";

interface TracerOptions {
  agentType: string;
  modelId: string;
  query: string;
  systemPrompt: string;
  parentRunId?: string;
}

// ─── Runtime shape of AI SDK v6 step events ───────────────────────────────────
// (accessed via `unknown` cast to avoid TS contravariance errors on callbacks)

interface RawUsage {
  inputTokens?: number;
  outputTokens?: number;
}

interface RawToolCall {
  toolName: string;
  input: unknown;
}

interface RawToolResult {
  toolName: string;
  output: unknown;
}

interface RawStepEvent {
  stepNumber?: number;
  text?: string;
  finishReason?: string;
  usage?: RawUsage;
  toolCalls?: RawToolCall[];
  toolResults?: RawToolResult[];
}

function asStep(event: unknown): RawStepEvent {
  return (event ?? {}) as RawStepEvent;
}

// ─── AgentTracer ──────────────────────────────────────────────────────────────

export class AgentTracer {
  private readonly traceId = randomUUID();
  private readonly options: TracerOptions;
  private startedAt!: Date;
  private langsmithRunId: string | undefined;

  private steps: StepTrace[] = [];
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private stepCounter = 0;
  private toolStartTimes = new Map<string, number>();

  constructor(options: TracerOptions) {
    this.options = options;
  }

  async start(): Promise<void> {
    this.startedAt = new Date();
    this.langsmithRunId = await lsCreateRun({
      name: this.options.agentType,
      inputs: {
        query: this.options.query,
        systemPrompt: this.options.systemPrompt,
        modelId: this.options.modelId,
      },
      parentRunId: this.options.parentRunId,
    });
  }

  callbacks(): AgentCallbacks {
    return {
      onStepFinish: async (rawEvent: unknown) => {
        const event = asStep(rawEvent);
        const stepNumber = ++this.stepCounter;
        const inputTokens = event.usage?.inputTokens ?? 0;
        const outputTokens = event.usage?.outputTokens ?? 0;

        const toolCalls: ToolCallTrace[] = [];

        const calls = event.toolCalls ?? [];
        const results = event.toolResults ?? [];

        for (let i = 0; i < calls.length; i++) {
          const call = calls[i];
          const result = results.find((r) => r.toolName === call.toolName);

          const startTime =
            this.toolStartTimes.get(call.toolName) ?? Date.now();
          const durationMs = Date.now() - startTime;
          this.toolStartTimes.delete(call.toolName);

          const toolTrace: ToolCallTrace = {
            toolName: call.toolName,
            input: call.input,
            output: result?.output ?? null,
            durationMs,
          };
          toolCalls.push(toolTrace);

          if (this.langsmithRunId) {
            const toolRunId = await lsCreateToolRun({
              name: call.toolName,
              input: call.input,
              parentRunId: this.langsmithRunId,
            });
            if (toolRunId) {
              await lsEndToolRun(toolRunId, result?.output ?? null);
            }
          }
        }

        const stepTrace: StepTrace = {
          stepNumber,
          toolCalls,
          text: event.text ?? "",
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          finishReason: String(event.finishReason ?? "unknown"),
        };

        this.steps.push(stepTrace);
        this.totalInputTokens += inputTokens;
        this.totalOutputTokens += outputTokens;

        if (this.langsmithRunId) {
          await lsLogStep(this.langsmithRunId, stepTrace);
        }
      },

      // All step data is captured in onStepFinish — onFinish is a no-op here.
      onFinish: async (_event: unknown) => {},
    };
  }

  async finish(
    finalResponse: string,
    finishReason = "stop",
    error?: string
  ): Promise<AgentRunTrace> {
    const finishedAt = new Date();
    const latencyMs = finishedAt.getTime() - this.startedAt.getTime();
    const estimatedCostUsd = estimateCostUsd(
      this.options.modelId,
      this.totalInputTokens,
      this.totalOutputTokens
    );

    const trace: AgentRunTrace = {
      traceId: this.traceId,
      agentType: this.options.agentType,
      query: this.options.query,
      systemPrompt: this.options.systemPrompt,
      startedAt: this.startedAt,
      finishedAt,
      latencyMs,
      steps: this.steps,
      totalInputTokens: this.totalInputTokens,
      totalOutputTokens: this.totalOutputTokens,
      totalTokens: this.totalInputTokens + this.totalOutputTokens,
      estimatedCostUsd,
      modelId: this.options.modelId,
      finalResponse,
      finishReason,
      error,
      langsmithRunId: this.langsmithRunId,
    };

    this.consoleLog(trace);

    if (this.langsmithRunId) {
      await lsFinalizeRun(this.langsmithRunId, trace);
    }

    return trace;
  }

  private consoleLog(trace: AgentRunTrace): void {
    const toolSummary =
      trace.steps
        .flatMap((s) => s.toolCalls.map((t) => t.toolName))
        .join(", ") || "none";

    console.log(
      JSON.stringify({
        level: "info",
        event: "agent_run_complete",
        traceId: trace.traceId,
        agentType: trace.agentType,
        latencyMs: trace.latencyMs,
        steps: trace.steps.length,
        toolsCalled: toolSummary,
        totalInputTokens: trace.totalInputTokens,
        totalOutputTokens: trace.totalOutputTokens,
        totalTokens: trace.totalTokens,
        estimatedCostUsd: trace.estimatedCostUsd,
        finishReason: trace.finishReason,
        langsmithRunId: trace.langsmithRunId ?? null,
        ...(trace.error ? { error: trace.error } : {}),
        stepBreakdown: trace.steps.map((s) => ({
          step: s.stepNumber,
          tokens: s.totalTokens,
          tools: s.toolCalls.map((t) => ({
            name: t.toolName,
            durationMs: t.durationMs,
          })),
          finishReason: s.finishReason,
        })),
      })
    );
  }
}
