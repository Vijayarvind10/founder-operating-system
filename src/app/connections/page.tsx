import { CheckCircle2, Circle, Github, Zap, BarChart3, MessageSquare } from "lucide-react"

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
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
          Integrations
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Connections</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Data sources and services your AI agents connect to.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONNECTIONS.map((conn) => {
          const Icon = conn.icon
          const connected = conn.status === "connected"
          return (
            <div
              key={conn.name}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08]">
                    <Icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {conn.name}
                    </p>
                    <p className="text-xs text-slate-500">{conn.description}</p>
                  </div>
                </div>
                {connected ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-700 shrink-0" />
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs ${
                    connected ? "text-slate-500" : "text-slate-700"
                  }`}
                >
                  {conn.meta}
                </span>
                {!connected && (
                  <button className="rounded-lg bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.12] transition-colors">
                    Connect
                  </button>
                )}
              </div>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {conn.usedBy.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-400"
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
