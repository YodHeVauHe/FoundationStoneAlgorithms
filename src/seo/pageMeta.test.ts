import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { applyPageMeta, homepageMeta, type PageMeta } from './pageMeta.ts';

type FakeElement = {
  tagName: string;
  attributes: Record<string, string>;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
};

function element(tagName: string, attributes: Record<string, string> = {}): FakeElement {
  return {
    tagName,
    attributes: { ...attributes },
    getAttribute(name) {
      return name in this.attributes ? this.attributes[name] : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };
}

function createDocument(page: PageMeta) {
  const elements = [
    element('meta', { name: 'description', content: page.description }),
    element('meta', { property: 'og:title', content: page.title }),
    element('meta', { property: 'og:description', content: page.description }),
    element('meta', { property: 'og:url', content: page.canonicalUrl }),
    element('meta', { name: 'twitter:title', content: page.title }),
    element('meta', { name: 'twitter:description', content: page.description }),
    element('link', { rel: 'canonical', href: page.canonicalUrl }),
  ];

  return {
    title: page.title,
    head: {
      querySelector(selector: string) {
        const match = selector.match(/^(meta|link)\[(name|property|rel)="([^"]+)"\]$/);
        if (!match) return null;
        const [, tag, attribute, value] = match;
        return elements.find((node) => node.tagName === tag && node.attributes[attribute] === value) ?? null;
      },
      appendChild(node: FakeElement) {
        elements.push(node);
      },
    },
    createElement(tagName: string) {
      return element(tagName);
    },
  };
}

function metaContent(
  document: ReturnType<typeof createDocument>,
  attribute: 'name' | 'property',
  key: string,
) {
  return document.head.querySelector(`meta[${attribute}="${key}"]`)?.getAttribute('content');
}

function canonicalHref(document: ReturnType<typeof createDocument>) {
  return document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
}

const mobileMeta: PageMeta = {
  title: 'Mobile | Foundation Stone Algorithms',
  description:
    'Field tools, customer touchpoints, and internal apps in your users\' pockets — native or cross-platform. Request a focused quote for mobile apps from Foundation Stone Algorithms.',
  canonicalUrl: 'https://www.foundationstonealgorithms.shop/mobile',
};

test('offering page meta sets canonical and og:url to that offering', () => {
  const document = createDocument(homepageMeta);
  applyPageMeta(document as unknown as Document, mobileMeta);

  assert.equal(document.title, mobileMeta.title);
  assert.equal(metaContent(document, 'name', 'description'), mobileMeta.description);
  assert.equal(metaContent(document, 'property', 'og:title'), mobileMeta.title);
  assert.equal(metaContent(document, 'property', 'og:description'), mobileMeta.description);
  assert.equal(metaContent(document, 'property', 'og:url'), mobileMeta.canonicalUrl);
  assert.equal(metaContent(document, 'name', 'twitter:title'), mobileMeta.title);
  assert.equal(metaContent(document, 'name', 'twitter:description'), mobileMeta.description);
  assert.equal(canonicalHref(document), mobileMeta.canonicalUrl);
});

test('leaving a prerendered offering restores the homepage canonical and og:url', () => {
  const document = createDocument(mobileMeta);
  applyPageMeta(document as unknown as Document, homepageMeta);

  assert.equal(document.title, 'Foundation Stone Algorithms | Intelligent Systems Studio');
  assert.equal(canonicalHref(document), 'https://www.foundationstonealgorithms.shop/');
  assert.equal(metaContent(document, 'property', 'og:url'), 'https://www.foundationstonealgorithms.shop/');
  assert.match(
    metaContent(document, 'name', 'description') ?? '',
    /We build intelligent systems that solve hard problems/,
  );
  assert.equal(metaContent(document, 'property', 'og:title'), homepageMeta.title);
  assert.equal(metaContent(document, 'name', 'twitter:description'), homepageMeta.description);
});

test('homepage meta matches the homepage HTML template', () => {
  const templatePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../index.html');
  const html = fs.readFileSync(templatePath, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = html.match(/<meta name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1];

  assert.equal(homepageMeta.title, title);
  assert.equal(homepageMeta.description, description);
  assert.equal(homepageMeta.canonicalUrl, canonical);
  assert.equal(homepageMeta.canonicalUrl, ogUrl);
});
