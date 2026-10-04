import { useEffect } from 'react';
import { applyPageMeta, homepageMeta, type PageMeta } from './pageMeta';

/**
 * Sets the route title, description, canonical URL, and social URL tags.
 * Restores the homepage document on exit. Offering HTML is prerendered, so
 * the values already in the document are this page's — not the previous route.
 */
export function usePageMeta(page: PageMeta) {
  const { title, description, canonicalUrl } = page;

  useEffect(() => {
    applyPageMeta(document, { title, description, canonicalUrl });
    return () => {
      applyPageMeta(document, homepageMeta);
    };
  }, [title, description, canonicalUrl]);
}
