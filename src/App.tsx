import './App.css';
import { Ripple } from './components/magicui/ripple';
import whiteLogo from './assets/white.png';
import { TypingAnimation } from './components/magicui/typing-animation';
import { motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LetterGlitch from './components/ui/letter-glitch';
import { ShinyButton } from './components/magicui/shiny-button';
import { ArrowRight } from 'lucide-react';
import Services from './pages/Services';

function MainContent() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-5">
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

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-2">
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <motion.img
            src={whiteLogo}
            alt="Logo"
            className="h-52 w-52 object-contain sm:h-64 sm:w-64 md:h-80 md:w-80"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.2, bounce: 0.25 }}
          />
          <div className="space-mono-regular max-w-md rounded-[24px] border border-white/12 bg-black/35 px-4 py-3 text-center text-lg text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-md sm:max-w-2xl sm:px-5 sm:py-4 sm:text-xl md:max-w-3xl">
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
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-5"
          >
            <Link to="/services">
              <ShinyButton className="px-6 py-3 text-base sm:px-7 sm:py-3.5">
                Get a Quote <ArrowRight className="w-4 h-4 ml-1" />
              </ShinyButton>
            </Link>
          </motion.div>
        </div>
      </div>

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
