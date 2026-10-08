import { siteOrigin } from './site.mjs';

function offeringPage(path, content) {
  return {
    path,
    canonicalUrl: `${siteOrigin}${path}`,
    ...content,
  };
}

export const offerings = {
  mobile: offeringPage('/mobile', {
    eyebrow: 'Capabilities · 01',
    title: 'Mobile | Foundation Stone Algorithms',
    metaDescription:
      'Field tools, customer touchpoints, and internal apps that live in your users’ pockets. We design and engineer native and cross-platform mobile experiences for Android and iOS — built for clarity in the field, reliability under real use, and the workflows your team already depends on.',
    heading: 'Mobile',
    paragraphs: [
      "Field tools, customer touchpoints, and internal apps in your users' pockets — native or cross-platform.",
      'Native or cross-platform experiences for phones and tablets. The project request starts with one service, then the device target, before you describe the work.',
    ],
    quoteHref: '/services?type=mobile',
    related: [
      { href: '/android', label: 'Android' },
      { href: '/ios', label: 'iOS' },
    ],
  }),
  web: offeringPage('/web', {
    eyebrow: 'Capabilities · 02',
    title: 'Web Applications | Foundation Stone Algorithms',
    metaDescription:
      'Dashboards, client portals, and browser products that earn their place as the most useful tab your users open. We build custom web applications with clear interfaces, solid foundations, and room to grow — whether you need analytics views, account workflows, or a full customer-facing product.',
    heading: 'Web Applications',
    paragraphs: [
      'Dashboards, client portals, and products that make the browser the most useful tab your users open.',
      'Client portals, dashboards, and customer-facing browser products. Define the closest shape — a dashboard, a client portal, or a business website — then describe the work.',
    ],
    quoteHref: '/services?type=web',
    related: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/client-portal', label: 'Client Portal' },
      { href: '/business-website', label: 'Business Website' },
    ],
  }),
  desktop: offeringPage('/desktop', {
    eyebrow: 'Capabilities · 03',
    title: 'Desktop Systems | Foundation Stone Algorithms',
    metaDescription:
      'Focused operational software for teams whose real work happens outside the browser. We engineer desktop systems for Windows, macOS, and Linux — tools that stay close to the job, respect the environment they run in, and feel purpose-built rather than adapted.',
    heading: 'Desktop Systems',
    paragraphs: [
      'Focused operational software for teams whose work happens outside the browser.',
      'Focused software for operational teams on desktop environments. Choose one or more operating systems — Linux, macOS, or Windows — then review the request before sending it.',
    ],
    quoteHref: '/services?type=system',
  }),
  dashboard: offeringPage('/dashboard', {
    eyebrow: 'Web · Dashboard',
    title: 'Dashboard | Foundation Stone Algorithms',
    metaDescription:
      'Internal tools and analytics views. Request a focused quote for a dashboard from Foundation Stone Algorithms.',
    heading: 'Dashboard',
    paragraphs: [
      'Internal tools and analytics views.',
      'Dashboards, client portals, and products that make the browser the most useful tab your users open. Define the closest shape — a dashboard — then describe the work.',
    ],
    quoteHref: '/services?type=web&focus=dashboard',
  }),
  clientPortal: offeringPage('/client-portal', {
    eyebrow: 'Web · Client Portal',
    title: 'Client Portal | Foundation Stone Algorithms',
    metaDescription:
      'Accounts, onboarding, and user workflows. Request a focused quote for a client portal from Foundation Stone Algorithms.',
    heading: 'Client Portal',
    paragraphs: [
      'Accounts, onboarding, and user workflows.',
      'Client portals, dashboards, and customer-facing browser products. Define the closest shape — a client portal — then describe the work.',
    ],
    quoteHref: '/services?type=web&focus=portal',
  }),
  businessWebsite: offeringPage('/business-website', {
    eyebrow: 'Web · Business Website',
    title: 'Business Website | Foundation Stone Algorithms',
    metaDescription:
      'Marketing pages with lighter interactions. Request a focused quote for a business website from Foundation Stone Algorithms.',
    heading: 'Business Website',
    paragraphs: [
      'Marketing pages with lighter interactions.',
      'Client portals, dashboards, and customer-facing browser products. Define the closest shape — a business website — then describe the work.',
    ],
    quoteHref: '/services?type=web&focus=website',
  }),
  android: offeringPage('/android', {
    eyebrow: 'Mobile · Android',
    title: 'Android | Foundation Stone Algorithms',
    metaDescription:
      'Target Android users first. Native or cross-platform experiences for phones and tablets. Request a focused quote for mobile apps from Foundation Stone Algorithms.',
    heading: 'Android',
    paragraphs: [
      'Target Android users first.',
      'Native or cross-platform experiences for phones and tablets. Pick the device target for the app quote.',
    ],
    quoteHref: '/services?type=mobile&platform=android',
  }),
  ios: offeringPage('/ios', {
    eyebrow: 'Mobile · iOS',
    title: 'iOS | Foundation Stone Algorithms',
    metaDescription:
      'Target iOS users first. Native or cross-platform experiences for phones and tablets. Request a focused quote for mobile apps from Foundation Stone Algorithms.',
    heading: 'iOS',
    paragraphs: [
      'Target iOS users first.',
      'Native or cross-platform experiences for phones and tablets. Pick the device target for the app quote.',
    ],
    quoteHref: '/services?type=mobile&platform=ios',
  }),
};
