"""Read-only HTTP audit. Does not submit URLs, forms, or indexing requests."""

import concurrent.futures
import datetime
import html
import json
import pathlib
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from html.parser import HTMLParser


BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://ayurveddoctor.netlify.app").rstrip("/")
OUTPUT = pathlib.Path("reports/live-seo")
OUTPUT.mkdir(parents=True, exist_ok=True)
USER_AGENT = "AyurSiteAudit/1.0 (read-only technical SEO verification)"


class Redirects(urllib.request.HTTPRedirectHandler):
    def __init__(self):
        self.chain = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.chain.append({"from": req.full_url, "status": code, "to": newurl})
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def request(url, user_agent=USER_AGENT):
    redirects = Redirects()
    opener = urllib.request.build_opener(redirects)
    start = time.monotonic()
    for attempt in range(2):
        try:
            response = opener.open(
                urllib.request.Request(url, headers={"User-Agent": user_agent}), timeout=40
            )
        except urllib.error.HTTPError as error:
            response = error
        except Exception as error:
            if attempt == 0:
                time.sleep(0.5)
                continue
            return {"url": url, "error": str(error), "status": None}, ""
        headers = {key.lower(): value for key, value in response.headers.items()}
        body = response.read().decode("utf-8", "replace")
        return {
            "url": url,
            "finalUrl": response.url,
            "status": response.code,
            "headers": headers,
            "redirects": redirects.chain,
            "seconds": round(time.monotonic() - start, 2),
            "htmlBytes": len(body.encode()),
        }, body


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta = {}
        self.links = []
        self.resources = []
        self.canonicals = []
        self.h1 = []
        self.title = ""
        self.json_ld = []
        self.json_errors = []
        self.html_lang = ""
        self._h1 = None
        self._title = False
        self._script = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.html_lang = a.get("lang", "")
        if tag == "meta":
            key = a.get("name", a.get("property", "")).lower()
            self.meta.setdefault(key, []).append(a.get("content", ""))
        if tag == "link":
            if a.get("rel") == "canonical":
                self.canonicals.append(a.get("href", ""))
            if a.get("rel") in ["stylesheet", "icon", "manifest", "preload"]:
                self.resources.append({"rel": a.get("rel"), "url": a.get("href", "")})
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "h1":
            self._h1 = ""
        if tag == "title":
            self._title = True
        if tag == "script" and a.get("type") == "application/ld+json":
            self._script = ""

    def handle_data(self, data):
        if self._h1 is not None:
            self._h1 += data
        if self._title:
            self.title += data
        if self._script is not None:
            self._script += data

    def handle_endtag(self, tag):
        if tag == "h1" and self._h1 is not None:
            self.h1.append(" ".join(self._h1.split()))
            self._h1 = None
        if tag == "title":
            self._title = False
        if tag == "script" and self._script is not None:
            try:
                self.json_ld.append(json.loads(self._script))
            except ValueError as error:
                self.json_errors.append(str(error))
            self._script = None


def nodes(data):
    if isinstance(data, list):
        return [node for entry in data for node in nodes(entry)]
    if isinstance(data, dict):
        return nodes(data["@graph"]) if "@graph" in data else [data]
    return []


def normalize(url):
    return url.rstrip("/")


def write_snapshot(report):
    endpoints = {urllib.parse.urlsplit(entry["url"]).path: entry for entry in report["endpoints"]}
    home = report["pages"][0]
    snapshot = {
        "checkedAt": report["checkedAt"],
        "site": report["site"],
        "summary": report["summary"],
        "verification": {
            "googleFileStatus": endpoints.get("/googlee49bea6a559ecaf4.html", {}).get("status"),
            "googleMetaConfigured": home.get("googleVerification", False),
            "bingMetaConfigured": home.get("bingVerification", False),
            "bingFileStatus": endpoints.get("/BingSiteAuth.xml", {}).get("status"),
            "indexNowConfigured": endpoints.get("/api/seo/indexnow", {}).get("json", {}).get("configured", False),
            "indexNowKeyStatus": endpoints.get("/indexnow-key.txt", {}).get("status"),
        },
        "limitations": "Public HTTP checks only. Ownership, sitemap submission, indexing, rankings, rich-result eligibility, and Core Web Vitals require separate verification.",
    }
    browser_path = OUTPUT / "live-browser.json"
    if browser_path.exists():
        browser = json.loads(browser_path.read_text())
        errors = " ".join(browser.get("errors", []))
        findings = []
        if "Content Security Policy" in errors and "fonts.googleapis.com" in errors:
            findings.append("Google Fonts requests were blocked by the live Content Security Policy.")
        if "#418" in errors:
            findings.append("A React hydration error (#418) was recorded on the live mobile page.")
        snapshot["browserObservations"] = {
            "checkedAt": datetime.datetime.fromtimestamp(browser_path.stat().st_mtime, datetime.timezone.utc).isoformat(),
            "findings": findings,
        }
    pathlib.Path("public").mkdir(exist_ok=True)
    pathlib.Path("public/search-readiness-audit.json").write_text(json.dumps(snapshot, indent=2))


