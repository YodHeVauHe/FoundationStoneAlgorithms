import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { offerings } from '../src/seo/offerings.mjs';
import { primaryNavigation, sitePages } from '../src/seo/pages.mjs';
import {
  crawlableRoutes,
  renderCrawlableDocument,
  writeCrawlableDocuments,
} from './render-crawlable-html.mjs';

const HOMEPAGE_TITLE = 'Foundation Stone Algorithms | Intelligent Systems Studio';
const HOMEPAGE_DESCRIPTION =
  'We build intelligent systems that solve hard problems. Custom software across mobile, web, and desktop — powered by intelligent agents, optimized execution pipelines, and bespoke client customizations.';
const HOMEPAGE_CANONICAL = 'https://www.foundationstonealgorithms.shop/';

const homepageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="description"
    content="${HOMEPAGE_DESCRIPTION}" />
  <link rel="canonical" href="${HOMEPAGE_CANONICAL}" />
  <meta property="og:title" content="${HOMEPAGE_TITLE}" />
  <meta property="og:description"
    content="${HOMEPAGE_DESCRIPTION}" />
  <meta property="og:url" content="${HOMEPAGE_CANONICAL}" />
  <meta name="twitter:title" content="${HOMEPAGE_TITLE}" />
  <meta name="twitter:description"
    content="${HOMEPAGE_DESCRIPTION}" />
  <title>${HOMEPAGE_TITLE}</title>
</head>
<body>
  <div id="root">
    <main id="static-seo-fallback">
      <h1>We build intelligent systems that solve hard problems.</h1>
    </main>
  </div>
  <script type="module" src="./assets/index-abc.js"></script>
</body>
</html>
`;

function titleOf(html) {
  const match = html.match(/<title>([^<]*)<\/title>/);
  assert.ok(match, 'missing title');
  return match[1];
}

function metaContent(html, attribute, key) {
  const pattern = new RegExp(
    `<meta\\s+${attribute}="${key}"\\s+content="([^"]*)"`,
    'i',
  );
  const match = html.match(pattern);
  assert.ok(match, `missing meta ${attribute}=${key}`);
  return match[1];
}

function canonicalHref(html) {
  const match = html.match(/<link rel="canonical" href="([^"]*)"/i);
  assert.ok(match, 'missing canonical');
  return match[1];
}

function routeFor(pathname) {
  const route = crawlableRoutes(offerings, sitePages).find(
    (candidate) => candidate.pathname === pathname,
  );
  assert.ok(route, `missing crawlable route ${pathname}`);
  return route;
}

function rendered(pathname) {
  return renderCrawlableDocument(homepageHtml, routeFor(pathname));
}

function jsonLdScript(html, type) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const schema = scripts.map((match) => JSON.parse(match[1])).find((entry) => entry['@type'] === type);
  assert.ok(schema, `missing ${type} JSON-LD`);
  return schema;
}

function assertPrimaryNav(html, pathname) {
  const navMatch = html.match(/<nav aria-label="Primary">([\s\S]*?)<\/nav>/);
  assert.ok(navMatch, `missing primary nav for ${pathname}`);
  for (const link of primaryNavigation) {
    assert.match(
      navMatch[1],
      new RegExp(`<a href="${link.href}">${link.label}</a>`),
      `${pathname} is missing the ${link.label} nav link`,
    );
  }
}

test('offering canonical URLs are the sitemap locations', () => {
  assert.equal(offerings.mobile.canonicalUrl, 'https://www.foundationstonealgorithms.shop/mobile');
  assert.equal(offerings.web.canonicalUrl, 'https://www.foundationstonealgorithms.shop/web');
  assert.equal(offerings.desktop.canonicalUrl, 'https://www.foundationstonealgorithms.shop/desktop');
  assert.equal(offerings.mobile.quoteHref, '/services?type=mobile');
  assert.equal(offerings.web.quoteHref, '/services?type=web');
  assert.equal(offerings.desktop.quoteHref, '/services?type=system');
});

