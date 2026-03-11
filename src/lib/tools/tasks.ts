// Tasks Tool — live engineering issues and pull requests from GitHub
// Authenticates via GITHUB_PERSONAL_ACCESS_TOKEN environment variable.
// Repository is configured via GITHUB_REPO_OWNER and GITHUB_REPO_NAME.

// ─── GitHub API Types ─────────────────────────────────────────────────────────

export interface GitHubLabel {
  name: string;
  color: string;
}

export interface GitHubUser {
  login: string;
  html_url: string;
}

export interface GitHubMilestone {
  title: string;
  due_on: string | null;
  state: "open" | "closed";
}

export interface GitHubIssue {
  number: number;
  title: string;
  state: "open" | "closed";
  body: string | null;
  labels: GitHubLabel[];
  assignees: GitHubUser[];
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  milestone: GitHubMilestone | null;
  // Present only when the issue is actually a pull request
  pull_request?: { merged_at: string | null };
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  state: "open" | "closed";
  draft: boolean;
  body: string | null;
  labels: GitHubLabel[];
  assignees: GitHubUser[];
  requested_reviewers: GitHubUser[];
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  html_url: string;
  head: { ref: string };
  base: { ref: string };
}

// ─── Computed Metrics ─────────────────────────────────────────────────────────

export interface IssueMetrics {
  openCount: number;
  unassignedCount: number;
  staleCount: number; // not updated in > 14 days
  byLabel: Record<string, number>;
  criticalOrBlockingIssues: GitHubIssue[];
}

export interface PRMetrics {
  openCount: number;
  draftCount: number;
  readyForReviewCount: number;
  stalePRs: GitHubPullRequest[]; // open, not updated in > 7 days
  awaitingReview: GitHubPullRequest[]; // open, not draft, has requested reviewers
  recentlyMergedCount: number; // merged in the last 30 days (throughput signal)
}

export interface EngineeringThroughput {
  issuesClosedLast30Days: number;
  prsMergedLast30Days: number;
  averagePRAgeDays: number; // average age of currently open PRs
}

export interface LiveTasksData {
  fetchedAt: string;
  repo: string;
  issues: IssueMetrics;
  pullRequests: PRMetrics;
  throughput: EngineeringThroughput;
  openIssues: GitHubIssue[];
  openPRs: GitHubPullRequest[];
  alerts: string[];
}

// ─── GitHub REST API Client ───────────────────────────────────────────────────

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_PERSONAL_ACCESS_TOKEN is not set. Add it to your .env file."
    );
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "founder-os/1.0",
  };
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
    next: { revalidate: 300 }, // cache for 5 minutes in Next.js
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `GitHub API error ${response.status} on ${path}: ${errorBody}`
    );
  }

  return response.json() as Promise<T>;
}

async function fetchAllPages<T>(
  path: string,
  perPage = 100
): Promise<T[]> {
  const separator = path.includes("?") ? "&" : "?";
  const url = `${path}${separator}per_page=${perPage}&page=1`;
  return githubFetch<T[]>(url);
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function fetchOpenIssues(
  owner: string,
  repo: string
): Promise<GitHubIssue[]> {
  const all = await fetchAllPages<GitHubIssue>(
    `/repos/${owner}/${repo}/issues?state=open`
  );
  // GitHub issues endpoint returns PRs too — filter them out
  return all.filter((i) => !i.pull_request);
}

async function fetchOpenPullRequests(
  owner: string,
  repo: string
): Promise<GitHubPullRequest[]> {
  return fetchAllPages<GitHubPullRequest>(
    `/repos/${owner}/${repo}/pulls?state=open`
  );
}

async function fetchRecentlyClosed(
  owner: string,
  repo: string
): Promise<{ closedIssues: GitHubIssue[]; mergedPRs: GitHubPullRequest[] }> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [closedIssues, closedPRs] = await Promise.all([
    fetchAllPages<GitHubIssue>(
      `/repos/${owner}/${repo}/issues?state=closed&since=${since}`
    ),
    fetchAllPages<GitHubPullRequest>(
      `/repos/${owner}/${repo}/pulls?state=closed`
    ),
  ]);

  const trueIssues = closedIssues.filter((i) => !i.pull_request);
  const mergedPRs = closedPRs.filter(
    (pr) => pr.merged_at && new Date(pr.merged_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  return { closedIssues: trueIssues, mergedPRs };
}

// ─── Metric Computation ───────────────────────────────────────────────────────

function daysSince(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24));
}

