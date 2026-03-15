"use client"

import * as React from "react"
import type { CompanyHealthSnapshot, Metric } from "@/lib/company-health"
import { loadDemoData } from "@/app/actions/demo-data"
import { useAgentStatus } from "@/components/agent-status"
import {
  TrendingUp, TrendingDown, Minus,
  DollarSign, RefreshCw, Users, GitCommit,
  ActivitySquare, MessageSquare, HeartPulse,
  Terminal, AlertTriangle, Zap, ArrowUpRight,
} from "lucide-react"

type DashboardClientProps = {
  initialSnapshot: CompanyHealthSnapshot
  demoMode?: boolean
}

const METRIC_ICONS = [DollarSign, RefreshCw, Users, GitCommit]

function TrendIndicator({ trend }: { trend: Metric["trend"] }) {
  if (trend === "up") return (
    <span
      className="flex items-center gap-1 text-xs font-medium"
      style={{ color: "#f59e0b", fontFamily: "var(--font-jetbrains-mono)" }}
    >
      <TrendingUp className="h-3 w-3" /> UP
    </span>
  )
  if (trend === "down") return (
    <span
      className="flex items-center gap-1 text-xs font-medium"
      style={{ color: "#f87171", fontFamily: "var(--font-jetbrains-mono)" }}
    >
      <TrendingDown className="h-3 w-3" /> DOWN
    </span>
  )
  return (
    <span
      className="flex items-center gap-1 text-xs"
      style={{ color: "#3a3a3f", fontFamily: "var(--font-jetbrains-mono)" }}
    >
      <Minus className="h-3 w-3" /> FLAT
    </span>
  )
}

const AGENTS = [
  {
    icon: ActivitySquare,
    color: "#f59e0b",
    borderColor: "#92400e",
    name: "Company Health Agent",
    desc: "Monitors revenue, pipeline, and engineering velocity. Delivers a daily AI briefing.",
  },
  {
    icon: HeartPulse,
    color: "#34d399",
    borderColor: "#065f46",
    name: "People Coach Agent",
    desc: "Analyses HR signals, flags burnout risk, and suggests coaching actions for leads.",
  },
  {
    icon: MessageSquare,
    color: "#f97316",
    borderColor: "#7c2d12",
    name: "Nudging Agent",
    desc: "Drafts personalised outreach and internal messages. Nothing sends without your approval.",
  },
]

