import { useRef, useState, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight, Globe, Laptop, Smartphone } from 'lucide-react';
import whiteLogo from './assets/white.png';
import Services from './pages/Services';
import { Button } from '@/components/ui/button';

const capabilities = [
  {
    id: 'mobile',
    title: 'Mobile',
    icon: Smartphone,
    depth: 0.6,
    line: "Field tools, customer touchpoints, and internal apps in your users' pockets — native or cross-platform.",
  },
  {
    id: 'web',
    title: 'Web Applications',
    icon: Globe,
    depth: 1,
    line: 'Dashboards, client portals, and products that make the browser the most useful tab your users open.',
  },
  {
    id: 'system',
    title: 'Desktop Systems',
    icon: Laptop,
    depth: 1.4,
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

/**
 * Scroll-linked depth layer: the wrapped content drifts at its own speed
 * (proportional to `depth`) while crossing the viewport, and fades in once
 * on entry. Scroll-linked y lives on the outer motion.div, the one-shot
 * entrance on the inner one, so the transforms never fight.
 */
function ParallaxReveal({
  depth,
  className,
  children,
}: {
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [48 * depth, -16 * depth]);
  const smoothY = useSpring(y, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduceMotion ? undefined : { y: smoothY }}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ScrollProgressRail() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-primary/60"
      style={reduceMotion ? undefined : { scaleX }}
    />
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current > 8);
  });

  return (
    <header
      className={
        'sticky top-0 z-40 flex items-center justify-between px-6 py-4 transition-colors duration-300 ' +
        (scrolled ? 'border-b border-border bg-background/85 backdrop-blur-md' : 'border-b border-transparent')
      }
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={whiteLogo} alt="Foundation Stone Algorithms logo" className="h-8 w-8 object-contain" />
          <span className="text-sm font-semibold tracking-tight">Foundation Stone Algorithms</span>
        </div>
        <Link to="/services">
          <Button size="sm">Start a project</Button>
        </Link>
      </div>
    </header>
  );
}

function Home() {
  const reduceMotion = useReducedMotion();

  // Global background planes: glow drifts down-scale, grid counter-drifts up and fades.
  const { scrollYProgress } = useScroll();
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.12]);

  // Hero exits faster than the scroll with a depth-of-field blur ramp.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroProgress, [0, 0.9], [1, 0]);
  const heroFilter = useTransform(heroProgress, [0, 0.8], ['blur(0px)', 'blur(6px)']);

  // Statement line slides horizontally as it crosses the viewport.
  const statementRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress: statementProgress } = useScroll({
    target: statementRef,
    offset: ['start end', 'end start'],
  });
  const statementX = useTransform(statementProgress, [0, 1], [40, -40]);
  const statementOpacity = useTransform(statementProgress, [0, 0.4, 0.75, 1], [0.2, 1, 1, 0.3]);

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background text-foreground">
      <ScrollProgressRail />

      {/* Layered ambient background: two depth planes, clipped to their own layer so the
          scroll-linked glow/grid can never add phantom scrollable overflow to the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.10),transparent_55%)]"
          style={reduceMotion ? undefined : { y: glowY, scale: glowScale }}
        />
        <motion.div
          className="absolute inset-0 opacity-40 [background-image:radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
          style={reduceMotion ? undefined : { y: gridY, opacity: gridOpacity }}
        />
      </div>

      <Nav />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col">
        <section ref={heroRef} className="flex min-h-[92svh] flex-col items-center justify-center gap-6 px-6 py-20 text-center">
          <motion.div
            style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity, filter: heroFilter }}
            className="flex flex-col items-center gap-6"
          >
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
          </motion.div>
        </section>

        <ParallaxReveal depth={0.25} className="px-6">
          <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-6 text-center">
            {trustMetrics.map((metric) => (
              <div key={metric.label} className="px-2">
                <p className="font-mono text-xl font-semibold text-foreground sm:text-2xl">{metric.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </ParallaxReveal>

        <section id="capabilities" className="scroll-mt-16 px-6 py-28">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Capabilities</span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">What we build</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <ParallaxReveal key={capability.id} depth={capability.depth} className="h-full">
                  <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
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
                </ParallaxReveal>
              );
            })}
          </div>
        </section>

        <motion.p
          ref={statementRef}
          className="border-t border-border px-6 py-16 text-center font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground"
          style={reduceMotion ? undefined : { x: statementX, opacity: statementOpacity }}
        >
          Intelligent systems, engineered for your problem.
        </motion.p>

        <footer className="px-6 py-8 text-center text-xs text-muted-foreground">
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
