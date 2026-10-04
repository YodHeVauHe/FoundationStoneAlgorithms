export type Offering = {
  path: string;
  canonicalUrl: string;
  eyebrow: string;
  title: string;
  metaDescription: string;
  heading: string;
  paragraphs: readonly [string, string];
  quoteHref: string;
};

export const offerings: {
  readonly mobile: Offering;
  readonly web: Offering;
  readonly desktop: Offering;
};
