export type PageLink = {
  href: string;
  label: string;
};

export type AboutItem = {
  href: string;
  title: string;
  description: string;
};

export type TrustPoint = {
  value: string;
  label: string;
};

export type EngagementItem = {
  title: string;
  pageHref: string;
  quoteHref: string;
  description: string;
};

export type AboutPage = {
  path: string;
  canonicalUrl: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  paragraphs: readonly string[];
  itemsTitle: string;
  items: readonly AboutItem[];
  trustPoints: readonly TrustPoint[];
  ctaHref: string;
  ctaLabel: string;
};

export type PricingPage = {
  path: string;
  canonicalUrl: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  paragraphs: readonly string[];
  itemsTitle: string;
  items: readonly EngagementItem[];
  ctaHref: string;
  ctaLabel: string;
};

export declare const primaryNavigation: readonly PageLink[];

export declare const sitePages: {
  readonly about: AboutPage;
  readonly pricing: PricingPage;
};
