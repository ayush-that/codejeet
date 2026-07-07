export function shouldIncludeInSitemap(path: string): boolean {
  if (path.startsWith("/podcast")) return false;
  if (/^\/company\/[^/]+\/[^/]+$/.test(path)) return false;
  return true;
}

export function classifySitemapPath(urlPath: string): string {
  if (urlPath.startsWith("/company/")) return "company";
  if (urlPath.startsWith("/problem/")) return "problem";
  if (urlPath.startsWith("/topic/")) return "topic";
  if (urlPath.startsWith("/blog")) return "blog";
  if (urlPath.startsWith("/compare/")) return "compare";
  if (urlPath.startsWith("/system-design/")) return "system-design";
  if (
    urlPath === "/" ||
    urlPath === "/dashboard" ||
    urlPath === "/companies" ||
    urlPath === "/blog" ||
    urlPath.startsWith("/difficulty/") ||
    urlPath === "/system-design" ||
    urlPath === "/learn"
  ) {
    return "static";
  }
  return "other";
}
