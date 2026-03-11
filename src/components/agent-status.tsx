"use client"

import * as React from "react"

type AgentOperation = {
  latencyMs: number
  costUsd: number
  updatedAt: string
}

type AgentStatusContextValue = {
  lastOperation: AgentOperation
  setLastOperation: (operation: AgentOperation) => void
}

const AgentStatusContext = React.createContext<AgentStatusContextValue | null>(
  null
)

const defaultOperation: AgentOperation = {
  latencyMs: 0,
  costUsd: 0,
  updatedAt: "Not yet run",
}

export function AgentStatusProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [lastOperation, setLastOperation] =
    React.useState<AgentOperation>(defaultOperation)

  const value = React.useMemo(
    () => ({ lastOperation, setLastOperation }),
    [lastOperation]
  )

  return (
    <AgentStatusContext.Provider value={value}>
      {children}
    </AgentStatusContext.Provider>
  )
}

export function useAgentStatus() {
  const context = React.useContext(AgentStatusContext)
  if (!context) {
    throw new Error("useAgentStatus must be used within AgentStatusProvider")
  }
  return context
}

export function SystemStatus() {
  const { lastOperation } = useAgentStatus()

  return (
    <div className="flex items-center gap-3 text-xs text-slate-500">
      <span className="font-semibold text-slate-600">System Status</span>
      <span>Latency: {lastOperation.latencyMs}ms</span>
      <span>Cost: ${lastOperation.costUsd.toFixed(3)}</span>
      <span className="text-slate-400">Updated: {lastOperation.updatedAt}</span>
    </div>
  )
}
