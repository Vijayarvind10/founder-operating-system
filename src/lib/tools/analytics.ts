// Analytics Tool — funnel data, retention metrics, and feature usage statistics

export interface FunnelStage {
  stage: string;
  visitors: number;
  conversionRate: number; // percentage from previous stage
}

export interface RetentionCohort {
  cohortMonth: string;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

export interface FeatureUsageStat {
  feature: string;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  adoptionRate: number; // percentage of total user base
}

export interface AnalyticsData {
  reportGeneratedAt: string;
  totalMonthlyActiveUsers: number;
  funnel: FunnelStage[];
  retention: RetentionCohort[];
  featureUsage: FeatureUsageStat[];
  alerts: string[];
}

export function getAnalyticsData(): AnalyticsData {
  return {
    reportGeneratedAt: "2026-03-10T08:00:00Z",
    totalMonthlyActiveUsers: 4820,
    funnel: [
      { stage: "Landing Page Visit", visitors: 18400, conversionRate: 100 },
      { stage: "Signup Started", visitors: 5520, conversionRate: 30 },
      { stage: "Signup Completed", visitors: 3864, conversionRate: 70 },
      { stage: "Onboarding Finished", visitors: 2706, conversionRate: 70 },
      { stage: "First Core Action", visitors: 1894, conversionRate: 70 },
      { stage: "Paid Conversion", visitors: 947, conversionRate: 50 },
    ],
    retention: [
      { cohortMonth: "2025-12", day1: 72, day7: 51, day30: 34, day90: 22 },
      { cohortMonth: "2026-01", day1: 75, day7: 54, day30: 37, day90: 0 },
      { cohortMonth: "2026-02", day1: 78, day7: 57, day30: 0, day90: 0 },
    ],
    featureUsage: [
      {
        feature: "Dashboard Overview",
        dailyActiveUsers: 3100,
        weeklyActiveUsers: 4500,
        adoptionRate: 93,
      },
      {
        feature: "AI Briefing",
        dailyActiveUsers: 2200,
        weeklyActiveUsers: 3800,
        adoptionRate: 79,
      },
      {
        feature: "Team Health View",
        dailyActiveUsers: 980,
        weeklyActiveUsers: 2100,
        adoptionRate: 44,
      },
      {
        feature: "Nudge Approval",
        dailyActiveUsers: 410,
        weeklyActiveUsers: 890,
        adoptionRate: 18,
      },
      {
        feature: "Connections Manager",
        dailyActiveUsers: 120,
        weeklyActiveUsers: 340,
        adoptionRate: 7,
      },
    ],
    alerts: [
      "Day-30 retention dropped 3 points month-over-month for the 2026-01 cohort.",
      "Nudge Approval feature adoption is below 20% — consider an in-app prompt.",
    ],
  };
}