export default function DashboardClient({
  initialSnapshot,
  demoMode = false,
}: DashboardClientProps) {
  const { setLastOperation } = useAgentStatus()
  const [snapshot, setSnapshot] =
    React.useState<CompanyHealthSnapshot>(initialSnapshot)
  const [isPending, startTransition] = React.useTransition()
  const deferred = React.useDeferredValue(snapshot)

  const handleLoad = () => {
    startTransition(async () => {
      const result = await loadDemoData()
      setSnapshot(result.snapshot)
      setLastOperation(result.operation)
    })
  }

  return (
    <section className="flex flex-col gap-8">

      {/* Agent capabilities hero — demo mode only */}
      {demoMode && (
        <div
          className="animate-fade-up rounded border p-6"
          style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <p
                className="text-[10px] mb-2"
                style={{
                  color: "#3a3a3f",
                  fontFamily: "var(--font-jetbrains-mono)",
                  letterSpacing: "0.15em",
                }}
              >
                {"// WHAT THIS DOES"}
              </p>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
              >
                Three AI agents. One command center.
              </h2>
              <p
                className="mt-1 text-sm max-w-lg"
                style={{ color: "#6b6b70" }}
              >
                Cortex AI runs continuously — monitoring metrics, coaching your
                team, and drafting communications.
              </p>
            </div>
            <a
              href="https://github.com/Vijayarvind10/founder-operating-system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: "#6b6b70", fontFamily: "var(--font-jetbrains-mono)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#f59e0b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#6b6b70")
              }
            >
              github <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {AGENTS.map((a, i) => (
              <div
                key={a.name}
                className="animate-fade-up rounded border p-4 transition-colors"
                style={{
                  backgroundColor: "#07070a",
                  borderColor: "#1c1c20",
                  animationDelay: `${i * 80}ms`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = a.borderColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#1c1c20")
                }
              >
                <a.icon className="h-4 w-4" style={{ color: a.color }} />
                <p
                  className="mt-3 text-sm font-bold"
                  style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
                >
                  {a.name}
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "#6b6b70" }}
                >
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        style={{ animationDelay: "50ms" }}
      >
        <div>
          <p
            className="text-[10px] mb-1.5"
            style={{
              color: "#3a3a3f",
              fontFamily: "var(--font-jetbrains-mono)",
              letterSpacing: "0.15em",
            }}
          >
            {"// COMPANY HEALTH"}
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
          >
            Dashboard
          </h1>
          <p
            className="mt-1.5 max-w-xl text-sm"
            style={{ color: "#6b6b70" }}
          >
            {demoMode
              ? "Explore a curated simulation of real-time company health insights generated by Cortex AI."
              : "Daily signal checks powered by the Company Health Agent."}
          </p>
        </div>
        <button
          onClick={handleLoad}
          disabled={isPending}
          className="self-start flex items-center gap-2 rounded px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50"
          style={{
            backgroundColor: "#f59e0b",
            color: "#07070a",
            fontFamily: "var(--font-syne)",
          }}
          onMouseEnter={(e) => {
            if (!isPending)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#d97706"
          }}
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#f59e0b")
          }
        >
          <Zap className="h-4 w-4" />
          {demoMode
            ? isPending
              ? "Simulating…"
              : "Run Briefing"
            : isPending
            ? "Generating…"
            : "Generate Briefing"}
        </button>
      </header>

      {/* Demo banner */}
      {demoMode && (
        <div
          className="animate-fade-up rounded border-l-2 px-5 py-4 flex items-start gap-3"
          style={{
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245,158,11,0.04)",
            animationDelay: "100ms",
          }}
        >
          <Terminal
            className="h-4 w-4 mt-0.5 shrink-0"
            style={{ color: "#f59e0b" }}
          />
          <div>
            <p
              className="text-[10px] mb-1"
              style={{
                color: "#f59e0b",
                fontFamily: "var(--font-jetbrains-mono)",
                letterSpacing: "0.12em",
              }}
            >
              INTERACTIVE DEMO MODE
            </p>
            <p className="text-sm" style={{ color: "#6b6b70" }}>
              You are exploring a fully interactive simulation of Cortex AI.
              Click{" "}
              <strong style={{ color: "#f0ede8" }}>
                &ldquo;Run Briefing&rdquo;
              </strong>{" "}
              to watch the agent reason in real time.
            </p>
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
        {deferred.metrics.map((metric, i) => {
          const Icon = METRIC_ICONS[i % METRIC_ICONS.length]
          const isUp = metric.trend === "up"
          const isDown = metric.trend === "down"
          const accentColor = isUp ? "#f59e0b" : isDown ? "#f87171" : "#2a2a30"
          return (
            <div
              key={metric.label}
              className="animate-fade-up rounded p-5"
              style={{
                backgroundColor: "#0f0f12",
                border: "1px solid #1c1c20",
                borderLeft: `2px solid ${accentColor}`,
                animationDelay: `${150 + i * 60}ms`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <p
                  className="text-[9px] uppercase"
                  style={{
                    color: "#3a3a3f",
                    fontFamily: "var(--font-jetbrains-mono)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {metric.label}
                </p>
                <Icon className="h-3.5 w-3.5" style={{ color: "#3a3a3f" }} />
              </div>
              <p
                className="text-3xl font-medium tabular-nums"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: isUp ? "#f59e0b" : isDown ? "#f87171" : "#f0ede8",
                }}
              >
                {metric.value}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className="text-[10px]"
                  style={{
                    color: "#6b6b70",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {metric.change}
                </span>
                <TrendIndicator trend={metric.trend} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Briefing + Alerts */}
      <div
        className="animate-fade-up grid gap-4 lg:grid-cols-[2fr_1fr]"
        style={{ animationDelay: "400ms" }}
      >
        <div
          className="rounded border p-6"
          style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                className="text-[9px] mb-1"
                style={{
                  color: "#3a3a3f",
                  fontFamily: "var(--font-jetbrains-mono)",
                  letterSpacing: "0.12em",
                }}
              >
                {"// AI DAILY BRIEFING"}
              </p>
              <h3
                className="text-sm font-bold"
                style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
              >
                Morning Intelligence
              </h3>
            </div>
            <span
              className="text-[9px] px-2 py-1 rounded border"
              style={{
                color: "#f59e0b",
                borderColor: "#92400e",
                backgroundColor: "rgba(245,158,11,0.06)",
                fontFamily: "var(--font-jetbrains-mono)",
                letterSpacing: "0.1em",
              }}
            >
              AI GENERATED
            </span>
          </div>
          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "#6b6b70" }}
          >
            {deferred.briefing.summary}
          </p>
          <div>
            <p
              className="text-[9px] mb-3"
              style={{
                color: "#3a3a3f",
                fontFamily: "var(--font-jetbrains-mono)",
                letterSpacing: "0.12em",
              }}
            >
              {"// PRIORITY ACTIONS"}
            </p>
            <ul className="space-y-3">
              {deferred.briefing.priorities.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: "rgba(245,158,11,0.12)",
                      color: "#f59e0b",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: "#6b6b70" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="rounded border p-6"
          style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle
              className="h-3.5 w-3.5"
              style={{ color: "#f97316" }}
            />
            <p
              className="text-[9px]"
              style={{
                color: "#3a3a3f",
                fontFamily: "var(--font-jetbrains-mono)",
                letterSpacing: "0.12em",
              }}
            >
              {"// ACTIVE ALERTS"}
            </p>
          </div>
          <div className="space-y-2.5">
            {deferred.alerts.map((alert, i) => {
              const colors = ["#f87171", "#f97316", "#60a5fa"]
              return (
                <div
                  key={alert.title}
                  className="rounded border p-3.5"
                  style={{ backgroundColor: "#07070a", borderColor: "#1c1c20" }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: colors[i] || colors[2] }}
                    />
                    <p
                      className="text-xs font-bold"
                      style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
                    >
                      {alert.title}
                    </p>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#6b6b70", paddingLeft: "14px" }}
                  >
                    {alert.detail}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
