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
  { title: 'TokenWork Bond', accent: 'Live Project', color: '#ef4444' },
  { title: 'CallCenter X', accent: 'Restricted Project', color: '#38bdf8' },
  { title: 'TradingWindow X', accent: 'Restricted Project', color: '#22c55e' },
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
    <div className="relative h-52 w-52 sm:h-64 sm:w-64 md:h-80 md:w-80">
      {!isLoaded ? <div aria-hidden="true" className="h-full w-full rounded-full bg-white/5" /> : null}
      {isLoaded ? (
        <motion.img
          src={whiteLogo}
          alt="Foundation Stone Algorithms logo"
          className="absolute inset-0 h-full w-full object-contain"
          initial={{ y: -100, opacity: 0 }}
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
    <div className="relative min-h-screen overflow-hidden bg-background">
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

      <section className="relative z-10 grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex min-h-[46vh] flex-col items-center justify-center gap-6 px-6 py-12 lg:min-h-screen lg:px-10">
          <HeroLogo />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <Link to="/services">
              <ShinyButton className="px-6 py-3 text-base sm:px-7 sm:py-3.5">
                Get a Quote <ArrowRight className="ml-1 h-4 w-4" />
              </ShinyButton>
            </Link>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center px-6 py-10 lg:px-12 w-full">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            
            <div className="relative overflow-hidden rounded-[24px] border border-border/80 bg-card/88 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
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

            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card/88 px-5 py-3 backdrop-blur-lg">
              <h2 className="space-mono-bold text-lg uppercase tracking-widest text-foreground">Workspaces</h2>
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-red-500 font-medium">
                <Lock className="h-3 w-3" />
                Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {projectFolders.map((project) => (
                <div
                  key={project.title}
                  className="group relative flex flex-col items-center justify-between rounded-[20px] border border-border/80 bg-card/88 p-5 backdrop-blur-xl transition-all hover:border-primary/35 hover:bg-card shadow-xl"
                >
                  <div className="flex h-40 w-full items-center justify-center">
                    <Folder color={project.color} size={0.9} items={createRestrictedItems(project.title)} />
                  </div>
                  <div className="mt-4 w-full text-center">
                    <h3 className="space-mono-bold text-sm tracking-wide text-foreground">{project.title}</h3>
                    <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{project.accent}</p>
                  </div>
                </div>
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
