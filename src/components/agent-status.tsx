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
  const hasRun = lastOperation.latencyMs > 0
  return (
    <div
      className="flex items-center gap-0 text-[10px]"
      style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#3a3a3f" }}
    >
      <span style={{ color: hasRun ? "#6b6b70" : "#3a3a3f" }}>SYS</span>
      <span className="mx-3" style={{ color: "#1c1c20" }}>|</span>
      <span>
        LAT{" "}
        <span style={{ color: hasRun ? "#f0ede8" : "#3a3a3f" }}>
          {lastOperation.latencyMs}ms
        </span>
      </span>
      <span className="mx-3" style={{ color: "#1c1c20" }}>|</span>
      <span>
        COST{" "}
        <span style={{ color: hasRun ? "#f0ede8" : "#3a3a3f" }}>
          ${lastOperation.costUsd.toFixed(3)}
        </span>
      </span>
      <span className="mx-3" style={{ color: "#1c1c20" }}>|</span>
      <span style={{ color: hasRun ? "#6b6b70" : "#2a2a30" }}>
        {lastOperation.updatedAt}
      </span>
    </div>
  )
}
