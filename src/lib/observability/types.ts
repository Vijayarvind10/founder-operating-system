// ─── Trace data model ─────────────────────────────────────────────────────────

export interface ToolCallTrace {
  toolName: string;
  input: unknown;
  output: unknown;
  durationMs: number;
}

export interface StepTrace {
  stepNumber: number;
  toolCalls: ToolCallTrace[];
  /** Text generated in this step (empty for tool-call-only steps) */
  text: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  finishReason: string;
}

export interface AgentRunTrace {
  traceId: string;
  agentType: string;
  query: string;
  systemPrompt: string;
  startedAt: Date;
  finishedAt: Date;
  latencyMs: number;
  steps: StepTrace[];
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  modelId: string;
  finalResponse: string;
  finishReason: string;
  error?: string;
  langsmithRunId?: string;
}

/**
 * Passed from the router into each agent so observability callbacks are injected centrally.
 * Uses `unknown` event type to avoid TypeScript contravariance errors — the tracer
 * casts internally with runtime field access.
 */
export interface AgentCallbacks {
  onStepFinish: (event: unknown) => Promise<void> | void;
  onFinish: (event: unknown) => Promise<void> | void;
}
