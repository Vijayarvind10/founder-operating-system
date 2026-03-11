// Nudging Agent
// Tool access: Notifications only (restricted per common.md separation of concerns)
// Responsibility: turn insights into scheduled communication drafts for human approval
// All generated nudges are persisted to the database immediately.

import { generateText, tool, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { NudgeChannel } from "@/generated/prisma/client";
import type { AgentCallbacks } from "@/lib/observability/types";

const SYSTEM_PROMPT = `You are the Nudging Agent for the Founder Operating System.
Your job is to review pending nudge drafts and help the founder manage outbound communications to their team.

You have access to three tools:
- get_nudges: reads all current nudge drafts from the database, including their approval status, channel, recipient, and scheduled time
- save_nudge_draft: persists a new AI-generated nudge draft to the database (status defaults to PENDING)
- update_nudge_status: marks an existing nudge as APPROVED or REJECTED in the database

IMPORTANT: Never update a nudge status to APPROVED without the founder explicitly requesting it. Your default behaviour is to surface and summarise pending drafts.

When answering:
- Always call get_nudges first to see the current state.
- If asked to review pending nudges, present each PENDING draft with: recipient, channel, subject, scheduled time, and body.
- If the founder asks to draft a new nudge, call save_nudge_draft with the full details — do not just describe the nudge in text.
- If the founder approves a nudge by ID, call update_nudge_status with status APPROVED.
- If the founder rejects a nudge by ID, call update_nudge_status with status REJECTED.

This is a human-in-the-loop system. Always confirm any status changes back to the founder.`;

const nudgingTools = {
  get_nudges: tool({
    description:
      "Reads all nudge drafts from the database, ordered by scheduled time. Returns recipient, channel, subject, body, scheduled time, and current status.",
    inputSchema: z.object({}),
    execute: async () => {
      const nudges = await prisma.nudge.findMany({
        orderBy: { scheduledFor: "asc" },
      });
      return nudges.map((n: { scheduledFor: Date; [key: string]: unknown }) => ({
        ...n,
        scheduledFor: n.scheduledFor.toISOString(),
      }));
    },
  }),

  save_nudge_draft: tool({
    description:
      "Persists a new AI-generated nudge draft to the database with PENDING status. Call this whenever the founder asks you to create a new nudge.",
    inputSchema: z.object({
      recipientName: z.string().describe("Full name of the message recipient."),
      recipientEmail: z.string().email().describe("Email address of the recipient."),
      channel: z
        .enum(["EMAIL", "SLACK", "TEAMS"])
        .describe("Delivery channel for the nudge."),
      subject: z.string().describe("Short subject line for the nudge."),
      body: z.string().describe("Full message body of the nudge."),
      scheduledFor: z
        .string()
        .describe("ISO 8601 datetime string for when the nudge should be sent."),
    }),
    execute: async ({
      recipientName,
      recipientEmail,
      channel,
      subject,
      body,
      scheduledFor,
    }: {
      recipientName: string;
      recipientEmail: string;
      channel: NudgeChannel;
      subject: string;
      body: string;
      scheduledFor: string;
    }) => {
      const nudge = await prisma.nudge.create({
        data: {
          recipientName,
          recipientEmail,
          channel,
          subject,
          body,
          scheduledFor: new Date(scheduledFor),
          status: "PENDING",
          agentGenerated: true,
        },
      });
      return {
        success: true,
        id: nudge.id,
        message: `Nudge draft saved with ID ${nudge.id}. Status is PENDING — awaiting founder approval.`,
      };
    },
  }),

  update_nudge_status: tool({
    description:
      "Updates the status of an existing nudge in the database. Use APPROVED when the founder approves, REJECTED when they decline.",
    inputSchema: z.object({
      nudgeId: z.string().describe("The database ID of the nudge to update."),
      status: z
        .enum(["APPROVED", "REJECTED"])
        .describe("The new status to set on the nudge."),
    }),
    execute: async ({ nudgeId, status }: { nudgeId: string; status: "APPROVED" | "REJECTED" }) => {
      const nudge = await prisma.nudge.update({
        where: { id: nudgeId },
        data: { status },
      });
      return {
        success: true,
        id: nudge.id,
        status: nudge.status,
        message: `Nudge ${nudge.id} has been marked as ${status}.`,
      };
    },
  }),
};

export const NUDGING_MODEL = "claude-sonnet-4-6";
export const NUDGING_SYSTEM_PROMPT = SYSTEM_PROMPT;

export async function runNudgingAgent(
  query: string,
  callbacks?: AgentCallbacks
): Promise<string> {
  const { text } = await generateText({
    model: anthropic(NUDGING_MODEL),
    system: SYSTEM_PROMPT,
    prompt: query,
    tools: nudgingTools,
    stopWhen: stepCountIs(5),
    onStepFinish: callbacks?.onStepFinish,
    onFinish: callbacks?.onFinish,
  });

  return text;
}
