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
      'Field tools, customer touchpoints, and internal apps in your users\' pockets — native or cross-platform. Request a focused quote for mobile apps from Foundation Stone Algorithms.',
    heading: 'Mobile',
    paragraphs: [
      "Field tools, customer touchpoints, and internal apps in your users' pockets — native or cross-platform.",
      'Native or cross-platform experiences for phones and tablets. The project request starts with one service, then the device target, before you describe the work.',
    ],
    quoteHref: '/services?type=mobile',
  }),
  web: offeringPage('/web', {
    eyebrow: 'Capabilities · 02',
    title: 'Web Applications | Foundation Stone Algorithms',
    metaDescription:
      'Dashboards, client portals, and products that make the browser the most useful tab your users open. Request a focused quote for web applications from Foundation Stone Algorithms.',
    heading: 'Web Applications',
    paragraphs: [
      'Dashboards, client portals, and products that make the browser the most useful tab your users open.',
      'Client portals, dashboards, and customer-facing browser products. Define the closest shape — a dashboard, a client portal, or a business website — then describe the work.',
    ],
    quoteHref: '/services?type=web',
  }),
  desktop: offeringPage('/desktop', {
    eyebrow: 'Capabilities · 03',
    title: 'Desktop Systems | Foundation Stone Algorithms',
    metaDescription:
      'Focused operational software for teams whose work happens outside the browser. Request a focused quote for desktop software from Foundation Stone Algorithms.',
    heading: 'Desktop Systems',
    paragraphs: [
      'Focused operational software for teams whose work happens outside the browser.',
      'Focused software for operational teams on desktop environments. Choose one or more operating systems — Linux, macOS, or Windows — then review the request before sending it.',
    ],
    quoteHref: '/services?type=system',
  }),
};
