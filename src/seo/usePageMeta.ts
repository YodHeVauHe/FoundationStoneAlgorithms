import { useEffect } from 'react';

const DEFAULT_TITLE = 'Foundation Stone Algorithms | Intelligent Systems Studio';
const DEFAULT_DESCRIPTION =
  'We build intelligent systems that solve hard problems. Custom software across mobile, web, and desktop — powered by intelligent agents, optimized execution pipelines, and bespoke client customizations.';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets the document title and description for a route, then restores the homepage defaults. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionEl = document.head.querySelector('meta[name="description"]');
    const previousDescription = descriptionEl?.getAttribute('content') ?? DEFAULT_DESCRIPTION;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      upsertMeta('name', 'description', previousDescription);
      upsertMeta('property', 'og:title', previousTitle || DEFAULT_TITLE);
      upsertMeta('property', 'og:description', previousDescription);
      upsertMeta('name', 'twitter:title', previousTitle || DEFAULT_TITLE);
      upsertMeta('name', 'twitter:description', previousDescription);
    };
  }, [title, description]);
}
