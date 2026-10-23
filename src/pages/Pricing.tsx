import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sitePages } from '@/seo/pages.mjs';
import { usePageMeta } from '@/seo/usePageMeta';
import SiteNav from '@/components/SiteNav';
import Monolith from '@/components/hero/Monolith';

export default function Pricing() {
  const pricing = sitePages.pricing;

  usePageMeta({
    title: pricing.title,
    description: pricing.metaDescription,
    canonicalUrl: pricing.canonicalUrl,
  });

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 bg-grain opacity-[0.05]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.10),transparent_55%)]"
      />

      <SiteNav />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 py-16 sm:py-24">
        <Link
          to="/"
          className="group mb-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          {pricing.eyebrow}
        </span>
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tighter sm:text-6xl">
              {pricing.heading}
            </h1>
            <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {pricing.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10">
              <Link to={pricing.ctaHref}>
                <Button size="lg">
                  {pricing.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <section className="mt-12 max-w-2xl border-t border-border pt-8">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                {pricing.itemsTitle}
              </h2>
              <ul className="mt-4 border-t border-border">
                {pricing.items.map((item) => (
                  <li
                    key={item.quoteHref}
                    className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border py-4"
                  >
                    <div className="min-w-0">
                      <Link
                        to={item.pageHref}
                        className="text-sm font-semibold tracking-tight transition-colors hover:text-goggles"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Link
                      to={item.quoteHref}
                      className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-goggles"
                    >
                      Get a quote
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-goggles" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
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
