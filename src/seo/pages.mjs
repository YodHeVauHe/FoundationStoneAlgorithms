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
      'Foundation Stone Algorithms builds custom mobile apps, web applications, and desktop systems around your team’s goals and workflows.',
    eyebrow: 'About the company',
    heading: 'Software built around the way you work.',
    paragraphs: [
      'Foundation Stone Algorithms designs and builds software for complex business needs.',
      'We create mobile apps, web applications, and desktop systems shaped around your goals, users, and day-to-day workflows.',
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
      { value: 'Custom', label: 'Built for your workflows' },
      { value: 'Intelligent', label: 'Agent-powered software' },
      { value: 'Multi-OS', label: 'Mobile · Web · Desktop' },
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
