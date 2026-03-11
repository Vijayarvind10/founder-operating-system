export type Metric = {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "flat"
}

export type CompanyHealthSnapshot = {
  metrics: Metric[]
  briefing: {
    summary: string
    priorities: string[]
  }
  alerts: { title: string; detail: string }[]
}

export function getCompanyHealthSnapshot(): CompanyHealthSnapshot {
  return {
    metrics: [
      {
        label: "Monthly Recurring Revenue",
        value: "$118,400",
        change: "+6.2% vs last month",
        trend: "up",
      },
      {
        label: "Net Revenue Retention",
        value: "104%",
        change: "+1.4 pts",
        trend: "up",
      },
      {
        label: "Active Accounts",
        value: "382",
        change: "+12 accounts",
        trend: "up",
      },
      {
        label: "Engineering Throughput",
        value: "24 tickets",
        change: "-8% vs target",
        trend: "down",
      },
    ],
    briefing: {
      summary:
        "Pipeline momentum remains healthy while churn risk is concentrated in two mid-market accounts. Engineering throughput dipped due to onboarding and support escalations. This week should prioritize stabilizing the onboarding flow and converting two late-stage opportunities.",
      priorities: [
        "Close ACME and Northwind deals by Friday; remove procurement blockers.",
        "Ship onboarding experiment B to reduce week-one drop-off.",
        "Resolve the open billing defect impacting renewals.",
      ],
    },
    alerts: [
      {
        title: "Churn risk flagged",
        detail: "Two mid-market accounts show usage decline over 14 days.",
      },
      {
        title: "Onboarding drop-off",
        detail: "Activation rate fell to 43% in the last cohort.",
      },
      {
        title: "Support backlog rising",
        detail: "P1 tickets exceeded SLA in the past 48 hours.",
      },
    ],
  }
}

export function getDemoCompanyHealthSnapshot(): CompanyHealthSnapshot {
  return {
    metrics: [
      {
        label: "Trial Signups",
        value: "614",
        change: "-32% week over week",
        trend: "down",
      },
      {
        label: "Activation Rate",
        value: "58%",
        change: "+9 pts after onboarding refresh",
        trend: "up",
      },
      {
        label: "Expansion Pipeline",
        value: "$420,000",
        change: "+18% in late-stage deals",
        trend: "up",
      },
      {
        label: "Engineering Engagement",
        value: "92%",
        change: "Highest in 3 months",
        trend: "up",
      },
    ],
    briefing: {
      summary:
        "A sudden drop in trial signups suggests channel saturation, but activation is improving from the new onboarding flow. Sales pipeline strength offsets short-term acquisition risk. Engineering engagement is unusually high, creating a window to ship the growth backlog.",
      priorities: [
        "Audit paid acquisition channels and shift budget to high-performing cohorts.",
        "Scale the onboarding improvements across all new trials by Wednesday.",
        "Schedule a launch sequence for the top three backlog items while team energy is high.",
      ],
    },
    alerts: [
      {
        title: "Trial signup drop",
        detail: "Paid social conversions fell 41% in 72 hours.",
      },
      {
        title: "High engineering momentum",
        detail: "Team engagement score hit 92% with low burnout risk.",
      },
      {
        title: "Enterprise expansion risk",
        detail: "Two renewals depend on feature parity by month end.",
      },
    ],
  }
}
