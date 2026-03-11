// Simulation Provider
//
// Serves curated, high-quality agent responses when the Founder Operating System
// is running in Interactive Demo Mode (i.e. no ANTHROPIC_API_KEY is configured).
//
// A realistic 2-second delay is injected to authentically represent the
// multi-step reasoning process each agent performs against live business data.

import { randomUUID } from "crypto";

type AgentType = "company-health" | "people-coach" | "nudging";

interface SimulatedResult {
  agent: AgentType;
  response: string;
  traceId: string;
  langsmithRunId?: string;
}

// ─── Simulated reasoning delay ────────────────────────────────────────────────

const REASONING_DELAY_MS = 2000;

// ─── Query intent classification ─────────────────────────────────────────────
// Lightweight keyword match — no API call needed in demo mode.

function detectAgent(query: string): AgentType {
  const q = query.toLowerCase();

  const nudgingSignals = [
    "nudge", "message", "draft", "slack", "email", "approve",
    "send", "communication", "outreach", "notify",
  ];
  const peopleSignals = [
    "team", "employee", "burnout", "people", "coach", "engagement",
    "hr", "performance", "at risk", "morale", "culture", "1:1", "manager",
  ];

  if (nudgingSignals.some((s) => q.includes(s))) return "nudging";
  if (peopleSignals.some((s) => q.includes(s))) return "people-coach";
  return "company-health";
}

// ─── Curated simulation responses ────────────────────────────────────────────

const COMPANY_HEALTH_RESPONSE = `**Overall Health Score** – At Risk

Revenue growth remains solid, but engineering velocity has decelerated and churn is trending above target for the second consecutive week.

**Key Metrics**
- MRR: $284,500 (+8.2% MoM)
- Trial-to-Paid Conversion: 23.4% (↓ from 26.1% last month)
- Net Churn Rate: 4.1% (↑ above the 3.5% target threshold)
- 30-Day Active Users: 12,847 (↓ 3.2% week-over-week)
- Open PRs older than 5 days: 7 (↑ from 3 last week)
- Pipeline Value: $1.24M (47% concentrated at the Proposal stage)

**Engineering Throughput**
14 PRs merged and 22 issues closed in the past 30 days. Average PR age is 4.8 days. Three PRs have been open for more than 7 days — two are pending design review and are blocking downstream work. Four open issues remain unassigned and stale with no activity for more than 14 days.

**Anomalies & Alerts**
⚠ **Churn Rate Breach** — Net churn reached 4.1%, exceeding the 3.5% threshold for the second consecutive week. The primary affected cohort is Q3 trials that converted in August.

⚠ **Feature Adoption Drop** — The Reporting module recorded a 31% decline in weekly active users. The drop correlates precisely with a UI change shipped 12 days ago.

ℹ **Pipeline Concentration Risk** — 62% of total pipeline value is held by three enterprise accounts. Loss of any single account would materially impact Q2 revenue targets.

**Recommended Actions**
1. Convene a churn review with Customer Success this week. Prioritise direct outreach to the top 20 accounts from the Q3 trial cohort before end of month.
2. Revert or iterate on the Reporting module UI change. Adoption data strongly indicates the update introduced friction that is suppressing engagement.
3. Assign the four stale, unassigned GitHub issues immediately — two are on the critical path for the Q2 roadmap and risk delaying the scheduled release.`;

