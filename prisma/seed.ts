// Seed script — populates the database with the initial mock data from the notifications tool.
// Run with: npx prisma db seed

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database…");

  // ─── Clear existing rows ───────────────────────────────────────────────────
  await prisma.systemAlert.deleteMany();
  await prisma.employeeInsight.deleteMany();
  await prisma.nudge.deleteMany();

  // ─── Nudges ───────────────────────────────────────────────────────────────
  await prisma.nudge.createMany({
    data: [
      {
        recipientName: "Alex Rivera",
        recipientEmail: "alex.rivera@company.com",
        channel: "SLACK",
        subject: "Team check-in reminder",
        body: "Hey Alex — the Engineering team's burnout risk score has ticked up this quarter. It might be worth scheduling a short 1:1 this week to check in on sprint load and see if priorities need rebalancing.",
        scheduledFor: new Date("2026-03-11T09:00:00Z"),
        status: "PENDING",
      },
      {
        recipientName: "Fatima Hassan",
        recipientEmail: "fatima.hassan@company.com",
        channel: "EMAIL",
        subject: "Customer Success capacity concern",
        body: "Hi Fatima, the latest survey shows Customer Success has the highest burnout risk score in the company (8.5/10). Nia Thompson is flagged as at-risk. Would it help to discuss headcount or account redistribution before end of quarter?",
        scheduledFor: new Date("2026-03-11T09:30:00Z"),
        status: "PENDING",
      },
      {
        recipientName: "Marcus Webb",
        recipientEmail: "marcus.webb@company.com",
        channel: "SLACK",
        subject: "Pipeline follow-up: Cobalt Systems and Elevate Health",
        body: "Marcus — two deals need attention: Cobalt Systems has had no activity in 14 days and Elevate Health has been in Prospecting for 21 days. Recommend outreach this week to keep both deals warm.",
        scheduledFor: new Date("2026-03-11T10:00:00Z"),
        status: "PENDING",
      },
      {
        recipientName: "Jordan Lee",
        recipientEmail: "jordan.lee@company.com",
        channel: "EMAIL",
        subject: "Product team roadmap stability — burnout risk rising",
        body: "Hi Jordan, stakeholder pressure was cited as the top concern in the Product team survey and burnout risk is up 1.2 points this quarter. A roadmap alignment session with stakeholders could help reduce uncertainty for the team.",
        scheduledFor: new Date("2026-03-12T09:00:00Z"),
        status: "PENDING",
      },
      {
        recipientName: "Sarah Kim",
        recipientEmail: "sarah.kim@company.com",
        channel: "SLACK",
        subject: "Closed lost follow-up: Greenline Media",
        body: "Sarah — the Greenline Media deal closed lost last week. It would be worth a brief retro call to document the loss reason and see if there's a re-engagement path in 6 months.",
        scheduledFor: new Date("2026-03-13T10:00:00Z"),
        status: "SENT",
      },
    ],
  });

  // ─── Employee Insights ────────────────────────────────────────────────────
  await prisma.employeeInsight.createMany({
    data: [
      {
        employeeId: "emp-013",
        employeeName: "Nia Thompson",
        team: "Customer Success",
        insightType: "BURNOUT_RISK",
        severity: "CRITICAL",
        summary:
          "Nia's performance score has dropped to 2.8 and the Customer Success team has the highest burnout risk in the org (8.5/10). She is managing too many accounts for one person.",
        recommendation:
          "Schedule an immediate 1:1 with Fatima Hassan to discuss workload redistribution. Consider temporary account transfers until headcount is addressed.",
      },
      {
        employeeId: "emp-010",
        employeeName: "Dana Osei",
        team: "Sales",
        insightType: "PERFORMANCE_DROP",
        severity: "HIGH",
        summary:
          "Dana is 6 months into the role with a performance score of 2.9. SDR ramp typically takes 3–6 months so this is the critical review window.",
        recommendation:
          "Marcus Webb should run a structured 30-day coaching plan: daily pipeline reviews, call shadowing, and clear quota milestones with weekly check-ins.",
      },
      {
        employeeId: "emp-003",
        employeeName: "Tom Okafor",
        team: "Engineering",
        insightType: "ENGAGEMENT_LOW",
        severity: "MEDIUM",
        summary:
          "Tom's performance score (3.2) is the lowest on the Engineering team. Two of his current tasks are blocked or stalled, suggesting he may be under-resourced or unclear on priorities.",
        recommendation:
          "Alex Rivera should unblock ENG-203 this sprint and schedule a priority-alignment 1:1. Clarify growth path and assess whether additional support is needed.",
      },
    ],
  });

  // ─── System Alerts ────────────────────────────────────────────────────────
  await prisma.systemAlert.createMany({
    data: [
      {
        source: "company_health",
        title: "MTD churn exceeding target",
        detail: "Month-to-date churn of $32K is tracking above the $25K monthly target. Two accounts churned in the first week of March.",
        severity: "WARNING",
      },
      {
        source: "company_health",
        title: "Critical bug due tomorrow",
        detail: "ENG-208 is a Critical priority bug (analytics funnel miscounting) due 2026-03-11. Only 1 day remaining and the fix is in progress.",
        severity: "CRITICAL",
      },
      {
        source: "people_coach",
        title: "Customer Success burnout risk at 8.5/10",
        detail: "The Customer Success team has the highest burnout risk score in the organisation. Nia Thompson is flagged as at-risk with a performance score of 2.8.",
        severity: "CRITICAL",
      },
      {
        source: "people_coach",
        title: "Sales survey response rate low",
        detail: "Only 67% of the Sales team responded to the latest engagement survey. Follow up with non-respondents to get a full picture.",
        severity: "WARNING",
      },
      {
        source: "company_health",
        title: "Sprint 24 velocity decreasing",
        detail: "21 of 52 story points completed with 7 days remaining. Two tasks are blocked. Sprint velocity trend is marked as decreasing.",
        severity: "WARNING",
      },
      {
        source: "nudging",
        title: "4 nudge drafts awaiting approval",
        detail: "The Nudging Agent has queued 4 communication drafts for founder review. None have been approved yet.",
        severity: "INFO",
      },
    ],
  });

  const nudgeCount = await prisma.nudge.count();
  const insightCount = await prisma.employeeInsight.count();
  const alertCount = await prisma.systemAlert.count();

  console.log(`✓ Seeded ${nudgeCount} nudges, ${insightCount} employee insights, ${alertCount} system alerts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
