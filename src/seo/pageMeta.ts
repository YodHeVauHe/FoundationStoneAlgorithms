import { siteOrigin } from './site.mjs';

export type PageMeta = {
  title: string;
  description: string;
  canonicalUrl: string;
};

export const homepageMeta: PageMeta = {
  title: 'Foundation Stone Algorithms | Intelligent Systems Studio',
  description:
    'We build intelligent systems that solve hard problems. An engineering studio for custom mobile apps, web applications, and desktop software — powered by intelligent agents, optimized execution pipelines, and bespoke client customizations for teams that need software shaped around how they actually work.',
  canonicalUrl: `${siteOrigin}/`,
};

function requireHead(target: Document) {
  if (!target.head) {
    throw new Error('Document is missing <head>');
  }
  return target.head;
}

function upsertMeta(
  target: Document,
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  const head = requireHead(target);
  const selector = `meta[${attribute}="${key}"]`;
  let node = head.querySelector(selector);
  if (!node) {
    node = target.createElement('meta');
    node.setAttribute(attribute, key);
    head.appendChild(node);
  }
  node.setAttribute('content', content);
}

function upsertCanonical(target: Document, href: string) {
  const head = requireHead(target);
  let node = head.querySelector('link[rel="canonical"]');
  if (!node) {
    node = target.createElement('link');
    node.setAttribute('rel', 'canonical');
    head.appendChild(node);
  }
  node.setAttribute('href', href);
}

export function applyPageMeta(target: Document, page: PageMeta) {
  target.title = page.title;
  upsertMeta(target, 'name', 'description', page.description);
  upsertMeta(target, 'property', 'og:title', page.title);
  upsertMeta(target, 'property', 'og:description', page.description);
  upsertMeta(target, 'property', 'og:url', page.canonicalUrl);
  upsertMeta(target, 'name', 'twitter:title', page.title);
  upsertMeta(target, 'name', 'twitter:description', page.description);
  upsertCanonical(target, page.canonicalUrl);
}
