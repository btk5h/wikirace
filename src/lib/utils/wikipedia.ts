import axios from "axios";
import { nextUid } from "./uid";

const api = axios.create({
  baseURL: "https://en.wikipedia.org/w/api.php",
  headers: {
    "Api-User-Agent": "Wikirace/1.0.0 (https://github.com/btk5h/wikirace)",
  },
  params: {
    origin: "*",
    format: "json",
    formatversion: 2,
  },
});

export async function resolvePage(title: string): Promise<string | null> {
  if (!title) {
    return null;
  }

  // The action=opensearch api is used here instead of action=query api as the former is more lenient than the latter
  const result = await api.get("", {
    params: {
      action: "opensearch",
      search: title,
      namespace: 0,
      limit: 1,
      redirects: "resolve",
    },
  });

  return result.data[1][0];
}

export async function randomPage(): Promise<string> {
  // The naive approach is to use the list=random api to retrieve a random page.
  // This is good at giving us a uniformly random article, but we would like to select interesting pages that are likely
  // to lead to interesting routes. To do this, we instead select multiple random pages and return the longest one.
  // Sorting by metrics such as pageviews/links/linkshere may also be interesting, but those methods may require
  // multiple api requests as wikipedia will paginate the results.
  const result = await api.get("", {
    params: {
      action: "query",
      prop: "info",
      generator: "random",
      grnnamespace: 0,
      grnfilterredir: "nonredirects",
      grnlimit: 10,
      requestId: nextUid()
    },
  });

  const pages: any = Object.values(result.data.query.pages);

  pages.sort((a, b) => b.length - a.length);

  return pages[0].title;
}

interface PageInfo {
  title: string;
  html: string;
}

export async function fetchPage(title: string): Promise<PageInfo> {
  const result = await api.get("", {
    params: {
      action: "parse",
      page: title,
      useskin: "vector",
      redirects: true,
      disablelimitreport: true,
      disableeditsection: true,
    },
  });

  return {
    title: result.data.parse.title,
    html: result.data.parse.text,
  };
}

const STANDARD_NAMESPACES = [
  "User",
  "Wikipedia",
  "File",
  "MediaWiki",
  "Template",
  "Help",
  "Category",
  "Portal",
  "Book",
  "Draft",
  "Educational Program",
  "TimedText",
  "Module",
];

export const BLOCKED_NAMESPACES = new Set([
  "Talk",
  ...STANDARD_NAMESPACES,
  ...STANDARD_NAMESPACES.map((ns) => `${ns} talk`),
  "Special",
  "Media",
]);
