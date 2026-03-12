"use client"

const TEAM = [
  {
    name: "Sarah Chen",
    role: "Engineering Lead",
    avatar: "SC",
    risk: "high",
    score: 42,
    signals: ["Overtime +40% (3 weeks)", "0 PTO in 6 weeks", "Slower PR reviews"],
    coaching: "Block a 1:1 this week. Acknowledge load, not just output.",
  },
  {
    name: "Marcus Rivera",
    role: "Product Manager",
    avatar: "MR",
    risk: "medium",
    score: 65,
    signals: ["Reduced async comms", "Missed 2 of last 4 1:1s"],
    coaching: "Offer flexible sprint scope. Check for context overload.",
  },
  {
    name: "Priya Patel",
    role: "Designer",
    avatar: "PP",
    risk: "medium",
    score: 68,
    signals: ["Quieter in standups", "No blocked issues but slow velocity"],
    coaching: "1:1 focused on creative energy and roadmap clarity.",
  },
  {
    name: "James Kim",
    role: "Backend Engineer",
    avatar: "JK",
    risk: "low",
    score: 88,
    signals: ["Consistent velocity", "High engagement in reviews"],
    coaching: "On track. Consider stretch assignment to maintain momentum.",
  },
  {
    name: "Aria Lopez",
    role: "Frontend Engineer",
    avatar: "AL",
    risk: "low",
    score: 91,
    signals: ["Top performer this sprint", "Proactively unblocking teammates"],
    coaching: "Excellent. Recognition opportunity — acknowledge publicly.",
  },
]

const RISK_CONFIG = {
  high: {
    label: "High Risk",
    dotColor: "#f87171",
    badgeBorder: "#7f1d1d",
    badgeBg: "rgba(248,113,113,0.08)",
    badgeText: "#f87171",
    barColor: "#f87171",
    avatarBg: "rgba(248,113,113,0.12)",
    avatarText: "#f87171",
    hoverBorder: "#7f1d1d",
  },
  medium: {
    label: "Medium Risk",
    dotColor: "#f97316",
    badgeBorder: "#7c2d12",
    badgeBg: "rgba(249,115,22,0.08)",
    badgeText: "#f97316",
    barColor: "#f97316",
    avatarBg: "rgba(249,115,22,0.12)",
    avatarText: "#f97316",
    hoverBorder: "#7c2d12",
  },
  low: {
    label: "Healthy",
    dotColor: "#34d399",
    badgeBorder: "#065f46",
    badgeBg: "rgba(52,211,153,0.08)",
    badgeText: "#34d399",
    barColor: "#34d399",
    avatarBg: "rgba(52,211,153,0.12)",
    avatarText: "#34d399",
    hoverBorder: "#065f46",
  },
}

export default function TeamsPage() {
  const highRisk = TEAM.filter((t) => t.risk === "high").length
  const medRisk = TEAM.filter((t) => t.risk === "medium").length

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
          // PEOPLE COACH AGENT
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
        >
          Team Health
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#6b6b70" }}>
          AI-powered signals and coaching recommendations for your team.
        </p>
      </header>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "TEAM MEMBERS",
            value: TEAM.length.toString(),
            valueColor: "#f0ede8",
          },
          {
            label: "BURNOUT RISK",
            value: `${highRisk} high · ${medRisk} med`,
            valueColor: "#f97316",
          },
          {
            label: "AVG HEALTH",
            value: `${Math.round(
              TEAM.reduce((a, t) => a + t.score, 0) / TEAM.length
            )}`,
            valueColor: "#34d399",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded border px-5 py-4"
            style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
          >
            <p
              className="text-[9px] mb-2"
              style={{
                color: "#3a3a3f",
                fontFamily: "var(--font-jetbrains-mono)",
                letterSpacing: "0.12em",
              }}
            >
              {s.label}
            </p>
            <p
              className="text-xl font-medium tabular-nums"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                color: s.valueColor,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Team cards */}
      <div className="flex flex-col gap-4">
        {TEAM.map((member) => {
          const cfg = RISK_CONFIG[member.risk as keyof typeof RISK_CONFIG]
          return (
            <div
              key={member.name}
              className="rounded border p-5 transition-colors"
              style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = cfg.hoverBorder)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#1c1c20")
              }
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded text-sm font-bold"
                    style={{
                      backgroundColor: cfg.avatarBg,
                      color: cfg.avatarText,
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
                    >
                      {member.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "#6b6b70" }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <div className="flex justify-between mb-1">
                      <span
                        className="text-[9px]"
                        style={{
                          color: "#3a3a3f",
                          fontFamily: "var(--font-jetbrains-mono)",
                        }}
                      >
                        HEALTH
                      </span>
                      <span
                        className="text-[9px]"
                        style={{
                          color: "#6b6b70",
                          fontFamily: "var(--font-jetbrains-mono)",
                        }}
                      >
                        {member.score}
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full"
                      style={{ backgroundColor: "#1c1c20" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${member.score}%`,
                          backgroundColor: cfg.barColor,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="rounded border px-2.5 py-0.5 text-[9px] font-medium"
                    style={{
                      backgroundColor: cfg.badgeBg,
                      borderColor: cfg.badgeBorder,
                      color: cfg.badgeText,
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {cfg.label.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p
                    className="text-[9px] mb-2"
                    style={{
                      color: "#3a3a3f",
                      fontFamily: "var(--font-jetbrains-mono)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    // SIGNALS
                  </p>
                  <ul className="space-y-1">
                    {member.signals.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "#6b6b70" }}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: cfg.dotColor }}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="rounded border px-4 py-3"
                  style={{ backgroundColor: "#07070a", borderColor: "#1c1c20" }}
                >
                  <p
                    className="text-[9px] mb-1.5"
                    style={{
                      color: "#3a3a3f",
                      fontFamily: "var(--font-jetbrains-mono)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    // COACHING REC
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#6b6b70" }}
                  >
                    {member.coaching}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
