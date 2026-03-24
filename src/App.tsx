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
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
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
      <Ripple className="fixed inset-0 z-0" mainCircleSize={250} mainCircleOpacity={0.35} numCircles={10} />

      <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 sm:gap-1 w-full max-w-7xl mx-auto h-full">
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <motion.img
            src={whiteLogo}
            alt="Logo"
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.2, bounce: 0.25 }}
          />
          <div className="space-mono-regular text-foreground/90 text-base sm:text-lg max-w-sm sm:max-w-xl md:max-w-2xl text-center px-4">
            <TypingAnimation
              as="q"
              className="text-primary font-medium block text-base sm:text-lg"
              duration={100}
              delay={1500}
              startOnView={true}
            >
              We create solutions for our clients with products powered by artificial intelligent agents
            </TypingAnimation>
            <cite className="block text-sm mt-2 italic">- Be'Zaleel</cite>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-6"
          >
            <Link to="/services">
              <ShinyButton className="px-4 py-2 text-sm sm:px-5 sm:py-2.5">
                Get a Quote <ArrowRight className="w-4 h-4 ml-1" />
              </ShinyButton>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center z-10 text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground">
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
