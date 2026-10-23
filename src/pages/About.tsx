import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sitePages } from '@/seo/pages.mjs';
import { usePageMeta } from '@/seo/usePageMeta';
import SiteNav from '@/components/SiteNav';
import Monolith from '@/components/hero/Monolith';

export default function About() {
  const about = sitePages.about;

  usePageMeta({
    title: about.title,
    description: about.metaDescription,
    canonicalUrl: about.canonicalUrl,
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
          {about.eyebrow}
        </span>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tighter sm:text-6xl">
              {about.heading}
            </h1>
            <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10">
              <Link to={about.ctaHref}>
                <Button size="lg">
                  {about.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <section className="mt-12 max-w-2xl border-t border-border pt-8">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                {about.itemsTitle}
              </h2>
              <ul className="mt-4 border-t border-border">
                {about.items.map((item) => (
                  <li key={item.href} className="border-b border-border">
                    <Link
                      to={item.href}
                      className="group flex items-center justify-between gap-6 py-4 text-sm font-semibold tracking-tight transition-colors hover:text-goggles"
                    >
                      {item.title}
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-goggles" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <dl className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-border border border-border text-center">
              {about.trustPoints.map((point) => (
                <div key={point.label} className="px-3 py-7">
                  <dt className="sr-only">{point.label}</dt>
                  <dd className="font-mono text-xl font-semibold text-foreground sm:text-2xl">
                    {point.value}
                  </dd>
                  <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {point.label}
                  </dd>
                </div>
              ))}
            </dl>
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
