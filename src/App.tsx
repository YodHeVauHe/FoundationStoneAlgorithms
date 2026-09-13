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
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import whiteLogo from './assets/white.png';
import Services from './pages/Services';
import Monolith from '@/components/hero/Monolith';
import { Button } from '@/components/ui/button';

const capabilities = [
  {
    id: 'mobile',
    title: 'Mobile',
    line: "Field tools, customer touchpoints, and internal apps in your users' pockets — native or cross-platform.",
  },
  {
    id: 'web',
    title: 'Web Applications',
    line: 'Dashboards, client portals, and products that make the browser the most useful tab your users open.',
  },
  {
    id: 'system',
    title: 'Desktop Systems',
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

/** Blue glyph ribbon — the poster band between hero and proof. */
function Marquee() {
  const phrases = [
    'We build intelligent systems',
    '{ }',
    'That solve hard problems',
    '</>',
    'Foundation Stone Algorithms',
    '{ }',
  ];

  const half = (
    <div className="flex shrink-0 items-center">
      {phrases.map((phrase, index) => (
        <span
          key={index}
          className="flex items-center font-mono text-sm font-medium uppercase tracking-[0.22em] text-black"
        >
          <span className="px-6">{phrase}</span>
          <span className="text-black/50">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative z-10 w-[110%] -translate-x-[5%] -rotate-1 border-y-2 border-black bg-goggles py-3 shadow-[0_0_70px_hsl(221_85%_58%/0.28)]">
      <div className="flex w-max animate-marquee">
        {half}
        {half}
      </div>
    </div>
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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
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

  // Ambient planes: glow drifts down-scale, grid counter-drifts up and fades.
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

      {/* Film grain — kills the flat generated-page look */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 bg-grain opacity-[0.05]" />

      {/* Layered ambient background: two depth planes, clipped to their own layer */}
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

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col">
        {/* Hero — asymmetric: massive type left, the owl sigil on its blue field right */}
        <section ref={heroRef} className="relative flex min-h-[92svh] items-center px-6 py-20">
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 top-16 hidden select-none font-mono text-[200px] leading-none text-white/[0.05] lg:block"
            animate={reduceMotion ? undefined : { y: [0, -16, 0] }}
            transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {'{'}
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 bottom-10 hidden select-none font-mono text-[200px] leading-none text-goggles/15 lg:block"
            animate={reduceMotion ? undefined : { y: [0, 14, 0] }}
            transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            {'}'}
          </motion.span>

          <motion.div
            style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity, filter: heroFilter }}
            className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="relative flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <span className="absolute -top-9 right-0 hidden -rotate-6 select-none items-center rounded-sm bg-white px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-black lg:inline-flex">
                Solves hard problems ✦
              </span>
              <Reveal>
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                  Intelligent Systems Studio
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="text-5xl font-semibold tracking-tighter sm:text-6xl xl:text-7xl">
                  We build <span className="text-goggles">intelligent</span> systems that solve hard
                  problems.
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  We engineer custom software systems across mobile, web, and desktop — powered by
                  intelligent agents, optimized execution pipelines, and bespoke client customizations.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
            </div>
            <div className="relative order-first h-64 w-full sm:h-80 lg:order-none lg:h-[460px]">
              <div
                aria-hidden="true"
                className="absolute inset-x-4 top-8 bottom-8 bg-goggles sm:inset-x-10 lg:inset-x-14"
              />
              <Monolith className="absolute inset-0" />
            </div>
          </motion.div>
        </section>

        <Marquee />

        <Reveal>
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            {trustMetrics.map((metric, index) => (
              <div key={metric.label} className="px-3 py-7 text-center sm:py-9">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-goggles">
                  0{index + 1}
                </p>
                <p className="mt-2 font-mono text-xl font-semibold text-foreground sm:text-2xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Capabilities — a ledger, not a card grid. Hover fills the row blue. */}
        <section id="capabilities" className="scroll-mt-16 px-6 py-24">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-4xl">What we build</h2>
          </Reveal>
          <div className="mt-10 border-t border-border">
            {capabilities.map((capability, index) => (
              <Reveal key={capability.id} delay={index * 0.06}>
                <Link
                  to={`/services?type=${capability.id}`}
                  className="group relative flex items-center gap-6 overflow-hidden border-b border-border px-2 py-8 transition-colors duration-200 hover:bg-goggles sm:gap-10 sm:px-4"
                >
                  <span className="font-mono text-xs text-muted-foreground transition-colors duration-200 group-hover:text-black/60">
                    0{index + 1}
                  </span>
                  <span className="flex-1 text-2xl font-semibold tracking-tighter transition-colors duration-200 group-hover:text-black sm:text-4xl">
                    {capability.title}
                  </span>
                  <span className="hidden max-w-sm text-sm leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-black/70 md:block">
                    {capability.line}
                  </span>
                  <ArrowUpRight className="h-6 w-6 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <motion.p
          ref={statementRef}
          className="border-t border-border px-6 py-16 text-center font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground"
          style={reduceMotion ? undefined : { x: statementX, opacity: statementOpacity }}
        >
          <span className="text-goggles">{'{ '}</span>
          Intelligent systems, engineered for your problem.
          <span className="text-goggles">{' }'}</span>
        </motion.p>

        <footer className="flex flex-col items-center gap-3 px-6 py-10 text-center text-xs text-muted-foreground">
          <span aria-hidden="true" className="font-mono text-sm text-foreground/70">
            {'{ }'}
          </span>
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
