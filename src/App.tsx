import './App.css';
import { useEffect, useState } from 'react';
import Folder from './components/Folder.jsx';
import { Ripple } from './components/magicui/ripple';
import whiteLogo from './assets/white.png';
import { AnimatePresence, motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LetterGlitch from './components/ui/letter-glitch';
import { ShinyButton } from './components/magicui/shiny-button';
import { ArrowRight, Lock } from 'lucide-react';
import Services from './pages/Services';

const restrictedFiles = [
  { name: 'agent-core.ts', lines: [72, 56, 88] },
  { name: 'bond-engine.py', lines: [64, 84, 49] },
  { name: 'vault.rules', lines: [58, 36, 77] },
];

const createRestrictedItems = (projectName: string) =>
  restrictedFiles.map((file) => (
    <div className="secure-file" aria-label={`${projectName} restricted file ${file.name}`} key={file.name}>
      <div className="secure-file__header">
        <span className="secure-file__icon">
          <Lock className="h-3 w-3" />
        </span>
        <span className="secure-file__name">{file.name}</span>
      </div>
      <span className="secure-file__tag">Restricted Access</span>
      <div className="secure-file__code" aria-hidden="true">
        {file.lines.map((width, index) => (
          <span key={`${file.name}-${index}`} className="secure-file__line" style={{ width: `${width}%` }} />
        ))}
      </div>
    </div>
  ));

const projectFolders = [
  { title: 'BacktestEngine', color: '#ef4444', ip: '192.168.12.42', status: 'ACTIVE', metric: '98.2% ACC' },
  { title: 'TradeInsight', color: '#38bdf8', ip: '192.168.12.89', status: 'ONLINE', metric: '15ms LAT' },
  { title: 'CallCenterX', color: '#22c55e', ip: '192.168.12.11', status: 'SECURED', metric: '99.9% UPT' },
];

const rotatingQuotes = [
  'We create solutions for our clients with products powered by artificial intelligent agents',
  'Intelligent Software for all systems, made in the image of our clients customization',
];

function HeroLogo() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = whiteLogo;

    if (image.complete) {
      setIsLoaded(true);
      return undefined;
    }

    image.onload = () => setIsLoaded(true);

    return () => {
      image.onload = null;
    };
  }, []);

  return (
    <div className="relative h-32 w-32 sm:h-36 sm:w-36 md:h-44 md:w-44 group">
      {/* Decorative futuristic back glows */}
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
      <div className="absolute -inset-4 rounded-full border border-primary/5 scale-95 group-hover:scale-100 group-hover:border-primary/15 transition-all duration-700" />
      
      {!isLoaded ? <div aria-hidden="true" className="h-full w-full rounded-full bg-white/5 animate-pulse" /> : null}
      {isLoaded ? (
        <motion.img
          src={whiteLogo}
          alt="Foundation Stone Algorithms logo"
          className="absolute inset-0 h-full w-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', duration: 1.2, bounce: 0.25 }}
        />
      ) : null}
    </div>
  );
}

function RotatingQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setQuoteIndex((currentIndex) => (currentIndex + 1) % rotatingQuotes.length);
    }, 9000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-[7.5rem] sm:min-h-[6.75rem]">
      <AnimatePresence mode="wait">
        <motion.q
          key={rotatingQuotes[quoteIndex]}
          className="absolute inset-0 block text-lg font-medium leading-8 text-foreground sm:text-xl sm:leading-9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'linear' }}
        >
          {rotatingQuotes[quoteIndex]}
        </motion.q>
      </AnimatePresence>
    </div>
  );
}

