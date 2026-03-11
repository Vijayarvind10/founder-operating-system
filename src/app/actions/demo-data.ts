"use server"

import { getDemoCompanyHealthSnapshot } from "@/lib/company-health"
import { isDemoMode } from "@/lib/demo-mode"

export async function loadDemoData() {
  const startedAt = Date.now()
  // In Interactive Demo Mode, apply the same 2-second simulated reasoning
  // delay used by the Simulation Provider so the experience feels consistent.
  const delay = isDemoMode() ? 2000 : 450
  await new Promise((resolve) => setTimeout(resolve, delay))

  const snapshot = getDemoCompanyHealthSnapshot()
  const latencyMs = Date.now() - startedAt + 40
  const costUsd = 0.018

  return {
    snapshot,
    operation: {
      latencyMs,
      costUsd,
      updatedAt: new Date().toISOString(),
    },
  }
}
