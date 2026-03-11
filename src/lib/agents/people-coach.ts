// People Coach Agent
// Tool access: Human Resources only (restricted per common.md separation of concerns)
// Responsibility: identify at-risk teams, generate personalised managerial coaching suggestions

import { generateText, tool, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { getHRData } from "@/lib/tools/hr";
import type { AgentCallbacks } from "@/lib/observability/types";

const SYSTEM_PROMPT = `You are the People Coach Agent for the Founder Operating System.
Your job is to analyse team health data and produce personalised, actionable coaching suggestions for managers.

You have access to one tool:
- get_hr_data: returns the full employee roster, performance scores, team survey results, and at-risk employee flags

When answering, call the tool first to gather the latest people data, then synthesise your findings.

Your output must follow this structure:
1. **People Health Summary** – a one-paragraph overview of the organisation's current people health.
2. **At-Risk Teams** – list each team with an elevated burnout risk score (≥ 7.0) or low engagement score (≤ 6.0), along with the primary concern from their survey.
3. **At-Risk Individuals** – for each flagged employee, state their name, role, performance score, and a specific coaching suggestion for their manager.
4. **Manager Coaching Recommendations** – 2–4 concrete actions managers can take this week (1:1 topics, process changes, recognition opportunities).

Be empathetic but direct. Ground every suggestion in the actual data returned by the tool.`;

const peopleCoachTools = {
  get_hr_data: tool({
    description:
      "Fetches team structure, individual employee performance scores, internal survey results, burnout risk scores, and at-risk employee flags.",
    inputSchema: z.object({}),
    execute: async (): Promise<ReturnType<typeof getHRData>> => getHRData(),
  }),
};

export const PEOPLE_COACH_MODEL = "claude-sonnet-4-6";
export const PEOPLE_COACH_SYSTEM_PROMPT = SYSTEM_PROMPT;

export async function runPeopleCoachAgent(
  query: string,
  callbacks?: AgentCallbacks
): Promise<string> {
  const { text } = await generateText({
    model: anthropic(PEOPLE_COACH_MODEL),
    system: SYSTEM_PROMPT,
    prompt: query,
    tools: peopleCoachTools,
    stopWhen: stepCountIs(4),
    onStepFinish: callbacks?.onStepFinish,
    onFinish: callbacks?.onFinish,
  });

  return text;
}