function computeIssueMetrics(issues: GitHubIssue[]): IssueMetrics {
  const byLabel: Record<string, number> = {};
  const criticalOrBlockingIssues: GitHubIssue[] = [];

  for (const issue of issues) {
    for (const label of issue.labels) {
      byLabel[label.name] = (byLabel[label.name] ?? 0) + 1;
    }
    const labelNames = issue.labels.map((l) => l.name.toLowerCase());
    if (
      labelNames.some((l) =>
        ["critical", "blocker", "blocked", "p0", "urgent"].includes(l)
      )
    ) {
      criticalOrBlockingIssues.push(issue);
    }
  }

  return {
    openCount: issues.length,
    unassignedCount: issues.filter((i) => i.assignees.length === 0).length,
    staleCount: issues.filter((i) => daysSince(i.updated_at) > 14).length,
    byLabel,
    criticalOrBlockingIssues,
  };
}

function computePRMetrics(
  openPRs: GitHubPullRequest[],
  mergedPRs: GitHubPullRequest[]
): PRMetrics {
  const stalePRs = openPRs.filter(
    (pr) => !pr.draft && daysSince(pr.updated_at) > 7
  );
  const awaitingReview = openPRs.filter(
    (pr) => !pr.draft && pr.requested_reviewers.length > 0
  );

  return {
    openCount: openPRs.length,
    draftCount: openPRs.filter((pr) => pr.draft).length,
    readyForReviewCount: openPRs.filter(
      (pr) => !pr.draft && pr.requested_reviewers.length === 0
    ).length,
    stalePRs,
    awaitingReview,
    recentlyMergedCount: mergedPRs.length,
  };
}

function computeThroughput(
  closedIssues: GitHubIssue[],
  mergedPRs: GitHubPullRequest[],
  openPRs: GitHubPullRequest[]
): EngineeringThroughput {
  const avgPRAge =
    openPRs.length === 0
      ? 0
      : Math.round(
          openPRs.reduce((sum, pr) => sum + daysSince(pr.created_at), 0) /
            openPRs.length
        );

  return {
    issuesClosedLast30Days: closedIssues.length,
    prsMergedLast30Days: mergedPRs.length,
    averagePRAgeDays: avgPRAge,
  };
}

function buildAlerts(
  issueMetrics: IssueMetrics,
  prMetrics: PRMetrics,
  throughput: EngineeringThroughput
): string[] {
  const alerts: string[] = [];

  if (issueMetrics.criticalOrBlockingIssues.length > 0) {
    alerts.push(
      `${issueMetrics.criticalOrBlockingIssues.length} critical or blocking issue(s) are open: ${issueMetrics.criticalOrBlockingIssues.map((i) => `#${i.number} "${i.title}"`).join(", ")}.`
    );
  }
  if (issueMetrics.staleCount > 3) {
    alerts.push(
      `${issueMetrics.staleCount} issues have not been updated in over 14 days — potential neglect.`
    );
  }
  if (issueMetrics.unassignedCount > 5) {
    alerts.push(
      `${issueMetrics.unassignedCount} open issues are unassigned — ownership gaps detected.`
    );
  }
  if (prMetrics.stalePRs.length > 0) {
    alerts.push(
      `${prMetrics.stalePRs.length} open PR(s) stale for > 7 days: ${prMetrics.stalePRs.map((p) => `#${p.number}`).join(", ")}.`
    );
  }
  if (throughput.averagePRAgeDays > 5) {
    alerts.push(
      `Average open PR age is ${throughput.averagePRAgeDays} days — review cycle may be a bottleneck.`
    );
  }
  if (throughput.prsMergedLast30Days < 5) {
    alerts.push(
      `Only ${throughput.prsMergedLast30Days} PRs merged in the last 30 days — throughput is low.`
    );
  }

  return alerts;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getLiveTasksData(): Promise<LiveTasksData> {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!owner || !repo) {
    throw new Error(
      "GITHUB_REPO_OWNER and GITHUB_REPO_NAME must be set in your .env file."
    );
  }

  const [openIssues, openPRs, { closedIssues, mergedPRs }] = await Promise.all([
    fetchOpenIssues(owner, repo),
    fetchOpenPullRequests(owner, repo),
    fetchRecentlyClosed(owner, repo),
  ]);

  const issueMetrics = computeIssueMetrics(openIssues);
  const prMetrics = computePRMetrics(openPRs, mergedPRs);
  const throughput = computeThroughput(closedIssues, mergedPRs, openPRs);
  const alerts = buildAlerts(issueMetrics, prMetrics, throughput);

  return {
    fetchedAt: new Date().toISOString(),
    repo: `${owner}/${repo}`,
    issues: issueMetrics,
    pullRequests: prMetrics,
    throughput,
    openIssues,
    openPRs,
    alerts,
  };
}