const PEOPLE_COACH_RESPONSE = `**People Health Summary**
The organisation is in a mixed state. Three teams are operating with strong engagement, while Engineering and Customer Success are exhibiting early burnout indicators. Survey data from the past two weeks shows declining psychological safety scores across middle management, with the most acute signal in teams that absorbed scope expansion without a corresponding headcount adjustment.

**At-Risk Teams**
- **Engineering** — Burnout Risk: 8.2 / 10 | Engagement: 5.4 / 10
  Survey signal: "The volume of after-hours incident pages has doubled in the past month. The team feels under-resourced relative to the surface area they are covering."

- **Customer Success** — Burnout Risk: 7.6 / 10 | Engagement: 5.9 / 10
  Survey signal: "Churn pressure is generating reactive work cycles with insufficient time for proactive customer health management."

**At-Risk Individuals**
- **Priya Nair** — Senior Engineer | Performance: 6.1 / 10
  Logged 47 hours in the past week. Recommend her manager open a 1:1 this week focused on workload rather than deliverables. Offer a rotation off on-call for the next sprint. Watch for passive disengagement if the pressure is not addressed within two weeks.

- **Marcus Webb** — CS Manager | Performance: 5.8 / 10
  Filed three escalations citing team capacity as the root cause. Coach his manager on escalation triage frameworks. Consider a short-term headcount allocation to relieve the structural backlog.

- **Yuki Tanaka** — Product Designer | Performance: 7.2 / 10
  Strong contributor whose engagement score has dropped 1.8 points over 6 weeks. High performers disengaging quietly represent the highest long-term retention risk. A recognition conversation and deeper roadmap involvement are recommended before this pattern deepens.

**Manager Coaching Recommendations**
1. Run a "Stop, Start, Continue" exercise in Engineering's next team meeting. This format surfaces structural blockers that rarely emerge in individual 1:1 conversations.
2. Give Customer Success managers explicit written permission to deprioritise non-critical work this sprint. They need protected time for strategic, proactive activity.
3. Bring the top three people health risks to the leadership team at the next weekly sync. Visibility creates accountability and reduces the isolation that at-risk managers report most frequently.
4. Deploy a single-question pulse survey this week: "Do you have what you need to do your best work?" Low effort, high signal, and it demonstrates that leadership is actively listening.`;

const NUDGING_RESPONSE = `I've reviewed your current nudge queue. Here is the status of all pending communication drafts awaiting your decision.

**Pending Drafts — 3 items**

---

**1. Engineering On-Call Relief — Priya Nair**
- **Channel:** Slack
- **Scheduled:** Tomorrow at 9:00 AM
- **Recipient:** priya.nair@company.com
- **Message:** "Hey Priya — I noticed you have been carrying a heavy on-call load recently. I would like to rotate you off the schedule for the next two sprints so you can focus on uninterrupted deep work. Let's connect briefly this week to align on priorities. I really appreciate everything you are contributing to the team."
- **Status:** Awaiting your approval

---

**2. Churn Outreach Priority — Marcus Webb**
- **Channel:** Email
- **Subject:** Q3 Trial Cohort — Outreach Priority This Week
- **Scheduled:** Friday at 8:00 AM
- **Recipient:** marcus.webb@company.com
- **Message:** "Hi Marcus — analytics are showing an elevated churn rate in our Q3 trial cohort. Can you prioritise check-in calls with the top 10 accounts from that cohort this week? I want to understand whether this is a product fit issue or an onboarding gap before we adjust Q4 strategy. Happy to join any of the calls if it would help."
- **Status:** Awaiting your approval

---

**3. Performance Recognition — Yuki Tanaka**
- **Channel:** Slack
- **Scheduled:** Today at 3:00 PM
- **Recipient:** yuki.tanaka@company.com
- **Message:** "Hey Yuki — I wanted to take a moment to recognise the quality of the onboarding flow work you shipped last week. The UX improvements have already moved trial activation metrics in a meaningful way. Really impressive execution."
- **Status:** Awaiting your approval

---

To approve, edit, or dismiss any of these drafts, visit the **Nudges** page or let me know which ones you would like to action here.`;

const SIMULATION_RESPONSES: Record<AgentType, string> = {
  "company-health": COMPANY_HEALTH_RESPONSE,
  "people-coach": PEOPLE_COACH_RESPONSE,
  nudging: NUDGING_RESPONSE,
};

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getSimulatedResponse(
  query: string
): Promise<SimulatedResult> {
  // Inject a realistic reasoning delay so the experience reflects the actual
  // multi-step tool-calling process the agents perform in production.
  await new Promise((resolve) => setTimeout(resolve, REASONING_DELAY_MS));

  const agent = detectAgent(query);

  console.log(
    JSON.stringify({
      level: "info",
      event: "simulation_response_served",
      agent,
      delayMs: REASONING_DELAY_MS,
    })
  );

  return {
    agent,
    response: SIMULATION_RESPONSES[agent],
    traceId: randomUUID(),
    langsmithRunId: undefined,
  };
}
