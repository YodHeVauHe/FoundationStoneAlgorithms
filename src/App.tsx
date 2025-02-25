import './App.css';
import { Ripple } from './components/magicui/ripple';
import { useTheme } from './hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import blackLogo from './assets/black.png';
import whiteLogo from './assets/white.png';
import { TypingAnimation } from './components/magicui/typing-animation';
import { motion } from 'motion/react';
import { ShinyButton } from './components/magicui/shiny-button';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ContactForm } from './components/ContactForm';

function MainContent() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Ripple className="fixed inset-0 z-0" mainCircleSize={250} mainCircleOpacity={0.35} numCircles={10} />
      <ShinyButton
        onClick={() => navigate('/contact')}
        className="fixed top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-50 text-[10px] sm:text-xs px-3 py-1.5 bg-background/95 dark:bg-background/80 text-foreground font-medium hover:bg-background/90 dark:hover:bg-background/90 border border-border/50 dark:border-border/20"
      >
        Contact Us
      </ShinyButton>
      <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 sm:gap-1 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <motion.img
            src={theme === 'dark' ? whiteLogo : blackLogo}
            alt="Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
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
              We pride ourselves in creating solutions for our clients with products powered by artificial intelligent agents
            </TypingAnimation>
            <cite className="block text-sm mt-2 text-muted-foreground italic">- Be'zaleel</cite>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-1 sm:mt-2 flex-wrap">
            <motion.div
              className="flex flex-col items-center gap-1 sm:gap-1.5"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1.2, delay: 3.0, bounce: 0.25 }}
            >
              <img
                src="/Agent_Chozek.png"
                alt="Agent Chozek"
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
              />
              <span className="text-foreground text-xs sm:text-sm font-medium">Agent Chozek</span>
              <span className="text-foreground/70 text-[10px] sm:text-[12px]">Dev Engineer</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-0.5 sm:gap-1"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1.2, delay: 3.4, bounce: 0.25 }}
            >
              <img
                src="/Agent_Emuna.png"
                alt="Agent Emuna"
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain"
              />
              <span className="text-foreground text-xs sm:text-sm font-medium">Agent Enuma</span>
              <span className="text-foreground/70 text-[10px] sm:text-[12px]">Personal Assistant</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-1 sm:gap-1.5"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1.2, delay: 3.8, bounce: 0.25 }}
            >
              <img
                src="/Agent_Sophron.png"
                alt="Agent Sophron"
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
              />
              <span className="text-foreground text-xs sm:text-sm font-medium">Agent Sophron</span>
              <span className="text-foreground/70 text-[10px] sm:text-[12px]">Call Center</span>
            </motion.div>
          </div>
          <div className="mt-1 sm:mt-2 md:mt-3 text-foreground/60 text-[8px] sm:text-[9px] md:text-[10px]">
            {new Date().getFullYear()} Foundation Stone Algorithms. All rights reserved.
          </div>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 p-0.5 w-[52px] sm:w-[58px] md:w-[64px] h-[28px] sm:h-[30px] md:h-[32px] rounded-full transition-all duration-300 bg-[#e4e4e7] dark:bg-[#27272a] shadow-lg focus:outline-none focus:ring-0 focus:border-0 outline-none border-none pointer-events-auto"
        aria-label="Toggle theme"
      >
        <div
          className={`w-[22px] sm:w-[24px] md:w-[26px] h-[22px] sm:h-[24px] md:h-[26px] rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-[26px] sm:translate-x-[29px] md:translate-x-[32px] bg-[#18181b]' : 'translate-x-0 bg-white'}`}
        >
          {theme === 'dark' ? (
            <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#a1a1aa]" />
          ) : (
            <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#71717a]" />
          )}
        </div>
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
    </Router>
  );
}

export default App;
