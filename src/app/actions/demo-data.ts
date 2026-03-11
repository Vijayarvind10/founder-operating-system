"use server"

import { getDemoCompanyHealthSnapshot } from "@/lib/company-health"

export async function loadDemoData() {
  const startedAt = Date.now()
  await new Promise((resolve) => setTimeout(resolve, 450))

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
