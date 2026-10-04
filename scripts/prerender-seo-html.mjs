import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

const siteName = 'Foundation Stone Algorithms';

const servicesMeta = {
  title: `Start a Project | ${siteName}`,
  description:
    'Request a focused quote for mobile apps, web applications, or desktop software. Guided project wizard from Foundation Stone Algorithms.',
  canonical: 'https://www.foundationstonealgorithms.shop/services',
};

function setTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
}

function setMetaContent(html, nameOrProperty, value, attr = 'name') {
  const re = new RegExp(
    `<meta\\s+${attr}="${nameOrProperty}"\\s+content="[^"]*"\\s*\\/?>`,
    'is',
  );
  if (!re.test(html)) {
    throw new Error(`Missing meta ${attr}=${nameOrProperty}`);
  }
  return html.replace(
    re,
    `<meta ${attr}="${nameOrProperty}" content="${value.replace(/"/g, '&quot;')}" />`,
  );
}

function absolutizeAssetUrls(html) {
  return html.replace(/(\s(?:src|href)=["'])\.\/assets\//g, '$1/assets/');
}

const servicesFallback = `
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
`;

let html = fs.readFileSync(indexPath, 'utf8');
html = absolutizeAssetUrls(html);
html = setTitle(html, servicesMeta.title);
html = setMetaContent(html, 'description', servicesMeta.description);
html = setMetaContent(html, 'og:title', servicesMeta.title, 'property');
html = setMetaContent(html, 'og:description', servicesMeta.description, 'property');
html = setMetaContent(html, 'og:url', servicesMeta.canonical, 'property');
html = setMetaContent(html, 'twitter:title', servicesMeta.title);
html = setMetaContent(html, 'twitter:description', servicesMeta.description);

const canonicalRe = /<link rel="canonical" href="[^"]*"\s*\/?>/i;
html = html.replace(
  canonicalRe,
  `<link rel="canonical" href="${servicesMeta.canonical}" />`,
);

html = html.replace(
  /<div id="root">[\s\S]*?<\/div>/,
  `<div id="root">${servicesFallback}\n  </div>`,
);

const servicesDir = path.join(distDir, 'services');
fs.mkdirSync(servicesDir, { recursive: true });
fs.writeFileSync(path.join(servicesDir, 'index.html'), html);
