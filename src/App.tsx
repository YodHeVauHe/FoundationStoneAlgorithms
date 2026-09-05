import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Globe, Laptop, Smartphone } from 'lucide-react';
import whiteLogo from './assets/white.png';
import Services from './pages/Services';
import { Button } from '@/components/ui/button';

const capabilities = [
  {
    id: 'mobile',
    title: 'Mobile',
    icon: Smartphone,
    line: "Field tools, customer touchpoints, and internal apps in your users' pockets — native or cross-platform.",
  },
  {
    id: 'web',
    title: 'Web Applications',
    icon: Globe,
    line: 'Dashboards, client portals, and products that make the browser the most useful tab your users open.',
  },
  {
    id: 'system',
    title: 'Desktop Systems',
    icon: Laptop,
    line: 'Focused operational software for teams whose work happens outside the browser.',
  },
] as const;

const trustMetrics = [
  { value: '100%', label: 'Client Customized' },
  { value: 'Agentic', label: 'Autonomy Core' },
  { value: 'Multi-OS', label: 'Mobile · Web · PC' },
];

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      {/* Single ambient background: one radial glow + one dot grid, CSS only */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <img
              src={whiteLogo}
              alt="Foundation Stone Algorithms logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-sm font-semibold tracking-tight">Foundation Stone Algorithms</span>
          </div>
          <Link to="/services">
            <Button size="sm">Start a project</Button>
          </Link>
        </header>

        <section className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Intelligent Systems Studio
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              We build intelligent systems that solve hard problems.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              We engineer custom software systems across mobile, web, and desktop — powered by
              intelligent agents, optimized execution pipelines, and bespoke client customizations.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/services">
                <Button size="lg">
                  Start a project request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#capabilities">
                <Button variant="outline" size="lg">
                  See capabilities
                </Button>
              </a>
            </div>
          </Reveal>
        </section>

        <Reveal>
          <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-6 text-center">
            {trustMetrics.map((metric) => (
              <div key={metric.label} className="px-2">
                <p className="font-mono text-xl font-semibold text-foreground sm:text-2xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <section id="capabilities" className="scroll-mt-16 py-20">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Capabilities
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">What we build</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <Reveal key={capability.id} delay={index * 0.08}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold tracking-tight">{capability.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {capability.line}
                    </p>
                    <Link
                      to={`/services?type=${capability.id}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Request quote
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal>
          <p className="border-t border-border py-16 text-center font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Intelligent systems, engineered for your problem.
          </p>
        </Reveal>

        <footer className="py-8 text-center text-xs text-muted-foreground">
          {new Date().getFullYear()} Foundation Stone Algorithms. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default App;
