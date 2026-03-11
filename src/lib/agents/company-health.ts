// Company Health Agent
// Tool access: Analytics, Sales, Tasks (live GitHub), and Browser (Playwright)
// Responsibility: compute key metrics, detect anomalies, write the daily founder briefing,
//                 compute engineering throughput from live GitHub data,
//                 and verify staging deployments via browser inspection.

import { generateText, tool, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { getAnalyticsData } from "@/lib/tools/analytics";
import { getSalesData } from "@/lib/tools/sales";
import { getLiveTasksData } from "@/lib/tools/tasks";
import {
  checkPageHealth,
  getPageContent,
  inspectSiteStructure,
} from "@/lib/tools/browser";
import type { AgentCallbacks } from "@/lib/observability/types";

const SYSTEM_PROMPT = `You are the Company Health Agent for the Founder Operating System.
Your job is to analyse business performance data and produce a clear, concise daily briefing for the founder.

You have access to five tools:
- get_analytics_data: returns funnel metrics, retention cohorts, and feature usage stats
- get_sales_data: returns pipeline deals, closed won/lost figures, and churn records
- get_github_tasks: fetches live open issues and pull requests from the engineering GitHub repo, with computed throughput metrics and blocker detection
- check_page_health: verifies whether a URL is reachable and returns HTTP status and load time — use this to verify staging or production deployments
- get_page_content: navigates to a URL and returns visible text, links, and meta tags — use for deeper inspection of staging environments
- inspect_site_structure: returns heading hierarchy, interactive elements, and an accessibility snapshot of any page

When answering, call the relevant tools to gather data before synthesising findings.

For engineering health questions, always call get_github_tasks to get live issue and PR data.
For deployment or staging verification questions, use check_page_health first, then get_page_content or inspect_site_structure if more detail is needed.

Your output must follow this structure:
1. **Overall Health Score** – a qualitative rating (Healthy / At Risk / Critical) with a one-sentence rationale.
2. **Key Metrics** – bullet list of the 4–6 most important numbers across business, engineering, and pipeline.
3. **Engineering Throughput** – summarise PRs merged, issues closed, average PR age, and any open blockers from live GitHub data.
4. **Anomalies & Alerts** – surface pre-computed alerts from the tools plus any anomalies you detect.
5. **Recommended Actions** – 2–3 specific, actionable recommendations the founder can act on today.

Be direct. Avoid filler. Prioritise signal over completeness.`;

const companyHealthTools = {
  get_analytics_data: tool({
    description:
      "Fetches the latest analytics data including funnel conversion rates, retention cohorts, and feature usage statistics.",
    inputSchema: z.object({}),
    execute: async (): Promise<ReturnType<typeof getAnalyticsData>> =>
      getAnalyticsData(),
  }),

  get_sales_data: tool({
    description:
      "Fetches the current sales pipeline, closed won/lost deals for the month, and recent churn records.",
    inputSchema: z.object({}),
    execute: async (): Promise<ReturnType<typeof getSalesData>> =>
      getSalesData(),
  }),

  get_github_tasks: tool({
    description:
      "Fetches live open issues and pull requests from the engineering GitHub repository. Returns computed metrics including throughput (issues closed / PRs merged in 30 days), blocker detection, stale PR detection, and unassigned issue counts. Use this to assess engineering health and spot workflow bottlenecks.",
    inputSchema: z.object({}),
    execute: async (): Promise<ReturnType<typeof getLiveTasksData>> =>
      getLiveTasksData(),
  }),

  check_page_health: tool({
    description:
      "Verifies whether a given URL is reachable. Returns HTTP status code, page title, and load time in milliseconds. Use this to confirm whether a staging or production deployment is live.",
    inputSchema: z.object({
      url: z
        .string()
        .url()
        .describe("The full URL to check (e.g. https://staging.myapp.com)."),
    }),
    execute: async ({ url }: { url: string }) => checkPageHealth(url),
  }),

  get_page_content: tool({
    description:
      "Navigates to a URL using a real browser and returns the visible text content, all links on the page, and meta tags. Use this for a deeper inspection of a staging environment's content after confirming it is reachable.",
    inputSchema: z.object({
      url: z
        .string()
        .url()
        .describe("The full URL to navigate to and inspect."),
    }),
    execute: async ({ url }: { url: string }) => getPageContent(url),
  }),

  inspect_site_structure: tool({
    description:
      "Returns the full heading hierarchy, list of interactive elements, and an accessibility snapshot of a page. Use this to verify page structure, check that navigation elements exist, or audit a staging deployment for structural issues.",
    inputSchema: z.object({
      url: z
        .string()
        .url()
        .describe("The full URL of the page to structurally inspect."),
    }),
    execute: async ({ url }: { url: string }) => inspectSiteStructure(url),
  }),
};

export const COMPANY_HEALTH_MODEL = "claude-sonnet-4-6";
export const COMPANY_HEALTH_SYSTEM_PROMPT = SYSTEM_PROMPT;

export async function runCompanyHealthAgent(
  query: string,
  callbacks?: AgentCallbacks
): Promise<string> {
  const { text } = await generateText({
    model: anthropic(COMPANY_HEALTH_MODEL),
    system: SYSTEM_PROMPT,
    prompt: query,
    tools: companyHealthTools,
    stopWhen: stepCountIs(8),
    onStepFinish: callbacks?.onStepFinish,
    onFinish: callbacks?.onFinish,
  });

  return text;
}