def audit_page(url):
    result, body = request(url)
    if result.get("error"):
        return result
    page = Page()
    page.feed(body)
    graph = nodes(page.json_ld)
    types = sorted({value for node in graph for value in (
        node.get("@type", []) if isinstance(node.get("@type"), list)
        else [node.get("@type", "")]
    ) if value})
    description = page.meta.get("description", [""])[0]
    robots = page.meta.get("robots", []) + [result["headers"].get("x-robots-tag", "")]
    internal_links = set()
    for link in page.links:
        absolute = urllib.parse.urljoin(url, html.unescape(link))
        parsed = urllib.parse.urlsplit(absolute)
        if parsed.netloc == urllib.parse.urlsplit(BASE).netloc:
            internal_links.add(normalize(urllib.parse.urlunsplit(parsed._replace(fragment="", query=""))))
    issues = []
    if result["status"] != 200:
        issues.append("not_http_200")
    if result["redirects"]:
        issues.append("sitemap_url_redirects")
    if not page.title.strip():
        issues.append("missing_title")
    if not description.strip():
        issues.append("missing_description")
    if len(page.canonicals) != 1:
        issues.append("canonical_count_not_one")
    elif normalize(page.canonicals[0]) != normalize(url):
        issues.append("canonical_not_self_referencing")
    if any("noindex" in value.lower() for value in robots):
        issues.append("noindex")
    if len(page.h1) != 1:
        issues.append("h1_count_not_one")
    if page.json_errors:
        issues.append("invalid_json_ld_syntax")
    if not graph:
        issues.append("no_json_ld")
    if not page.meta.get("viewport"):
        issues.append("missing_mobile_viewport")
    return result | {
        "title": page.title,
        "description": description,
        "canonicals": page.canonicals,
        "robots": robots,
        "h1": page.h1,
        "htmlLang": page.html_lang,
        "structuredDataTypes": types,
        "jsonLdErrors": page.json_errors,
        "faqPageCount": sum(node.get("@type") == "FAQPage" for node in graph),
        "ogImage": page.meta.get("og:image", []),
        "googleVerification": bool(page.meta.get("google-site-verification")),
        "bingVerification": bool(page.meta.get("msvalidate.01")),
        "resources": page.resources,
        "internalLinks": sorted(internal_links),
        "issues": issues,
    }


def main():
    sitemap, body = request(BASE + "/sitemap.xml")
    if sitemap["status"] != 200:
        raise RuntimeError("Sitemap is unavailable: " + json.dumps(sitemap))
    root = ET.fromstring(body)
    urls = [element.text for element in root.findall(".//{*}loc")]
    if not urls:
        raise RuntimeError("Expected a non-empty sitemap urlset")
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        pages = list(pool.map(audit_page, urls))
    counts = Counter(issue for page in pages for issue in page.get("issues", []))
    title_counts = Counter(page.get("title") for page in pages if page.get("title"))
    description_counts = Counter(page.get("description") for page in pages if page.get("description"))
    inbound = {link for page in pages for link in page.get("internalLinks", [])}
    endpoint_paths = [
        "/robots.txt", "/api/seo/audit", "/api/seo/indexnow", "/BingSiteAuth.xml",
        "/indexnow-key.txt", "/googlee49bea6a559ecaf4.html", "/seo-readiness",
        "/seo-audit-definitely-missing", "/opengraph-image", "/favicon.svg", "/api/health",
        "/about", "/conditions/speech-delay",
    ]
    endpoints = []
    for path in endpoint_paths:
        result, text = request(BASE + path)
        if "application/json" in result.get("headers", {}).get("content-type", ""):
            try:
                result["json"] = json.loads(text)
            except ValueError:
                result["jsonError"] = True
        elif path.endswith(".txt") or path.endswith(".xml") or path.endswith(".html"):
            result["body"] = text[:2000]
        elif path == "/seo-readiness" or path == "/seo-audit-definitely-missing":
            parser = Page()
            parser.feed(text)
            result["robots"] = parser.meta.get("robots", [])
        endpoints.append(result)
    bots = []
    for agent in ["Googlebot", "bingbot"]:
        result, text = request(BASE + "/", agent)
        parser = Page()
        parser.feed(text)
        bots.append({"userAgent": agent, "status": result["status"], "title": parser.title,
                     "robots": parser.meta.get("robots", []),
                     "note": "User-agent probe only; not an authenticated search-engine crawler."})
    summary = {
        "sitemapUrls": len(urls),
        "uniqueSitemapUrls": len(set(urls)),
        "http200": sum(page.get("status") == 200 for page in pages),
        "redirectingUrls": sum(bool(page.get("redirects")) for page in pages),
        "fetchFailures": [page for page in pages if page.get("error")],
        "issues": dict(counts),
        "duplicateTitles": [title for title, count in title_counts.items() if count > 1],
        "duplicateDescriptions": [desc for desc, count in description_counts.items() if count > 1],
        "noInboundLinksWithinSitemap": [url for url in urls if normalize(url) not in inbound],
        "unmappedInternalPaths": sorted(inbound - {normalize(url) for url in urls}),
    }
    report = {"checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
              "site": BASE, "scope": "Public read-only HTTP checks, not Search Console or Bing account access.",
              "summary": summary, "sitemap": sitemap, "pages": pages, "endpoints": endpoints,
              "crawlerUserAgentProbes": bots}
    (OUTPUT / "audit.json").write_text(json.dumps(report, indent=2, ensure_ascii=False))
    write_snapshot(report)
    print(json.dumps(summary, indent=2))
    for endpoint in endpoints:
        print(endpoint["status"], endpoint["url"],
              json.dumps(endpoint.get("json", {}).get("configured", "")))


if __name__ == "__main__":
    main()