test('mobile crawlable document has the mobile title, description, canonical, and og:url', () => {
  const html = rendered('/mobile');

  assert.equal(titleOf(html), 'Mobile | Foundation Stone Algorithms');
  assert.equal(metaContent(html, 'name', 'description'), offerings.mobile.metaDescription);
  assert.equal(metaContent(html, 'property', 'og:title'), offerings.mobile.title);
  assert.equal(metaContent(html, 'property', 'og:description'), offerings.mobile.metaDescription);
  assert.equal(metaContent(html, 'property', 'og:url'), offerings.mobile.canonicalUrl);
  assert.equal(metaContent(html, 'name', 'twitter:title'), offerings.mobile.title);
  assert.equal(metaContent(html, 'name', 'twitter:description'), offerings.mobile.metaDescription);
  assert.equal(canonicalHref(html), 'https://www.foundationstonealgorithms.shop/mobile');
  assert.match(html, /<h1>Mobile<\/h1>/);
  assert.match(html, /Field tools, customer touchpoints, and internal apps/);
  assert.match(html, /Native or cross-platform experiences for phones and tablets/);
  assert.match(html, /href="\/services\?type=mobile"/);
  assert.match(html, /src="\/assets\/index-abc\.js"/);
  assert.doesNotMatch(html, /We build intelligent systems that solve hard problems/);
});

test('web crawlable document has the web title, description, canonical, and og:url', () => {
  const html = rendered('/web');

  assert.equal(titleOf(html), 'Web Applications | Foundation Stone Algorithms');
  assert.equal(metaContent(html, 'name', 'description'), offerings.web.metaDescription);
  assert.equal(canonicalHref(html), 'https://www.foundationstonealgorithms.shop/web');
  assert.equal(metaContent(html, 'property', 'og:url'), offerings.web.canonicalUrl);
  assert.match(html, /<h1>Web Applications<\/h1>/);
  assert.match(html, /Dashboards, client portals, and products/);
  assert.match(html, /Define the closest shape/);
  assert.match(html, /href="\/services\?type=web"/);
  assert.doesNotMatch(html, /We build intelligent systems that solve hard problems/);
});

test('desktop crawlable document has the desktop title, description, canonical, and og:url', () => {
  const html = rendered('/desktop');

  assert.equal(titleOf(html), 'Desktop Systems | Foundation Stone Algorithms');
  assert.equal(metaContent(html, 'name', 'description'), offerings.desktop.metaDescription);
  assert.equal(canonicalHref(html), 'https://www.foundationstonealgorithms.shop/desktop');
  assert.equal(metaContent(html, 'property', 'og:url'), offerings.desktop.canonicalUrl);
  assert.match(html, /<h1>Desktop Systems<\/h1>/);
  assert.match(html, /Focused operational software for teams whose work happens outside the browser/);
  assert.match(html, /Choose one or more operating systems/);
  assert.match(html, /href="\/services\?type=system"/);
  assert.doesNotMatch(html, /We build intelligent systems that solve hard problems/);
});


test('specific wizard targets are crawlable pages linked from the parent offering', () => {
  const specifics = [
    ['/dashboard', offerings.dashboard, '/services?type=web&focus=dashboard', 'Dashboard'],
    ['/client-portal', offerings.clientPortal, '/services?type=web&focus=portal', 'Client Portal'],
    ['/business-website', offerings.businessWebsite, '/services?type=web&focus=website', 'Business Website'],
    ['/android', offerings.android, '/services?type=mobile&platform=android', 'Android'],
    ['/ios', offerings.ios, '/services?type=mobile&platform=ios', 'iOS'],
  ];

  for (const [pathname, offering, quoteHref, heading] of specifics) {
    assert.equal(offering.path, pathname);
    assert.equal(offering.canonicalUrl, `https://www.foundationstonealgorithms.shop${pathname}`);
    assert.equal(offering.quoteHref, quoteHref);
    assert.equal(offering.heading, heading);
    const html = rendered(pathname);
    assert.equal(titleOf(html), offering.title);
    assert.equal(metaContent(html, 'name', 'description'), offering.metaDescription);
    assert.equal(canonicalHref(html), offering.canonicalUrl);
    assert.equal(metaContent(html, 'property', 'og:url'), offering.canonicalUrl);
    assert.match(html, new RegExp(`<h1>${heading.replace(' ', ' ')}</h1>`));
    const hrefPattern = quoteHref.replaceAll('?', '\\?').replaceAll('&', '&amp;');
    assert.match(html, new RegExp(`href="${hrefPattern}"`));
  }

  const webHtml = rendered('/web');
  assert.match(webHtml, /href="\/dashboard"/);
  assert.match(webHtml, /href="\/client-portal"/);
  assert.match(webHtml, /href="\/business-website"/);
  const mobileHtml = rendered('/mobile');
  assert.match(mobileHtml, /href="\/android"/);
  assert.match(mobileHtml, /href="\/ios"/);
});

