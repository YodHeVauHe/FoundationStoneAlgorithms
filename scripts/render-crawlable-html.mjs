import fs from 'node:fs';
import path from 'node:path';
import { siteOrigin } from '../src/seo/site.mjs';

const siteName = 'Foundation Stone Algorithms';

const servicesPage = {
  pathname: '/services',
  title: `Start a Project | ${siteName}`,
  description:
    'Request a focused quote for mobile apps, web applications, or desktop software. Guided project wizard from Foundation Stone Algorithms.',
  canonicalUrl: `${siteOrigin}/services`,
  fallbackHtml: `
    <main id="static-seo-fallback">
      <header>
        <p><strong>${siteName}</strong></p>
        <nav aria-label="Primary">
          <a href="/">Home</a>
          <a href="/services">Start a project</a>
        </nav>
      </header>
      <h1>Start a project request</h1>
      <p>
        Guided quote wizard for mobile apps, web applications, and desktop software.
        Choose a service, define scope, share details, and review before submitting your request.
      </p>
      <ul>
        <li>Mobile — native or cross-platform apps for phones and tablets.</li>
        <li>Web — client portals, dashboards, and customer-facing browser products.</li>
        <li>Desktop — focused software for operational teams.</li>
      </ul>
    </main>
  `,
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function offeringFallbackHtml(offering) {
  const [lead, detail] = offering.paragraphs;
  return `
    <main id="static-seo-fallback">
      <header>
        <p><strong>${escapeHtml(siteName)}</strong></p>
        <nav aria-label="Primary">
          <a href="/">Home</a>
          <a href="${escapeHtml(offering.quoteHref)}">Start a project</a>
        </nav>
      </header>
      <p>${escapeHtml(offering.eyebrow)}</p>
      <h1>${escapeHtml(offering.heading)}</h1>
      <p>${escapeHtml(lead)}</p>
      <p>${escapeHtml(detail)}</p>
      <p><a href="${escapeHtml(offering.quoteHref)}">Start a project request</a></p>
    </main>
  `;
}

function offeringPageRoute(offering) {
  if (!offering?.path || !offering.canonicalUrl || !offering.title || !offering.metaDescription) {
    throw new Error('Offering is missing crawlable page fields');
  }

  return {
    pathname: offering.path,
    title: offering.title,
    description: offering.metaDescription,
    canonicalUrl: offering.canonicalUrl,
    fallbackHtml: offeringFallbackHtml(offering),
  };
}

export function crawlableRoutes(offeringPages) {
  return [servicesPage, ...Object.values(offeringPages).map(offeringPageRoute)];
}

function setTitle(html, title) {
  const titleRe = /<title>[^<]*<\/title>/;
  if (!titleRe.test(html)) {
    throw new Error('Missing <title>');
  }
  return html.replace(titleRe, `<title>${escapeHtml(title)}</title>`);
}

function setMetaContent(html, nameOrProperty, value, attribute = 'name') {
  const pattern = new RegExp(
    `<meta\\s+${attribute}="${nameOrProperty}"\\s+content="[^"]*"\\s*\\/?>`,
    'is',
  );
  if (!pattern.test(html)) {
    throw new Error(`Missing meta ${attribute}=${nameOrProperty}`);
  }
  return html.replace(
    pattern,
    `<meta ${attribute}="${nameOrProperty}" content="${escapeHtml(value)}" />`,
  );
}

function setCanonical(html, canonicalUrl) {
  const canonicalRe = /<link rel="canonical" href="[^"]*"\s*\/?>/i;
  if (!canonicalRe.test(html)) {
    throw new Error('Missing canonical link');
  }
  return html.replace(
    canonicalRe,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  );
}

function absolutizeAssetUrls(html) {
  return html.replace(/(\s(?:src|href)=["'])\.\/assets\//g, '$1/assets/');
}

function replaceRootFallback(html, fallbackHtml) {
  const rootRe = /<div id="root">[\s\S]*?<\/div>/;
  if (!rootRe.test(html)) {
    throw new Error('Missing <div id="root">');
  }
  return html.replace(rootRe, `<div id="root">${fallbackHtml}\n  </div>`);
}

export function renderCrawlableDocument(templateHtml, route) {
  let html = absolutizeAssetUrls(templateHtml);
  html = setTitle(html, route.title);
  html = setMetaContent(html, 'description', route.description);
  html = setMetaContent(html, 'og:title', route.title, 'property');
  html = setMetaContent(html, 'og:description', route.description, 'property');
  html = setMetaContent(html, 'og:url', route.canonicalUrl, 'property');
  html = setMetaContent(html, 'twitter:title', route.title);
  html = setMetaContent(html, 'twitter:description', route.description);
  html = setCanonical(html, route.canonicalUrl);
  html = replaceRootFallback(html, route.fallbackHtml);
  return html;
}

function directoryNameForPath(pathname) {
  const match = pathname.match(/^\/([a-z0-9-]+)$/);
  if (!match) {
    throw new Error(`Unsupported crawlable path: ${pathname}`);
  }
  return match[1];
}

export function writeCrawlableDocuments(distDir, routes) {
  const templateHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  for (const route of routes) {
    const routeDir = path.join(distDir, directoryNameForPath(route.pathname));
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), renderCrawlableDocument(templateHtml, route));
  }
}
