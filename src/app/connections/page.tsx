"use client"

import { Circle, Github, Zap, BarChart3, MessageSquare } from "lucide-react"

const CONNECTIONS = [
  {
    name: "GitHub",
    description: "Issues, pull requests, and CI/CD pipeline monitoring",
    icon: Github,
    status: "connected",
    meta: "47 issues tracked · Last synced 2 min ago",
    usedBy: ["Company Health Agent"],
  },
  {
    name: "Anthropic API",
    description: "Claude claude-sonnet-4-6 powering all three AI agents",
    icon: Zap,
    status: "connected",
    meta: "3 agents active · claude-sonnet-4-6",
    usedBy: ["All Agents"],
  },
  {
    name: "LangSmith",
    description: "Full observability and tracing for every agent run",
    icon: BarChart3,
    status: "connected",
    meta: "1,247 traces logged · 0 errors",
    usedBy: ["All Agents"],
  },
  {
    name: "Slack",
    description: "Send nudges and alerts directly to team channels",
    icon: MessageSquare,
    status: "not_connected",
    meta: "Not connected",
    usedBy: ["Nudging Agent"],
  },
]

export default function ConnectionsPage() {
  return (
    <section className="flex flex-col gap-8">
      <header>
        <p
          className="text-[10px] mb-1.5"
          style={{
            color: "#3a3a3f",
            fontFamily: "var(--font-jetbrains-mono)",
            letterSpacing: "0.15em",
          }}
        >
          // INTEGRATIONS
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
        >
          Connections
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#6b6b70" }}>
          Data sources and services your AI agents connect to.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONNECTIONS.map((conn, i) => {
          const Icon = conn.icon
          const connected = conn.status === "connected"
          return (
            <div
              key={conn.name}
              className="animate-fade-up rounded border p-5 transition-colors"
              style={{
                backgroundColor: "#0f0f12",
                borderColor: "#1c1c20",
                animationDelay: `${i * 80}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = connected
                  ? "#065f46"
                  : "#92400e"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1c1c20"
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded border"
                    style={{ backgroundColor: "#07070a", borderColor: "#1c1c20" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "#6b6b70" }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
                    >
                      {conn.name}
                    </p>
                    <p className="text-xs" style={{ color: "#6b6b70" }}>
                      {conn.description}
                    </p>
                  </div>
                </div>
                {connected ? (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ backgroundColor: "#34d399" }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#34d399" }}
                    />
                  </span>
                ) : (
                  <Circle
                    className="h-4 w-4 shrink-0"
                    style={{ color: "#3a3a3f" }}
                  />
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className="text-[10px]"
                  style={{
                    color: connected ? "#6b6b70" : "#3a3a3f",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {conn.meta}
                </span>
                {!connected && (
                  <button
                    className="rounded border px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      borderColor: "#f59e0b",
                      color: "#f59e0b",
                      backgroundColor: "rgba(245,158,11,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(245,158,11,0.12)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(245,158,11,0.06)"
                    }}
                  >
                    Connect
                  </button>
                )}
              </div>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {conn.usedBy.map((a) => (
                  <span
                    key={a}
                    className="rounded border px-2 py-0.5 text-[10px]"
                    style={{
                      color: "#f59e0b",
                      borderColor: "#92400e",
                      backgroundColor: "rgba(245,158,11,0.06)",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
