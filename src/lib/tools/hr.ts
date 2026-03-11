// Human Resources Tool — team structure, performance scores, and internal survey results

export interface Employee {
  id: string;
  name: string;
  role: string;
  team: string;
  managerId: string | null;
  tenureMonths: number;
  performanceScore: number; // 1–5 scale, 5 is highest
  lastReviewDate: string;
}

export interface TeamSurveySummary {
  team: string;
  responseRate: number; // percentage
  engagementScore: number; // 1–10 scale
  burnoutRiskScore: number; // 1–10 scale, 10 is highest risk
  topConcern: string;
}

export interface HRData {
  reportGeneratedAt: string;
  headcount: number;
  employees: Employee[];
  surveyResults: TeamSurveySummary[];
  atRiskEmployees: string[]; // employee ids
  alerts: string[];
}

export function getHRData(): HRData {
  return {
    reportGeneratedAt: "2026-03-10T08:00:00Z",
    headcount: 18,
    employees: [
      // Engineering
      {
        id: "emp-001",
        name: "Alex Rivera",
        role: "Engineering Manager",
        team: "Engineering",
        managerId: null,
        tenureMonths: 36,
        performanceScore: 4.5,
        lastReviewDate: "2026-01-15",
      },
      {
        id: "emp-002",
        name: "Priya Nair",
        role: "Senior Software Engineer",
        team: "Engineering",
        managerId: "emp-001",
        tenureMonths: 24,
        performanceScore: 4.8,
        lastReviewDate: "2026-01-15",
      },
      {
        id: "emp-003",
        name: "Tom Okafor",
        role: "Software Engineer",
        team: "Engineering",
        managerId: "emp-001",
        tenureMonths: 9,
        performanceScore: 3.2,
        lastReviewDate: "2026-01-15",
      },
      {
        id: "emp-004",
        name: "Lin Zhang",
        role: "Software Engineer",
        team: "Engineering",
        managerId: "emp-001",
        tenureMonths: 14,
        performanceScore: 3.8,
        lastReviewDate: "2026-01-15",
      },
      // Product
      {
        id: "emp-005",
        name: "Jordan Lee",
        role: "Head of Product",
        team: "Product",
        managerId: null,
        tenureMonths: 28,
        performanceScore: 4.6,
        lastReviewDate: "2026-01-20",
      },
      {
        id: "emp-006",
        name: "Amara Diallo",
        role: "Product Manager",
        team: "Product",
        managerId: "emp-005",
        tenureMonths: 11,
        performanceScore: 3.5,
        lastReviewDate: "2026-01-20",
      },
      {
        id: "emp-007",
        name: "Chris Babatunde",
        role: "UX Designer",
        team: "Product",
        managerId: "emp-005",
        tenureMonths: 19,
        performanceScore: 4.2,
        lastReviewDate: "2026-01-20",
      },
      // Sales
      {
        id: "emp-008",
        name: "Sarah Kim",
        role: "Account Executive",
        team: "Sales",
        managerId: "emp-009",
        tenureMonths: 22,
        performanceScore: 4.7,
        lastReviewDate: "2026-02-01",
      },
      {
        id: "emp-009",
        name: "Marcus Webb",
        role: "Head of Sales",
        team: "Sales",
        managerId: null,
        tenureMonths: 30,
        performanceScore: 4.3,
        lastReviewDate: "2026-02-01",
      },
      {
        id: "emp-010",
        name: "Dana Osei",
        role: "Sales Development Representative",
        team: "Sales",
        managerId: "emp-009",
        tenureMonths: 6,
        performanceScore: 2.9,
        lastReviewDate: "2026-02-01",
      },
      // Customer Success
      {
        id: "emp-011",
        name: "Fatima Hassan",
        role: "Head of Customer Success",
        team: "Customer Success",
        managerId: null,
        tenureMonths: 32,
        performanceScore: 4.4,
        lastReviewDate: "2026-02-05",
      },
      {
        id: "emp-012",
        name: "Ryan Park",
        role: "Customer Success Manager",
        team: "Customer Success",
        managerId: "emp-011",
        tenureMonths: 16,
        performanceScore: 3.6,
        lastReviewDate: "2026-02-05",
      },
      {
        id: "emp-013",
        name: "Nia Thompson",
        role: "Customer Success Manager",
        team: "Customer Success",
        managerId: "emp-011",
        tenureMonths: 8,
        performanceScore: 2.8,
        lastReviewDate: "2026-02-05",
      },
      // Marketing
      {
        id: "emp-014",
        name: "Luca Ferretti",
        role: "Head of Marketing",
        team: "Marketing",
        managerId: null,
        tenureMonths: 20,
        performanceScore: 4.1,
        lastReviewDate: "2026-02-10",
      },
      {
        id: "emp-015",
        name: "Sophie Müller",
        role: "Content Strategist",
        team: "Marketing",
        managerId: "emp-014",
        tenureMonths: 13,
        performanceScore: 4.0,
        lastReviewDate: "2026-02-10",
      },
      {
        id: "emp-016",
        name: "Kwame Asante",
        role: "Growth Marketer",
        team: "Marketing",
        managerId: "emp-014",
        tenureMonths: 7,
        performanceScore: 3.3,
        lastReviewDate: "2026-02-10",
      },
      // Operations
      {
        id: "emp-017",
        name: "Ingrid Svensson",
        role: "Head of Operations",
        team: "Operations",
        managerId: null,
        tenureMonths: 40,
        performanceScore: 4.9,
        lastReviewDate: "2026-01-25",
      },
      {
        id: "emp-018",
        name: "Bayo Adeyemi",
        role: "Operations Analyst",
        team: "Operations",
        managerId: "emp-017",
        tenureMonths: 10,
        performanceScore: 3.7,
        lastReviewDate: "2026-01-25",
      },
    ],
    surveyResults: [
      {
        team: "Engineering",
        responseRate: 100,
        engagementScore: 7.2,
        burnoutRiskScore: 6.8,
        topConcern: "Unclear sprint priorities and too many context switches.",
      },
      {
        team: "Product",
        responseRate: 100,
        engagementScore: 6.5,
        burnoutRiskScore: 7.4,
        topConcern: "Stakeholder pressure is affecting roadmap stability.",
      },
      {
        team: "Sales",
        responseRate: 67,
        engagementScore: 5.8,
        burnoutRiskScore: 7.9,
        topConcern: "Quota targets feel unrealistic given current lead volume.",
      },
      {
        team: "Customer Success",
        responseRate: 100,
        engagementScore: 5.2,
        burnoutRiskScore: 8.5,
        topConcern: "Understaffed — one team member handling too many accounts.",
      },
      {
        team: "Marketing",
        responseRate: 100,
        engagementScore: 7.8,
        burnoutRiskScore: 4.2,
        topConcern: "Would benefit from better tooling for campaign analytics.",
      },
      {
        team: "Operations",
        responseRate: 100,
        engagementScore: 8.4,
        burnoutRiskScore: 3.1,
        topConcern: "Some manual processes could be automated.",
      },
    ],
    atRiskEmployees: ["emp-010", "emp-013"],
    alerts: [
      "Customer Success team has the highest burnout risk score (8.5) — urgent coaching intervention recommended.",
      "Sales team survey response rate was only 67% — follow up with non-respondents.",
      "Dana Osei (emp-010) and Nia Thompson (emp-013) have performance scores below 3.0 — both flagged as at-risk.",
      "Product team burnout risk has increased 1.2 points since last quarter.",
    ],
  };
}
