export type OfferingLink = {
  href: string;
  label: string;
};

export type Offering = {
  path: string;
  canonicalUrl: string;
  eyebrow: string;
  title: string;
  metaDescription: string;
  heading: string;
  paragraphs: readonly [string, string];
  quoteHref: string;
  related?: readonly OfferingLink[];
};

export const offerings: {
  readonly mobile: Offering;
  readonly web: Offering;
  readonly desktop: Offering;
  readonly dashboard: Offering;
  readonly clientPortal: Offering;
  readonly businessWebsite: Offering;
  readonly android: Offering;
  readonly ios: Offering;
};
