// Sales Tool — pipeline stages, closed won/lost deals, and churn data

export interface PipelineDeal {
  id: string;
  companyName: string;
  stage: "Prospecting" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  arrValue: number; // Annual Recurring Revenue in USD
  ownerName: string;
  expectedCloseDate: string;
  daysSinceLastActivity: number;
}

export interface ChurnRecord {
  companyName: string;
  arr: number;
  churnDate: string;
  reason: string;
}

export interface SalesSummary {
  totalPipelineValue: number;
  closedWonMtdArr: number;
  closedLostMtdArr: number;
  churnMtdArr: number;
  averageDealCycleDays: number;
}

export interface SalesData {
  reportGeneratedAt: string;
  summary: SalesSummary;
  pipeline: PipelineDeal[];
  recentChurn: ChurnRecord[];
  alerts: string[];
}

export function getSalesData(): SalesData {
  return {
    reportGeneratedAt: "2026-03-10T08:00:00Z",
    summary: {
      totalPipelineValue: 1_240_000,
      closedWonMtdArr: 187_000,
      closedLostMtdArr: 54_000,
      churnMtdArr: 32_000,
      averageDealCycleDays: 42,
    },
    pipeline: [
      {
        id: "deal-001",
        companyName: "Acme Corp",
        stage: "Negotiation",
        arrValue: 120_000,
        ownerName: "Sarah Kim",
        expectedCloseDate: "2026-03-20",
        daysSinceLastActivity: 2,
      },
      {
        id: "deal-002",
        companyName: "Brightpath Inc",
        stage: "Proposal",
        arrValue: 85_000,
        ownerName: "Marcus Webb",
        expectedCloseDate: "2026-03-31",
        daysSinceLastActivity: 8,
      },
      {
        id: "deal-003",
        companyName: "Cobalt Systems",
        stage: "Qualified",
        arrValue: 60_000,
        ownerName: "Sarah Kim",
        expectedCloseDate: "2026-04-15",
        daysSinceLastActivity: 14,
      },
      {
        id: "deal-004",
        companyName: "Dune Analytics",
        stage: "Proposal",
        arrValue: 200_000,
        ownerName: "Jordan Lee",
        expectedCloseDate: "2026-04-01",
        daysSinceLastActivity: 3,
      },
      {
        id: "deal-005",
        companyName: "Elevate Health",
        stage: "Prospecting",
        arrValue: 45_000,
        ownerName: "Marcus Webb",
        expectedCloseDate: "2026-05-01",
        daysSinceLastActivity: 21,
      },
      {
        id: "deal-006",
        companyName: "Forte Logistics",
        stage: "Closed Won",
        arrValue: 95_000,
        ownerName: "Jordan Lee",
        expectedCloseDate: "2026-03-05",
        daysSinceLastActivity: 5,
      },
      {
        id: "deal-007",
        companyName: "Greenline Media",
        stage: "Closed Lost",
        arrValue: 54_000,
        ownerName: "Sarah Kim",
        expectedCloseDate: "2026-03-01",
        daysSinceLastActivity: 9,
      },
    ],
    recentChurn: [
      {
        companyName: "Horizon Tools",
        arr: 18_000,
        churnDate: "2026-03-03",
        reason: "Chose a competitor with native ERP integration.",
      },
      {
        companyName: "Jetstream SaaS",
        arr: 14_000,
        churnDate: "2026-03-07",
        reason: "Budget cuts — company downsizing.",
      },
    ],
    alerts: [
      "Cobalt Systems has had no activity in 14 days — at risk of going cold.",
      "Elevate Health has been in Prospecting for 21 days — needs qualification call.",
      "MTD churn of $32K is tracking above the $25K monthly target.",
    ],
  };
}