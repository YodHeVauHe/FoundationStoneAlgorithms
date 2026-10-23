import { siteOrigin } from './site.mjs';

function sitePage(path, content) {
  return {
    path,
    canonicalUrl: `${siteOrigin}${path}`,
    ...content,
  };
}

/** Shared primary navigation, used by the site header and prerendered fallbacks. */
export const primaryNavigation = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/mobile', label: 'Mobile' },
  { href: '/web', label: 'Web' },
  { href: '/desktop', label: 'Desktop' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
];

export const sitePages = {
  about: sitePage('/about', {
    title: 'About | Foundation Stone Algorithms',
    metaDescription:
      'Foundation Stone Algorithms is an intelligent systems studio building custom mobile, web, and desktop software powered by intelligent agents.',
    eyebrow: 'Intelligent Systems Studio',
    heading: 'We build intelligent systems that solve hard problems.',
    paragraphs: [
      'Foundation Stone Algorithms is an intelligent systems studio.',
      'We engineer custom software systems across mobile, web, and desktop — powered by intelligent agents, optimized execution pipelines, and bespoke client customizations for teams that need software shaped around how they actually work.',
    ],
    itemsTitle: 'What we build',
    items: [
      {
        href: '/mobile',
        title: 'Mobile',
        description:
          "Field tools, customer touchpoints, and internal apps in your users' pockets — native or cross-platform.",
      },
      {
        href: '/web',
        title: 'Web Applications',
        description:
          'Dashboards, client portals, and products that make the browser the most useful tab your users open.',
      },
      {
        href: '/desktop',
        title: 'Desktop Systems',
        description: 'Focused operational software for teams whose work happens outside the browser.',
      },
    ],
    trustPoints: [
      { value: '100%', label: 'Client Customized' },
      { value: 'Agentic', label: 'Autonomy Core' },
      { value: 'Multi-OS', label: 'Mobile · Web · PC' },
    ],
    ctaHref: '/services',
    ctaLabel: 'Start a project request',
  }),
  pricing: sitePage('/pricing', {
    title: 'Pricing | Foundation Stone Algorithms',
    metaDescription:
      'Every engagement is a custom quote. Request a focused quote for mobile apps, web applications, dashboards, client portals, websites, or desktop systems.',
    eyebrow: 'Pricing',
    heading: 'Every engagement is a custom quote',
    paragraphs: [
      'Each project is scoped and priced individually. There are no fixed prices — every engagement is a custom quote shaped by the service, scope, and details you describe in the project request.',
      'This flow keeps the request focused. Choose one service, define the scope, describe the work, then review the request before sending it.',
    ],
    itemsTitle: 'Engagement types',
    items: [
      {
        title: 'Mobile apps',
        pageHref: '/mobile',
        quoteHref: '/services?type=mobile',
        description: 'Native or cross-platform experiences for phones and tablets.',
      },
      {
        title: 'Web applications',
        pageHref: '/web',
        quoteHref: '/services?type=web',
        description: 'Client portals, dashboards, and customer-facing browser products.',
      },
      {
        title: 'Dashboards',
        pageHref: '/dashboard',
        quoteHref: '/services?type=web&focus=dashboard',
        description: 'Internal tools and analytics views.',
      },
      {
        title: 'Client portals',
        pageHref: '/client-portal',
        quoteHref: '/services?type=web&focus=portal',
        description: 'Accounts, onboarding, and user workflows.',
      },
      {
        title: 'Business websites',
        pageHref: '/business-website',
        quoteHref: '/services?type=web&focus=website',
        description: 'Marketing pages with lighter interactions.',
      },
      {
        title: 'Desktop systems',
        pageHref: '/desktop',
        quoteHref: '/services?type=system',
        description: 'Focused operational software for teams whose work happens outside the browser.',
      },
    ],
    ctaHref: '/services',
    ctaLabel: 'Start a project request',
  }),
};
