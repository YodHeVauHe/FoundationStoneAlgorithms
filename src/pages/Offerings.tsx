import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { offerings, type Offering } from '@/seo/offerings.mjs';
import { usePageMeta } from '@/seo/usePageMeta';
import Monolith from '@/components/hero/Monolith';

function OfferingPage({ offering }: { offering: Offering }) {
  usePageMeta({
    title: offering.title,
    description: offering.metaDescription,
    canonicalUrl: offering.canonicalUrl,
  });

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 bg-grain opacity-[0.05]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.10),transparent_55%)]"
      />

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <Monolith still className="h-8 w-8" />
            <span className="sr-only">Foundation Stone Algorithms</span>
            <span className="text-sm font-semibold tracking-tight">Foundation Stone Algorithms</span>
          </Link>
          <Link to={offering.quoteHref}>
            <Button size="sm">Start a project</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 py-16 sm:py-24">
        <Link
          to="/"
          className="group mb-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          {offering.eyebrow}
        </span>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tighter sm:text-6xl">
          {offering.heading}
        </h1>
        <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>{offering.paragraphs[0]}</p>
          <p>{offering.paragraphs[1]}</p>
        </div>
        <div className="mt-10">
          <Link to={offering.quoteHref}>
            <Button size="lg">
              Start a project request
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {offering.related?.length ? (
          <nav aria-label="Related" className="mt-12 max-w-2xl border-t border-border pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              In this quote
            </p>
            <ul className="mt-4 border-t border-border">
              {offering.related.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center justify-between border-b border-border py-4 text-sm font-semibold tracking-tight transition-colors hover:text-goggles"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-goggles" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
          </div>
          <Monolith className="mx-auto h-64 w-64 sm:h-72 sm:w-72" />
        </div>
      </main>

      <footer className="relative z-10 flex flex-col items-center gap-3 px-6 py-10 text-center text-xs text-muted-foreground">
        <Monolith still className="h-8 w-8" />
        {new Date().getFullYear()} Foundation Stone Algorithms. All rights reserved.
      </footer>
    </div>
  );
}

export function MobilePage() {
  return <OfferingPage offering={offerings.mobile} />;
}

export function WebPage() {
  return <OfferingPage offering={offerings.web} />;
}

export function DesktopPage() {
  return <OfferingPage offering={offerings.desktop} />;
}

export function DashboardPage() {
  return <OfferingPage offering={offerings.dashboard} />;
}

export function ClientPortalPage() {
  return <OfferingPage offering={offerings.clientPortal} />;
}

export function BusinessWebsitePage() {
  return <OfferingPage offering={offerings.businessWebsite} />;
}

export function AndroidPage() {
  return <OfferingPage offering={offerings.android} />;
}

export function IosPage() {
  return <OfferingPage offering={offerings.ios} />;
}