test('about crawlable document has the about meta set, content, and breadcrumb JSON-LD', () => {
  const html = rendered('/about');

  assert.equal(titleOf(html), sitePages.about.title);
  assert.equal(metaContent(html, 'name', 'description'), sitePages.about.metaDescription);
  assert.equal(metaContent(html, 'property', 'og:title'), sitePages.about.title);
  assert.equal(metaContent(html, 'property', 'og:description'), sitePages.about.metaDescription);
  assert.equal(metaContent(html, 'property', 'og:url'), sitePages.about.canonicalUrl);
  assert.equal(metaContent(html, 'name', 'twitter:title'), sitePages.about.title);
  assert.equal(metaContent(html, 'name', 'twitter:description'), sitePages.about.metaDescription);
  assert.equal(canonicalHref(html), sitePages.about.canonicalUrl);
  assert.match(html, new RegExp(`<h1>${sitePages.about.heading}</h1>`));
  assert.match(html, /Foundation Stone Algorithms is an intelligent systems studio/);
  assert.match(html, /bespoke client customizations for teams that need software shaped around how they actually work/);
  assert.match(html, /href="\/mobile"/);
  assert.match(html, /href="\/web"/);
  assert.match(html, /href="\/desktop"/);
  assert.match(html, /href="\/services">Start a project request</);
  assert.match(html, /100% Client Customized/);
  assert.match(html, /Agentic Autonomy Core/);
  assert.match(html, /Multi-OS Mobile · Web · PC/);
  assertPrimaryNav(html, '/about');

  const breadcrumbs = jsonLdScript(html, 'BreadcrumbList');
  assert.deepEqual(breadcrumbs, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.foundationstonealgorithms.shop/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: sitePages.about.canonicalUrl,
      },
    ],
  });
});

test('no offering or services fallback shows the about heading twice', () => {
  for (const pathname of ['/services', '/mobile', '/web', '/desktop']) {
    assert.doesNotMatch(rendered(pathname), /<h1>We build intelligent systems that solve hard problems\.<\/h1>/);
  }
});

test('pricing crawlable document has the pricing meta set, engagement links, and no currency amounts', () => {
  const html = rendered('/pricing');

  assert.equal(titleOf(html), sitePages.pricing.title);
  assert.equal(metaContent(html, 'name', 'description'), sitePages.pricing.metaDescription);
  assert.equal(canonicalHref(html), sitePages.pricing.canonicalUrl);
  assert.equal(metaContent(html, 'property', 'og:title'), sitePages.pricing.title);
  assert.equal(metaContent(html, 'property', 'og:url'), sitePages.pricing.canonicalUrl);
  assert.match(html, /<h1>Every engagement is a custom quote<\/h1>/);
  assert.match(html, /Each project is scoped and priced individually/);
  assert.match(html, /<a href="\/mobile">Mobile apps<\/a>/);
  assert.match(html, /<a href="\/web">Web applications<\/a>/);
  assert.match(html, /<a href="\/dashboard">Dashboards<\/a>/);
  assert.match(html, /<a href="\/client-portal">Client portals<\/a>/);
  assert.match(html, /<a href="\/business-website">Business websites<\/a>/);
  assert.match(html, /<a href="\/desktop">Desktop systems<\/a>/);
  assert.match(html, /<a href="\/services\?type=mobile">Get a quote<\/a>/);
  assert.match(html, /<a href="\/services\?type=web&amp;focus=dashboard">Get a quote<\/a>/);
  assert.match(html, /<a href="\/services\?type=system">Get a quote<\/a>/);
  assert.match(html, /href="\/services">Start a project request</);
  assertPrimaryNav(html, '/pricing');

  const breadcrumbs = jsonLdScript(html, 'BreadcrumbList');
  assert.deepEqual(breadcrumbs, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.foundationstonealgorithms.shop/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Pricing',
        item: sitePages.pricing.canonicalUrl,
      },
    ],
  });
});

