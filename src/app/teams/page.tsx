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
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    bar: "bg-rose-500",
  },
  medium: {
    label: "Medium Risk",
    dot: "bg-amber-400",
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    bar: "bg-amber-400",
  },
  low: {
    label: "Healthy",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    bar: "bg-emerald-400",
  },
}

export default function TeamsPage() {
  const highRisk = TEAM.filter((t) => t.risk === "high").length
  const medRisk = TEAM.filter((t) => t.risk === "medium").length

  return (
    <section className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
          People Coach Agent
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Team Health</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          AI-powered signals and coaching recommendations for your team.
        </p>
      </header>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Team Members", value: TEAM.length.toString(), color: "text-white" },
          {
            label: "Burnout Risk",
            value: `${highRisk} high · ${medRisk} medium`,
            color: "text-amber-400",
          },
          {
            label: "Avg Health Score",
            value: `${Math.round(
              TEAM.reduce((a, t) => a + t.score, 0) / TEAM.length
            )}`,
            color: "text-emerald-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.07] px-5 py-4"
          >
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
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
              className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-slate-600">Health</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {member.score}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.08]">
                      <div
                        className={`h-full rounded-full ${cfg.bar}`}
                        style={{ width: `${member.score}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg.badge}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">
                    Signals
                  </p>
                  <ul className="space-y-1">
                    {member.signals.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 text-xs text-slate-400"
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 mb-1.5">
                    Coaching Recommendation
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
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
