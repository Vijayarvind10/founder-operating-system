"use client"

import * as React from "react"
import {
  Send,
  Terminal,
  ActivitySquare,
  HeartPulse,
  MessageSquare,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

type Phase = "idle" | "thinking" | "streaming" | "done"

type ToolCall = {
  name: string
  desc: string
  result: string
}

type Script = {
  agent: string
  agentColor: string
  agentIcon: React.ElementType
  toolCalls: ToolCall[]
  response: string
}

const SCRIPTS: Record<string, Script> = {
  revenue: {
    agent: "Company Health Agent",
    agentColor: "#f59e0b",
    agentIcon: ActivitySquare,
    toolCalls: [
      {
        name: "getAnalyticsReport()",
        desc: "Fetching 90-day revenue and churn data",
        result: "✓ Loaded — MRR $118.4k, 2 churn-risk accounts flagged",
      },
      {
        name: "getSalesReport()",
        desc: "Pulling late-stage pipeline data",
        result: "✓ Loaded — $290k pipeline, 3 deals in final stage",
      },
    ],
    response: `Based on current signals, your biggest revenue risk this quarter is concentrated in two mid-market accounts — Acme Corp and Northwind Inc — both showing 34% usage decline over the past 14 days with no recent support contact.\n\nYour sales pipeline is healthy at $290k with three late-stage deals, but two of those renewals depend on a feature parity milestone you haven't shipped yet.\n\nRecommended actions:\n• Schedule a QBR with Acme Corp this week — usage decline at this stage typically precedes churn by 3–4 weeks\n• Unblock the feature parity sprint — two $60k renewals are gating on it\n• Assign a CSM to Northwind for a proactive health check call`,
  },
  team: {
    agent: "People Coach Agent",
    agentColor: "#34d399",
    agentIcon: HeartPulse,
    toolCalls: [
      {
        name: "getHRReport()",
        desc: "Analysing team health signals and engagement scores",
        result: "✓ Loaded — 8 employees, 1 high-risk flag, 2 moderate",
      },
    ],
    response: `The People Coach Agent has identified one high-risk burnout signal and two moderate flags in your team.\n\nHigh risk — Sarah Chen (Engineering Lead)\nOvertime hours up 40% for 3 consecutive weeks, 0 PTO taken in 6 weeks, and PR review response time has slowed significantly. Pattern matches pre-burnout profile with 87% confidence.\n\nModerate risk — Marcus Rivera & Priya Patel\nBoth show reduced async communication volume and missed two 1:1s this month.\n\nRecommended coaching actions:\n• Block a 1:1 with Sarah this week — acknowledge the load, not the output\n• Offer Marcus and Priya flexible sprint scope next cycle\n• Consider a team retrospective focused on sustainable pace`,
  },
  nudge: {
    agent: "Nudging Agent",
    agentColor: "#f97316",
    agentIcon: MessageSquare,
    toolCalls: [
      {
        name: "getHRReport()",
        desc: "Looking up recipient context and relationship signals",
        result:
          "✓ Loaded — last contact 18 days ago, account health: at-risk",
      },
      {
        name: "scheduleNudge()",
        desc: "Drafting personalised message and queuing for approval",
        result: "✓ Draft created — awaiting founder approval before send",
      },
    ],
    response: `I've drafted a check-in message for the Acme Corp account. It will not be sent until you approve it.\n\n────────────────────\nSubject: Checking in — how's everything going?\n\nHi Jordan,\n\nI wanted to reach out personally — I noticed your team's usage has been lighter than usual over the past couple of weeks, and I want to make sure we're delivering the value you expected.\n\nWould you have 20 minutes this week or next for a quick call? I'd love to hear what's working and where we can do better for you.\n\nLooking forward to connecting.\n────────────────────\n\nThis draft is queued in the Nudges tab for your review. You can edit the copy, change the channel (Email / Slack), or reject it entirely.`,
  },
}

const SUGGESTIONS = [
  "What's the biggest risk to revenue this quarter?",
  "Is anyone on the team showing signs of burnout?",
  "Draft a check-in message for the Acme Corp account",
]

function pickScript(query: string): Script {
  const q = query.toLowerCase()
  if (
    q.includes("revenue") ||
    q.includes("risk") ||
    q.includes("churn") ||
    q.includes("sales")
  )
    return SCRIPTS.revenue
  if (
    q.includes("team") ||
    q.includes("burn") ||
    q.includes("people") ||
    q.includes("sarah") ||
    q.includes("health")
  )
    return SCRIPTS.team
  return SCRIPTS.nudge
}

type Message =
  | { role: "user"; text: string }
  | {
      role: "ai"
      script: Script
      toolCallsShown: number
      streamedText: string
      phase: Phase
    }

function ToolCallBlock({ tc, visible }: { tc: ToolCall; visible: boolean }) {
  const [open, setOpen] = React.useState(false)
  if (!visible) return null
  return (
    <div
      className="rounded border text-xs overflow-hidden"
      style={{ backgroundColor: "#07070a", borderColor: "#1c1c20" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
        style={{ color: "#6b6b70" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(28,28,32,0.5)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <span
          className="font-mono"
          style={{ color: "#f59e0b", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {tc.name}
        </span>
        <span
          className="flex-1 text-[10px]"
          style={{ color: "#3a3a3f", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {tc.desc}
        </span>
        {open ? (
          <ChevronDown className="h-3 w-3 shrink-0" style={{ color: "#3a3a3f" }} />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "#3a3a3f" }} />
        )}
      </button>
      {open && (
        <div
          className="border-t px-3 py-2 text-[10px]"
          style={{
            borderColor: "#1c1c20",
            color: "#6b6b70",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          {tc.result}
        </div>
      )}
    </div>
  )
}

export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const submit = React.useCallback(
    (query: string) => {
      if (!query.trim() || isProcessing) return
      setIsProcessing(true)
      setInput("")

      const script = pickScript(query)
      const userMsg: Message = { role: "user", text: query }
      const aiMsg: Message = {
        role: "ai",
        script,
        toolCallsShown: 0,
        streamedText: "",
        phase: "thinking",
      }

      setMessages((prev) => [...prev, userMsg, aiMsg])

      // Phase 1: thinking (700ms)
      setTimeout(() => {
        setMessages((prev) => {
          const copy = [...prev]
          const last = {
            ...(copy[copy.length - 1] as Extract<Message, { role: "ai" }>),
          }
          last.phase = "streaming"
          copy[copy.length - 1] = last
          return copy
        })

        // Phase 2: reveal tool calls one by one (500ms each)
        let tcIndex = 0
        const revealNext = () => {
          tcIndex++
          setMessages((prev) => {
            const copy = [...prev]
            const last = {
              ...(copy[copy.length - 1] as Extract<Message, { role: "ai" }>),
            }
            last.toolCallsShown = tcIndex
            copy[copy.length - 1] = last
            return copy
          })
          if (tcIndex < script.toolCalls.length) {
            setTimeout(revealNext, 500)
          } else {
            setTimeout(() => streamResponse(script.response), 300)
          }
        }

        if (script.toolCalls.length > 0) {
          setTimeout(revealNext, 400)
        } else {
          setTimeout(() => streamResponse(script.response), 700)
        }
      }, 700)

      function streamResponse(text: string) {
        let i = 0
        const interval = setInterval(() => {
          i++
          setMessages((prev) => {
            const copy = [...prev]
            const last = {
              ...(copy[copy.length - 1] as Extract<Message, { role: "ai" }>),
            }
            last.streamedText = text.slice(0, i)
            last.phase = i >= text.length ? "done" : "streaming"
            copy[copy.length - 1] = last
            return copy
          })
          if (i >= text.length) {
            clearInterval(interval)
            setIsProcessing(false)
          }
        }, 12)
      }
    },
    [isProcessing]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(input)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
            <div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded mx-auto mb-4 border"
                style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
              >
                <Terminal className="h-7 w-7" style={{ color: "#f59e0b" }} />
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
              >
                Ask your AI agents
              </h2>
              <p
                className="mt-2 text-sm max-w-sm"
                style={{ color: "#6b6b70" }}
              >
                Three specialised agents are standing by — company health,
                people coaching, and outreach drafting.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded border px-4 py-3 text-sm text-left transition-colors"
                  style={{
                    borderColor: "#1c1c20",
                    backgroundColor: "#0f0f12",
                    color: "#6b6b70",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f59e0b"
                    e.currentTarget.style.color = "#f0ede8"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1c1c20"
                    e.currentTarget.style.color = "#6b6b70"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            if (msg.role === "user") {
              return (
                <div key={i} className="flex justify-end">
                  <div
                    className="max-w-[75%] rounded px-4 py-3 text-sm border"
                    style={{
                      backgroundColor: "rgba(245,158,11,0.08)",
                      borderColor: "#92400e",
                      color: "#f0ede8",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            }

            const { script, toolCallsShown, streamedText, phase } = msg
            const AgentIcon = script.agentIcon

            return (
              <div key={i} className="flex gap-3 max-w-[85%]">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded border mt-0.5"
                  style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
                >
                  <AgentIcon
                    className="h-4 w-4"
                    style={{ color: script.agentColor }}
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-medium"
                      style={{
                        color: script.agentColor,
                        fontFamily: "var(--font-jetbrains-mono)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {script.agent.toUpperCase()}
                    </span>
                  </div>

                  {/* Thinking dots */}
                  {phase === "thinking" && (
                    <div className="flex gap-1.5 py-2">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "#f59e0b",
                            animationDelay: `${d * 150}ms`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Tool calls */}
                  {script.toolCalls.map((tc, ti) => (
                    <ToolCallBlock
                      key={ti}
                      tc={tc}
                      visible={toolCallsShown > ti}
                    />
                  ))}

                  {/* Streamed response */}
                  {streamedText && (
                    <div
                      className="rounded border px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        backgroundColor: "#0f0f12",
                        borderColor: "#1c1c20",
                        color: "#6b6b70",
                      }}
                    >
                      {streamedText}
                      {phase === "streaming" && (
                        <span
                          className="inline-block h-3.5 w-0.5 ml-0.5 animate-pulse"
                          style={{ backgroundColor: "#f59e0b" }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div
          className="flex items-center gap-3 rounded border px-4 py-3 transition-all"
          style={{ borderColor: "#1c1c20", backgroundColor: "#0f0f12" }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "#f59e0b")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "#1c1c20")
          }
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about revenue, team health, or draft a message…"
            aria-label="Chat input"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{
              color: "#f0ede8",
            }}
            disabled={isProcessing}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isProcessing}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: "#f59e0b" }}
            onMouseEnter={(e) => {
              if (input.trim() && !isProcessing)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#d97706"
            }}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#f59e0b")
            }
          >
            <Send className="h-3.5 w-3.5" style={{ color: "#07070a" }} />
          </button>
        </div>
      </form>
    </div>
  )
}
