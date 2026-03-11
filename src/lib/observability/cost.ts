// Token cost estimation based on Anthropic's published pricing (March 2026).
// Prices are per-million tokens in USD.

interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

const PRICING: Record<string, ModelPricing> = {
  "claude-sonnet-4-6": {
    inputPerMillion: 3.0,
    outputPerMillion: 15.0,
  },
  "claude-haiku-4-5-20251001": {
    inputPerMillion: 0.25,
    outputPerMillion: 1.25,
  },
};

const FALLBACK: ModelPricing = { inputPerMillion: 3.0, outputPerMillion: 15.0 };

export function estimateCostUsd(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const p = PRICING[modelId] ?? FALLBACK;
  const cost =
    (inputTokens / 1_000_000) * p.inputPerMillion +
    (outputTokens / 1_000_000) * p.outputPerMillion;
  return Math.round(cost * 1_000_000) / 1_000_000;
}
