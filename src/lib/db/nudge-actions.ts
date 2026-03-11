"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Nudge, NudgeStatus, NudgeChannel } from "@/generated/prisma/client";

// ─── Serialisable DTO passed to client components ─────────────────────────────

export interface NudgeRow {
  id: string;
  recipientName: string;
  recipientEmail: string;
  channel: NudgeChannel;
  subject: string;
  body: string;
  scheduledFor: string; // ISO string — Date is not serialisable across the server/client boundary
  status: NudgeStatus;
  agentGenerated: boolean;
  createdAt: string;
}

function toRow(nudge: Nudge): NudgeRow {
  return {
    id: nudge.id,
    recipientName: nudge.recipientName,
    recipientEmail: nudge.recipientEmail,
    channel: nudge.channel,
    subject: nudge.subject,
    body: nudge.body,
    scheduledFor: nudge.scheduledFor.toISOString(),
    status: nudge.status,
    agentGenerated: nudge.agentGenerated,
    createdAt: nudge.createdAt.toISOString(),
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getNudges(): Promise<NudgeRow[]> {
  const nudges = await prisma.nudge.findMany({
    orderBy: { scheduledFor: "asc" },
  });
  return nudges.map(toRow);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function approveNudge(id: string): Promise<void> {
  await prisma.nudge.update({
    where: { id },
    data: { status: "APPROVED" },
  });
  revalidatePath("/nudges");
}

export async function rejectNudge(id: string): Promise<void> {
  await prisma.nudge.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/nudges");
}

export async function updateNudgeBody(id: string, body: string): Promise<void> {
  await prisma.nudge.update({
    where: { id },
    data: { body },
  });
  revalidatePath("/nudges");
}

// ─── Agent persistence ────────────────────────────────────────────────────────

export interface CreateNudgeInput {
  recipientName: string;
  recipientEmail: string;
  channel: NudgeChannel;
  subject: string;
  body: string;
  scheduledFor: string; // ISO string from the agent
}

export async function createNudge(input: CreateNudgeInput): Promise<NudgeRow> {
  const nudge = await prisma.nudge.create({
    data: {
      recipientName: input.recipientName,
      recipientEmail: input.recipientEmail,
      channel: input.channel,
      subject: input.subject,
      body: input.body,
      scheduledFor: new Date(input.scheduledFor),
      status: "PENDING",
      agentGenerated: true,
    },
  });
  revalidatePath("/nudges");
  return toRow(nudge);
}
