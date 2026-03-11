// Browser Tool — web navigation and page inspection via Playwright
// Mirrors the capabilities exposed by the official Playwright MCP server
// (https://github.com/microsoft/playwright-mcp) as a Vercel AI SDK tool.
//
// Prerequisites: run `npx playwright install chromium` once to download the browser binary.

import { chromium, type Browser } from "playwright";

// ─── Result Types ─────────────────────────────────────────────────────────────

export interface PageHealthResult {
  url: string;
  reachable: boolean;
  httpStatus: number | null;
  title: string | null;
  loadTimeMs: number;
  errorMessage: string | null;
}

export interface PageContentResult {
  url: string;
  title: string;
  httpStatus: number;
  // Visible text body — capped at 8 000 chars so the agent context stays manageable
  textContent: string;
  // Structured list of all links on the page
  links: Array<{ href: string; text: string }>;
  // Page-level meta tags useful for SEO / OG verification
  metaTags: Record<string, string>;
}

export interface SiteStructureResult {
  url: string;
  title: string;
  headings: Array<{ level: number; text: string }>;
  interactiveElements: Array<{ role: string; label: string }>;
  // Accessibility snapshot — same output as `browser_snapshot` in the MCP spec
  accessibilitySnapshot: string;
}

// ─── Browser Helper ───────────────────────────────────────────────────────────

async function withBrowser<T>(
  fn: (browser: Browser) => Promise<T>
): Promise<T> {
  const browser = await chromium.launch({ headless: true });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

// ─── Tool Functions ───────────────────────────────────────────────────────────

/**
 * Checks whether a URL is reachable, returns HTTP status, title, and load time.
 * Equivalent to: browser_navigate → browser_snapshot → browser_close in the Playwright MCP spec.
 */
export async function checkPageHealth(url: string): Promise<PageHealthResult> {
  const start = Date.now();
  try {
    return await withBrowser(async (browser) => {
      const page = await browser.newPage();
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 20_000,
      });
      const title = await page.title();
      return {
        url,
        reachable: true,
        httpStatus: response?.status() ?? null,
        title,
        loadTimeMs: Date.now() - start,
        errorMessage: null,
      };
    });
  } catch (err) {
    return {
      url,
      reachable: false,
      httpStatus: null,
      title: null,
      loadTimeMs: Date.now() - start,
      errorMessage: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Navigates to a URL and returns visible text, links, and meta tags.
 * Equivalent to: browser_navigate → browser_get_page_content in the Playwright MCP spec.
 */
export async function getPageContent(url: string): Promise<PageContentResult> {
  return withBrowser(async (browser) => {
    const page = await browser.newPage();
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });

    const [title, rawText, links, metaTags] = await Promise.all([
      page.title(),

      page.evaluate(() => document.body?.innerText ?? ""),

      page.evaluate(() =>
        Array.from(document.querySelectorAll("a[href]")).map((a) => ({
          href: (a as HTMLAnchorElement).href,
          text: (a as HTMLAnchorElement).innerText.trim().slice(0, 120),
        }))
      ),

      page.evaluate(() => {
        const tags: Record<string, string> = {};
        document.querySelectorAll("meta[name], meta[property]").forEach((el) => {
          const key =
            el.getAttribute("name") ?? el.getAttribute("property") ?? "";
          const value = el.getAttribute("content") ?? "";
          if (key) tags[key] = value;
        });
        return tags;
      }),
    ]);

    return {
      url,
      title,
      httpStatus: response?.status() ?? 200,
      textContent: rawText.slice(0, 8_000),
      links: links.slice(0, 50), // top 50 links
      metaTags,
    };
  });
}

/**
 * Returns the heading hierarchy, interactive elements, and an accessibility snapshot.
 * Equivalent to: browser_navigate → browser_snapshot in the Playwright MCP spec.
 */
export async function inspectSiteStructure(
  url: string
): Promise<SiteStructureResult> {
  return withBrowser(async (browser) => {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

    const [title, headings, interactiveElements] = await Promise.all([
      page.title(),

      page.evaluate(() =>
        Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map(
          (el) => ({
            level: parseInt(el.tagName[1]),
            text: (el as HTMLElement).innerText.trim(),
          })
        )
      ),

      page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "button, a, input, select, textarea, [role]"
          )
        )
          .slice(0, 60)
          .map((el) => ({
            role:
              el.getAttribute("role") ?? el.tagName.toLowerCase(),
            label:
              el.getAttribute("aria-label") ??
              el.getAttribute("placeholder") ??
              (el as HTMLElement).innerText?.trim().slice(0, 80) ??
              "",
          }))
      ),
    ]);

    // ARIA snapshot — mirrors browser_snapshot output from the Playwright MCP spec
    const accessibilitySnapshot = (
      await page.locator("body").ariaSnapshot()
    ).slice(0, 4_000);

    return { url, title, headings, interactiveElements, accessibilitySnapshot };
  });
}
