// Central Agent Router
// Takes a free-form user query, classifies it, and dispatches to the correct agent.
// Every call — classification and agent execution — is fully traced via the
// observability module and shipped to LangSmith when LANGSMITH_API_KEY is set.

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import {
  runCompanyHealthAgent,
  COMPANY_HEALTH_MODEL,
  COMPANY_HEALTH_SYSTEM_PROMPT,
} from "./company-health";
import {
  runPeopleCoachAgent,
  PEOPLE_COACH_MODEL,
  PEOPLE_COACH_SYSTEM_PROMPT,
} from "./people-coach";
import {
  runNudgingAgent,
  NUDGING_MODEL,
  NUDGING_SYSTEM_PROMPT,
} from "./nudging";
import { AgentTracer, lsCreateRun } from "@/lib/observability";

export type AgentType = "company-health" | "people-coach" | "nudging";

export interface RouterResult {
  agent: AgentType;
  response: string;
  traceId: string;
  langsmithRunId?: string;
}

const CLASSIFIER_MODEL = "claude-haiku-4-5-20251001";

const CLASSIFICATION_SYSTEM_PROMPT = `You are a routing classifier for the Founder Operating System.
Your only job is to read a user query and decide which of three specialist agents should handle it.

Agent definitions:
- company-health: handles questions about business metrics, revenue, sales pipeline, churn, product analytics, funnel data, retention, feature usage, engineering throughput, GitHub issues, and the daily founder briefing.
- people-coach: handles questions about team health, employee performance, burnout risk, engagement survey results, at-risk employees, and managerial coaching suggestions.
- nudging: handles requests to review, approve, edit, or send automated nudge messages or communication drafts to team members.

Return only the agent name. If the query is ambiguous, prefer company-health.`;

// ─── Agent metadata map ───────────────────────────────────────────────────────

const AGENT_META: Record<
  AgentType,
  { modelId: string; systemPrompt: string }
> = {
  "company-health": {
    modelId: COMPANY_HEALTH_MODEL,
    systemPrompt: COMPANY_HEALTH_SYSTEM_PROMPT,
  },
  "people-coach": {
    modelId: PEOPLE_COACH_MODEL,
    systemPrompt: PEOPLE_COACH_SYSTEM_PROMPT,
  },
  nudging: {
    modelId: NUDGING_MODEL,
    systemPrompt: NUDGING_SYSTEM_PROMPT,
  },
};

// ─── Classification ───────────────────────────────────────────────────────────

async function classifyQuery(
  query: string,
  parentRunId?: string
): Promise<{ agent: AgentType; reasoning: string; classifierRunId?: string }> {
  // Trace the classification step as its own LangSmith run
  const classifierRunId = await lsCreateRun({
    name: "classifier",
    inputs: { query, model: CLASSIFIER_MODEL },
    parentRunId,
  });

  const { object } = await generateObject({
    model: anthropic(CLASSIFIER_MODEL),
    system: CLASSIFICATION_SYSTEM_PROMPT,
    prompt: query,
    schema: z.object({
      agent: z.enum(["company-health", "people-coach", "nudging"]),
      reasoning: z
        .string()
        .describe("One sentence explaining why this agent was chosen."),
    }),
  });

  console.log(
    JSON.stringify({
      level: "info",
      event: "query_classified",
      agent: object.agent,
      reasoning: object.reasoning,
      model: CLASSIFIER_MODEL,
      classifierRunId: classifierRunId ?? null,
    })
  );

  return {
    agent: object.agent,
    reasoning: object.reasoning,
    classifierRunId,
  };
}

// ─── Main router ──────────────────────────────────────────────────────────────

export async function routeQuery(query: string): Promise<RouterResult> {
  // Create a root LangSmith run that parents both the classifier and agent runs
  const rootRunId = await lsCreateRun({
    name: "router",
    inputs: { query },
  });

  const { agent, classifierRunId } = await classifyQuery(query, rootRunId);
  void classifierRunId; // referenced only for LangSmith hierarchy

  const meta = AGENT_META[agent];
  const tracer = new AgentTracer({
    agentType: agent,
    modelId: meta.modelId,
    query,
    systemPrompt: meta.systemPrompt,
    parentRunId: rootRunId,
  });

  await tracer.start();

  let response: string;
  let finishReason = "stop";
  let error: string | undefined;

  try {
    const callbacks = tracer.callbacks();

    switch (agent) {
      case "company-health":
        response = await runCompanyHealthAgent(query, callbacks);
        break;
      case "people-coach":
        response = await runPeopleCoachAgent(query, callbacks);
        break;
      case "nudging":
        response = await runNudgingAgent(query, callbacks);
        break;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    finishReason = "error";
    response = `Agent error: ${error}`;
    console.error(
      JSON.stringify({
        level: "error",
        event: "agent_run_failed",
        agent,
        error,
        rootRunId,
      })
    );
  }

  const trace = await tracer.finish(response!, finishReason, error);

  return {
    agent,
    response: response!,
    traceId: trace.traceId,
    langsmithRunId: trace.langsmithRunId,
  };
}