function MainContent() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="fixed inset-0 z-0">
        <LetterGlitch
          glitchColors={['#0ea5e9', '#06b6d4', '#3b82f6', '#0c4a6e', '#164e63']}
          glitchSpeed={20}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          theme="dark"
        />
      </div>
      <Ripple className="fixed inset-0 z-0" mainCircleSize={260} mainCircleOpacity={0.28} numCircles={9} />
      <div className="fixed inset-0 z-0 bg-background/80 pointer-events-none" />

      <section className="relative z-10 grid min-h-[100svh] w-full grid-cols-1 pb-10 lg:grid-cols-[1fr_1fr] lg:pb-0">
        <div className="relative flex min-h-[50svh] flex-col justify-center items-center gap-7 px-6 py-12 lg:min-h-[100svh] lg:px-12 text-center mx-auto max-w-2xl">
          {/* Logo container */}
          <HeroLogo />

          {/* Headline and Value Proposition */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-primary"
            >
              System Integration & Development
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="space-mono-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground leading-[1.15]"
            >
              Intelligent Software Systems. Built to Perform.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-xs sm:text-sm leading-relaxed text-muted-foreground"
            >
              We engineer custom software systems across mobile, web, and desktop—powered by intelligent agents, optimized execution pipelines, and bespoke client customizations.
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 animate-pulse"
          >
            <Link to="/services">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative group/btn"
              >
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-sky-400 opacity-25 blur-md group-hover/btn:opacity-45 transition duration-300" />
                <ShinyButton className="px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wide relative">
                  Start Project Request <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                </ShinyButton>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust Metrics Ribbon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="w-full border-t border-border/60 pt-6 mt-2 grid grid-cols-3 gap-2 font-mono"
          >
            <div>
              <p className="text-lg sm:text-xl space-mono-bold text-foreground">100%</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground/80 mt-0.5">Client Customized</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl space-mono-bold text-foreground">Agentic</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground/80 mt-0.5">Autonomy Core</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl space-mono-bold text-foreground">Multi-OS</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground/80 mt-0.5">Mobile · Web · PC</p>
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center px-6 py-10 lg:px-12 w-full">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            
            <div className="relative overflow-hidden rounded-[24px] border border-border/80 bg-card/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 hover:border-primary/20 transition-all duration-300">
              {/* Cyber aesthetic corner markers */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/45"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/45"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/45"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/45"></div>
              
              <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              <div className="space-mono-regular text-lg leading-relaxed text-foreground sm:text-xl">
                <RotatingQuote />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-primary">
                  Internal Directive
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-px w-4 bg-muted-foreground/40"></div>
                  <cite className="text-sm font-bold tracking-wide text-foreground/90">ZaSourceCode</cite>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card/50 px-5 py-3 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h2 className="space-mono-bold text-lg uppercase tracking-widest text-foreground">Workspaces</h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-red-500 font-medium">
                <Lock className="h-3 w-3" />
                Secure Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {projectFolders.map((project) => (
                <motion.div
                  key={project.title}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative flex flex-col items-center justify-between rounded-[20px] border border-border/80 bg-card/45 p-5 backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-card shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                >
                  <div 
                    className="absolute inset-0 -z-10 rounded-[20px] opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl"
                    style={{ backgroundColor: project.color }}
                  />

                  {/* Top bar with cyber dots */}
                  <div className="w-full flex items-center justify-between mb-2 text-[8px] font-mono text-muted-foreground/60">
                    <span>{project.ip}</span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: project.color }} />
                      {project.status}
                    </span>
                  </div>

                  <div className="flex h-28 w-full items-center justify-center">
                    <Folder color={project.color} size={0.9} items={createRestrictedItems(project.title)} />
                  </div>
                  
                  <div className="mt-2 w-full text-center border-t border-border/50 pt-2">
                    <h3 className="space-mono-bold text-xs tracking-wide text-foreground mb-0.5">{project.title}</h3>
                    <span className="font-mono text-[9px] text-muted-foreground">{project.metric}</span>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <div className="absolute bottom-3 left-0 right-0 z-10 text-center text-[8px] text-muted-foreground sm:text-[9px]">
        {new Date().getFullYear()} Foundation Stone Algorithms. All rights reserved.
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default App;