test('no currency character or amount appears on the pricing fallback', () => {
  const html = rendered('/pricing');
  assert.doesNotMatch(rendered('/pricing'), /[$€£¥]/);
  assert.ok(!/\d+\s?(USD|EUR|GBP)/i.test(html));
});

test('every prerendered fallback carries the full primary navigation', () => {
  const pathnames = [
    '/services',
    ...Object.values(offerings).map((offering) => offering.path),
    '/about',
    '/pricing',
  ];
  for (const pathname of pathnames) {
    assertPrimaryNav(rendered(pathname), pathname);
  }
});

test('services crawlable document keeps its quote-page title, description, canonical, and og:url', () => {
  const html = rendered('/services');

  assert.equal(titleOf(html), 'Start a Project | Foundation Stone Algorithms');
  assert.equal(
    metaContent(html, 'name', 'description'),
    'Request a focused quote for mobile apps, web applications, or desktop software. Guided project wizard from Foundation Stone Algorithms.',
  );
  assert.equal(canonicalHref(html), 'https://www.foundationstonealgorithms.shop/services');
  assert.equal(metaContent(html, 'property', 'og:url'), 'https://www.foundationstonealgorithms.shop/services');
  assert.match(html, /<h1>Start a project request<\/h1>/);
  assert.match(html, /Guided quote wizard for mobile apps, web applications, and desktop software/);
  assert.doesNotMatch(html, /We build intelligent systems that solve hard problems/);
});

test('writing crawlable routes leaves the homepage document unchanged', () => {
  const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'crawlable-html-'));
  const indexPath = path.join(distDir, 'index.html');
  fs.writeFileSync(indexPath, homepageHtml);

  writeCrawlableDocuments(distDir, crawlableRoutes(offerings, sitePages));

  assert.equal(fs.readFileSync(indexPath, 'utf8'), homepageHtml);
  assert.equal(canonicalHref(fs.readFileSync(path.join(distDir, 'mobile', 'index.html'), 'utf8')), offerings.mobile.canonicalUrl);
  assert.equal(canonicalHref(fs.readFileSync(path.join(distDir, 'web', 'index.html'), 'utf8')), offerings.web.canonicalUrl);
  assert.equal(canonicalHref(fs.readFileSync(path.join(distDir, 'desktop', 'index.html'), 'utf8')), offerings.desktop.canonicalUrl);
  assert.equal(
    canonicalHref(fs.readFileSync(path.join(distDir, 'services', 'index.html'), 'utf8')),
    'https://www.foundationstonealgorithms.shop/services',
  );
  assert.equal(canonicalHref(fs.readFileSync(path.join(distDir, 'about', 'index.html'), 'utf8')), sitePages.about.canonicalUrl);
  assert.equal(canonicalHref(fs.readFileSync(path.join(distDir, 'pricing', 'index.html'), 'utf8')), sitePages.pricing.canonicalUrl);
});

test('homepage HTML template and sitemap include the full navigation and the new site pages', () => {
  const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

  const templateHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
  assertPrimaryNav(templateHtml, 'index.html');
  assert.match(
    templateHtml,
    /"@type": "SiteNavigationElement",\s*"name": "About",\s*"url": "https:\/\/www\.foundationstonealgorithms\.shop\/about"/,
  );
  assert.match(
    templateHtml,
    /"@type": "SiteNavigationElement",\s*"name": "Pricing",\s*"url": "https:\/\/www\.foundationstonealgorithms\.shop\/pricing"/,
  );

  const sitemapXml = fs.readFileSync(path.join(repoRoot, 'public', 'sitemap.xml'), 'utf8');
  assert.match(sitemapXml, /<loc>https:\/\/www\.foundationstonealgorithms\.shop\/about<\/loc>/);
  assert.match(sitemapXml, /<loc>https:\/\/www\.foundationstonealgorithms\.shop\/pricing<\/loc>/);
});

test('crawlable rendering fails when the homepage template is missing a required meta tag', () => {
  const broken = homepageHtml.replace(/<meta property="og:url"[^>]*>/, '');
  assert.throws(
    () => renderCrawlableDocument(broken, routeFor('/mobile')),
    /og:url/,
  );
});
