/**
 * Demo Mode — active when ANTHROPIC_API_KEY is not configured in the environment.
 *
 * When demo mode is on, all agent calls are served by the Simulation Provider,
 * which returns curated, realistic responses designed to showcase the full
 * capabilities of the Founder Operating System to visitors and evaluators.
 * No API keys are required; no real network calls are made.
 */
export function isDemoMode(): boolean {
  return !process.env.ANTHROPIC_API_KEY?.trim();
}
