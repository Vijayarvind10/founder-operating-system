// Notifications Tool — send automated nudges via email or team messaging platforms

export type NotificationChannel = "email" | "slack" | "teams";
export type NotificationStatus = "queued" | "sent" | "failed";

export interface NudgeDraft {
  id: string;
  recipientName: string;
  recipientEmail: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  scheduledFor: string;
  status: NotificationStatus;
  approvedByHuman: boolean;
}

export interface NotificationsData {
  reportGeneratedAt: string;
  pendingApprovalCount: number;
  nudgeDrafts: NudgeDraft[];
}

export function getNotificationsData(): NotificationsData {
  return {
    reportGeneratedAt: "2026-03-10T08:00:00Z",
    pendingApprovalCount: 3,
    nudgeDrafts: [
      {
        id: "nudge-001",
        recipientName: "Alex Rivera",
        recipientEmail: "alex.rivera@company.com",
        channel: "slack",
        subject: "Team check-in reminder",
        body: "Hey Alex — the Engineering team's burnout risk score has ticked up this quarter. It might be worth scheduling a short 1:1 this week to check in on sprint load and see if priorities need rebalancing.",
        scheduledFor: "2026-03-11T09:00:00Z",
        status: "queued",
        approvedByHuman: false,
      },
      {
        id: "nudge-002",
        recipientName: "Fatima Hassan",
        recipientEmail: "fatima.hassan@company.com",
        channel: "email",
        subject: "Customer Success capacity concern",
        body: "Hi Fatima, the latest survey shows Customer Success has the highest burnout risk score in the company (8.5/10). Nia Thompson is flagged as at-risk. Would it help to discuss headcount or account redistribution before end of quarter?",
        scheduledFor: "2026-03-11T09:30:00Z",
        status: "queued",
        approvedByHuman: false,
      },
      {
        id: "nudge-003",
        recipientName: "Marcus Webb",
        recipientEmail: "marcus.webb@company.com",
        channel: "slack",
        subject: "Pipeline follow-up: Cobalt Systems and Elevate Health",
        body: "Marcus — two deals need attention: Cobalt Systems has had no activity in 14 days and Elevate Health has been in Prospecting for 21 days. Recommend outreach this week to keep both deals warm.",
        scheduledFor: "2026-03-11T10:00:00Z",
        status: "queued",
        approvedByHuman: false,
      },
      {
        id: "nudge-004",
        recipientName: "Jordan Lee",
        recipientEmail: "jordan.lee@company.com",
        channel: "email",
        subject: "Product team roadmap stability — burnout risk rising",
        body: "Hi Jordan, stakeholder pressure was cited as the top concern in the Product team survey and burnout risk is up 1.2 points this quarter. A roadmap alignment session with stakeholders could help reduce uncertainty for the team.",
        scheduledFor: "2026-03-12T09:00:00Z",
        status: "queued",
        approvedByHuman: false,
      },
      {
        id: "nudge-005",
        recipientName: "Sarah Kim",
        recipientEmail: "sarah.kim@company.com",
        channel: "slack",
        subject: "Closed lost follow-up: Greenline Media",
        body: "Sarah — the Greenline Media deal closed lost last week. It would be worth a brief retro call to document the loss reason and see if there's a re-engagement path in 6 months.",
        scheduledFor: "2026-03-13T10:00:00Z",
        status: "sent",
        approvedByHuman: true,
      },
    ],
  };
}

export interface SendNudgeResult {
  success: boolean;
  nudgeId: string;
  message: string;
}

// Simulates dispatching a nudge — in production this would call an email or Slack API
export function sendNudge(nudgeId: string): SendNudgeResult {
  return {
    success: true,
    nudgeId,
    message: `Nudge ${nudgeId} has been queued for delivery. Pending human approval before send.`,
  };
}
