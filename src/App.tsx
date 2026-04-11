import './App.css';
import Folder from './components/Folder.jsx';
import { Ripple } from './components/magicui/ripple';
import whiteLogo from './assets/white.png';
import { motion } from 'motion/react';
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
          <motion.img
            src={whiteLogo}
            alt="Foundation Stone Algorithms logo"
            className="h-52 w-52 object-contain sm:h-64 sm:w-64 md:h-80 md:w-80"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', duration: 1.2, bounce: 0.25 }}
          />
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

        <div className="relative flex items-center px-6 py-10 lg:px-10">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-[32px] border border-white/10 bg-black/30 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-6">
            <div className="space-mono-regular rounded-[24px] border border-white/12 bg-black/35 px-4 py-3 text-left text-lg text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.48)] sm:px-5 sm:py-4 sm:text-xl">
              <q className="block text-lg font-medium leading-8 text-foreground sm:text-xl sm:leading-9">
                We create solutions for our clients with products powered by artificial intelligent agents
              </q>
              <div className="mt-4 flex items-center justify-end gap-2">
                <span className="inline-flex rounded-[4px] border border-white/15 bg-white/6 px-1.5 py-px text-[7px] uppercase tracking-[0.12em] text-foreground/65">
                  Head Agent
                </span>
                <cite className="text-right text-sm italic text-foreground/80 sm:text-base">- ZaSourceCode</cite>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="space-mono-bold text-xl text-foreground sm:text-2xl">Projects</h2>
                <span className="text-xs uppercase tracking-[0.32em] text-foreground/45">Restricted</span>
              </div>

              <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-x-3 gap-y-4 pt-2 sm:max-w-2xl sm:gap-x-5 sm:gap-y-6 sm:pt-3">
                {projectFolders.map((project, index) => (
                  <div
                    key={project.title}
                    className={[
                      'flex min-h-[7.5rem] w-full flex-col items-center justify-start gap-2 px-1 pt-2',
                      index === 0
                        ? 'col-span-2 justify-self-center'
                        : index === 1
                          ? 'justify-self-start'
                          : 'justify-self-end',
                    ].join(' ')}
                  >
                    <Folder color={project.color} size={0.82} items={createRestrictedItems(project.title)} />
                    <div className="text-center">
                      <p className="space-mono-bold text-sm text-foreground">{project.title}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">{project.accent}</p>
                    </div>
                  </div>
                ))}
              </div>
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
