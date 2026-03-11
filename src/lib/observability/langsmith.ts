// LangSmith integration — gracefully disabled when LANGSMITH_API_KEY is not set.
// Docs: https://docs.smith.langchain.com/reference/sdk/js/

import type { AgentRunTrace, StepTrace } from "./types";

let _client: import("langsmith").Client | null = null;

function getClient(): import("langsmith").Client | null {
  if (!process.env.LANGSMITH_API_KEY) return null;
  if (!_client) {
    const { Client } = require("langsmith") as typeof import("langsmith");
    _client = new Client({
      apiUrl:
        process.env.LANGSMITH_ENDPOINT ?? "https://api.smith.langchain.com",
      apiKey: process.env.LANGSMITH_API_KEY,
    });
  }
  return _client;
}

const PROJECT = () => process.env.LANGSMITH_PROJECT ?? "founder-os";

// ─── Run lifecycle ────────────────────────────────────────────────────────────

export async function lsCreateRun(params: {
  name: string;
  inputs: Record<string, unknown>;
  parentRunId?: string;
}): Promise<string | undefined> {
  const client = getClient();
  if (!client) return undefined;

  try {
    const runId = crypto.randomUUID();
    await client.createRun({
      id: runId,
      name: params.name,
      run_type: "chain",
      inputs: params.inputs,
      project_name: PROJECT(),
      parent_run_id: params.parentRunId,
      start_time: Date.now(),
    });
    return runId;
  } catch (err) {
    console.warn("[observability] LangSmith createRun failed:", err);
    return undefined;
  }
}

export async function lsCreateToolRun(params: {
  name: string;
  input: unknown;
  parentRunId: string;
}): Promise<string | undefined> {
  const client = getClient();
  if (!client) return undefined;

  try {
    const runId = crypto.randomUUID();
    await client.createRun({
      id: runId,
      name: params.name,
      run_type: "tool",
      inputs: { input: params.input },
      project_name: PROJECT(),
      parent_run_id: params.parentRunId,
      start_time: Date.now(),
    });
    return runId;
  } catch (err) {
    console.warn("[observability] LangSmith createToolRun failed:", err);
    return undefined;
  }
}

export async function lsEndToolRun(
  runId: string,
  output: unknown,
  error?: string
): Promise<void> {
  const client = getClient();
  if (!client) return;
  try {
    await client.updateRun(runId, {
      outputs: { output },
      error,
      end_time: Date.now(),
    });
  } catch (err) {
    console.warn("[observability] LangSmith endToolRun failed:", err);
  }
}

export async function lsFinalizeRun(
  runId: string,
  trace: AgentRunTrace
): Promise<void> {
  const client = getClient();
  if (!client) return;

  try {
    await client.updateRun(runId, {
      outputs: {
        response: trace.finalResponse,
        finishReason: trace.finishReason,
      },
      extra: {
        latencyMs: trace.latencyMs,
        totalInputTokens: trace.totalInputTokens,
        totalOutputTokens: trace.totalOutputTokens,
        totalTokens: trace.totalTokens,
        estimatedCostUsd: trace.estimatedCostUsd,
        modelId: trace.modelId,
        stepCount: trace.steps.length,
      },
      error: trace.error,
      end_time: trace.finishedAt.getTime(),
    });
  } catch (err) {
    console.warn("[observability] LangSmith finalizeRun failed:", err);
  }
}

export async function lsLogStep(
  parentRunId: string,
  step: StepTrace
): Promise<void> {
  const client = getClient();
  if (!client) return;

  try {
    const runId = crypto.randomUUID();
    await client.createRun({
      id: runId,
      name: `step-${step.stepNumber}`,
      run_type: "llm",
      inputs: { stepNumber: step.stepNumber },
      outputs: {
        text: step.text,
        inputTokens: step.inputTokens,
        outputTokens: step.outputTokens,
        totalTokens: step.totalTokens,
        finishReason: step.finishReason,
        toolCallCount: step.toolCalls.length,
      },
      project_name: PROJECT(),
      parent_run_id: parentRunId,
      start_time: Date.now(),
      end_time: Date.now(),
    });
  } catch (err) {
    console.warn("[observability] LangSmith logStep failed:", err);
  }
}
