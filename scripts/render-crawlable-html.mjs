import fs from 'node:fs';
import path from 'node:path';
import { siteOrigin } from '../src/seo/site.mjs';
import { primaryNavigation } from '../src/seo/pages.mjs';

const siteName = 'Foundation Stone Algorithms';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** The full primary navigation shared by every prerendered static fallback. */
function primaryNavHtml() {
  const links = primaryNavigation
    .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
    .join('\n          ');
  return `<nav aria-label="Primary">
          ${links}
        </nav>`;
}

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
        ${primaryNavHtml()}
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

function relatedLinksHtml(offering) {
  if (!offering.related?.length) return '';
  const items = offering.related
    .map(
      (link) =>
        `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`,
    )
    .join('');
  return `<nav aria-label="Related"><ul>${items}</ul></nav>`;
}

function offeringFallbackHtml(offering) {
  const [lead, detail] = offering.paragraphs;
  return `
    <main id="static-seo-fallback">
      <header>
        <p><strong>${escapeHtml(siteName)}</strong></p>
        ${primaryNavHtml()}
      </header>
      <p>${escapeHtml(offering.eyebrow)}</p>
      <h1>${escapeHtml(offering.heading)}</h1>
      <p>${escapeHtml(lead)}</p>
      <p>${escapeHtml(detail)}</p>
      <p><a href="${escapeHtml(offering.quoteHref)}">Start a project request</a></p>
      ${relatedLinksHtml(offering)}
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

function pageHrefForItem(item) {
  return item.href ?? item.pageHref;
}

function itemsListHtml(items) {
  return items
    .map((item) => {
      const titleLink = `<a href="${escapeHtml(pageHrefForItem(item))}">${escapeHtml(item.title)}</a>`;
      const quoteLink = item.quoteHref
        ? ` <a href="${escapeHtml(item.quoteHref)}">Get a quote</a>`
        : '';
      return `<li>${titleLink} — ${escapeHtml(item.description)}${quoteLink}</li>`;
    })
    .join('\n        ');
}

function trustPointsListHtml(trustPoints) {
  if (!trustPoints?.length) return '';
  const items = trustPoints
    .map((point) => `<li>${escapeHtml(point.value)} ${escapeHtml(point.label)}</li>`)
    .join('\n        ');
  return `<ul>
        ${items}
      </ul>`;
}

function sitePageFallbackHtml(page) {
  const paragraphs = page.paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n      ');

  return `
    <main id="static-seo-fallback">
      <header>
        <p><strong>${escapeHtml(siteName)}</strong></p>
        ${primaryNavHtml()}
      </header>
      <p>${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.heading)}</h1>
      ${paragraphs}
      <p><a href="${escapeHtml(page.ctaHref)}">${escapeHtml(page.ctaLabel)}</a></p>
      <h2>${escapeHtml(page.itemsTitle)}</h2>
      <ul>
        ${itemsListHtml(page.items)}
      </ul>
      ${trustPointsListHtml(page.trustPoints)}
    </main>
  `;
}

function crumbNameForPath(pathname) {
  const name = pathname.slice(1);
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function sitePageRoute(page) {
  if (!page?.path || !page.canonicalUrl || !page.title || !page.metaDescription) {
    throw new Error('Site page is missing crawlable page fields');
  }

  return {
    pathname: page.path,
    title: page.title,
    description: page.metaDescription,
    canonicalUrl: page.canonicalUrl,
    fallbackHtml: sitePageFallbackHtml(page),
    breadcrumbs: [
      { name: 'Home', item: `${siteOrigin}/` },
      { name: crumbNameForPath(page.path), item: page.canonicalUrl },
    ],
  };
}

export function crawlableRoutes(offeringPages, sitePages) {
  return [
    servicesPage,
    ...Object.values(sitePages).map(sitePageRoute),
    ...Object.values(offeringPages).map(offeringPageRoute),
  ];
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

function breadcrumbSchemaHtml(breadcrumbs) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function injectBreadcrumbSchema(html, route) {
  if (!route.breadcrumbs?.length) return html;
  if (!html.includes('</head>')) {
    throw new Error('Missing </head>');
  }
  return html.replace('</head>', `${breadcrumbSchemaHtml(route.breadcrumbs)}\n</head>`);
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
  html = injectBreadcrumbSchema(html, route);
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
