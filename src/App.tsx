import './App.css';
import Folder from './components/Folder.jsx';
import { Ripple } from './components/magicui/ripple';
import whiteLogo from './assets/white.png';
import { TypingAnimation } from './components/magicui/typing-animation';
import { motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LetterGlitch from './components/ui/letter-glitch';
import { ShinyButton } from './components/magicui/shiny-button';
import { ArrowRight } from 'lucide-react';
import Services from './pages/Services';

const projectFolders = [
  { title: 'AI Outreach Suite', accent: 'Example Project', color: '#2dd4bf' },
  { title: 'Client Ops Portal', accent: 'Example Project', color: '#38bdf8' },
  { title: 'Knowledge Engine', accent: 'Example Project', color: '#818cf8' },
];

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
        <div className="relative flex min-h-[46vh] items-center justify-center px-6 py-12 lg:min-h-screen lg:px-10">
          <motion.img
            src={whiteLogo}
            alt="Foundation Stone Algorithms logo"
            className="h-52 w-52 object-contain sm:h-64 sm:w-64 md:h-80 md:w-80"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', duration: 1.2, bounce: 0.25 }}
          />
        </div>

        <div className="relative flex items-center px-6 py-10 lg:px-10">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-[32px] border border-white/10 bg-black/30 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
            <div className="space-mono-regular rounded-[24px] border border-white/12 bg-black/35 px-4 py-3 text-left text-lg text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.48)] sm:px-5 sm:py-4 sm:text-xl">
              <TypingAnimation
                as="q"
                className="block text-lg font-medium leading-8 text-foreground sm:text-xl sm:leading-9"
                duration={100}
                delay={1500}
                startOnView={true}
              >
                We create solutions for our clients with products powered by artificial intelligent agents
              </TypingAnimation>
              <cite className="mt-3 block text-sm italic text-foreground/80 sm:text-base">- Be'Zaleel</cite>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="space-mono-bold text-xl text-foreground sm:text-2xl">Projects</h2>
                <span className="text-xs uppercase tracking-[0.32em] text-foreground/45">Dummy</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {projectFolders.map((project) => (
                  <div key={project.title} className="flex flex-col items-center gap-3">
                    <Folder color={project.color} />
                    <div className="text-center">
                      <p className="space-mono-bold text-sm text-foreground">{project.title}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">{project.accent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Link to="/services">
                <ShinyButton className="w-full px-6 py-3 text-base sm:px-7 sm:py-3.5">
                  Get a Quote <ArrowRight className="ml-1 h-4 w-4" />
                </ShinyButton>
              </Link>
            </motion.div>
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
