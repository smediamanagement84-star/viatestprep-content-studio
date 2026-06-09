// ─────────────────────────────────────────────────────────────────────────────
//  ViAtestprep Content Studio — SPA Shell
//  src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wand2, Smartphone,
  Zap, ChevronRight, Clapperboard,
} from 'lucide-react';
import Dashboard     from './components/Dashboard.jsx';
import Generator     from './components/Generator.jsx';
import Previewer     from './components/Previewer.jsx';
import AutoResearch from './components/AutoResearch.jsx';

// ─── Navigation config ──────────────────────────────────────────

const TABS = [
  {
    id:       'dashboard',
    label:    'Command Center',
    short:    'Strategy',
    icon:     LayoutDashboard,
    badge:    null,
  },
  {
    id:       'generator',
    label:    'Asset Generator',
    short:    'Generator',
    icon:     Wand2,
    badge:    null,
  },
  {
    id:       'previewer',
    label:    'Preview & Export',
    short:    'Preview',
    icon:     Smartphone,
    badge:    null,
  },
  {
    id:       'viral',
    label:    'AI Research',
    short:    'Research',
    icon:     Clapperboard,
    badge:    'NEW',
  },
];

// ─── Logo ────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Icon mark */}
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center">
          <Zap size={16} className="text-white" fill="white" />
        </div>
        <div
          className="absolute inset-0 rounded-lg bg-orange/40 blur-md -z-10"
        />
      </div>
      {/* Wordmark */}
      <div className="leading-none">
        <span className="text-white font-black text-base tracking-tight">
          VIA
        </span>
        <span className="text-orange font-black text-base tracking-tight">
          testprep
        </span>
      </div>
    </div>
  );
}

// ─── Tab bar ─────────────────────────────────────────────────────

function TabBar({ activeTab, onChange, animationReady }) {
  return (
    <nav className="flex gap-1 p-1 bg-obsidian-mid/70 rounded-2xl border border-white/6 backdrop-blur-sm">
      {TABS.map(({ id, label, short, icon: Icon, badge }) => {
        const isActive = activeTab === id;
        const showDot  = id === 'previewer' && animationReady && !isActive;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              relative flex items-center gap-2 px-4 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-200 select-none
              ${isActive
                ? 'bg-orange text-white shadow-md'
                : 'text-white/40 hover:text-white/70 hover:bg-white/4'}
            `}
          >
            <Icon size={15} className="flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{short}</span>
            {badge && !isActive && (
              <span className="text-xs bg-orange text-white px-1.5 py-0.5 rounded-full leading-none font-bold">
                {badge}
              </span>
            )}
            {showDot && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange animate-pulse-slow" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Breadcrumb trail ────────────────────────────────────────────

function Breadcrumb({ tab }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/25">
      <span>Studio</span>
      <ChevronRight size={11} />
      <span className="text-white/50">{tab.label}</span>
    </div>
  );
}

// ─── Status bar ──────────────────────────────────────────────────

function StatusBar({ animationData, scriptData }) {
  return (
    <div className="flex items-center gap-4 text-xs text-white/20">
      <span>
        Animation:{' '}
        <span className={animationData ? 'text-orange/60' : 'text-white/20'}>
          {animationData ? 'Ready' : 'None'}
        </span>
      </span>
      <span className="text-white/8">·</span>
      <span>
        Script:{' '}
        <span className={scriptData ? 'text-blue-400/60' : 'text-white/20'}>
          {scriptData ? `${scriptData.length} slides` : 'None'}
        </span>
      </span>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────

export default function App() {
  const [activeTab,      setActiveTab]      = useState('dashboard');
  const [animationData,  setAnimationData]  = useState(null);
  const [scriptData,     setScriptData]     = useState(null);
  const [weeklyResearch, setWeeklyResearch] = useState(() => {
    try {
      const cachedData = localStorage.getItem('research_engine_data');
      const cachedTime = localStorage.getItem('research_engine_time');
      if (cachedData && cachedTime) {
        const timeDiff = Date.now() - new Date(cachedTime).getTime();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (timeDiff < oneWeek) {
          return JSON.parse(cachedData);
        }
      }
    } catch (e) {
      console.error('Failed to load cached research', e);
    }
    return null;
  });

  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    try {
      const cachedPlan = localStorage.getItem('weekly_plan_data');
      if (cachedPlan) {
        return JSON.parse(cachedPlan);
      }
    } catch (e) {
      console.error('Failed to load cached plan', e);
    }
    return null;
  });

  const [prefilledAsset, setPrefilledAsset] = useState(null);

  const activeTabObj = TABS.find(t => t.id === activeTab);

  function handleAnimationGenerated(data) {
    setAnimationData(data);
    // Automatically switch to previewer after a brief delay
    setTimeout(() => setActiveTab('previewer'), 600);
  }

  return (
    <div className="min-h-screen grid-bg flex flex-col">

      {/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-obsidian/80 backdrop-blur-xl">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">
            <Logo />

            {/* Separator */}
            <div className="hidden sm:block w-px h-6 bg-white/8" />

            {/* Tab bar */}
            <div className="flex-1 flex justify-center">
              <TabBar
                activeTab={activeTab}
                onChange={setActiveTab}
                animationReady={!!animationData}
              />
            </div>

            {/* Status */}
            <div className="hidden lg:block">
              <StatusBar animationData={animationData} scriptData={scriptData} />
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          BREADCRUMB
      ══════════════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-2 flex items-center justify-between">
        <Breadcrumb tab={activeTabObj} />
        <div className="text-xs text-white/15 hidden md:block">
          ViAtestprep Content Studio v1.0
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                weeklyPlan={weeklyPlan} 
                setWeeklyPlan={setWeeklyPlan} 
                setPrefilledAsset={setPrefilledAsset} 
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'generator' && (
              <Generator
                prefilledAsset={prefilledAsset}
                setPrefilledAsset={setPrefilledAsset}
                onAnimationGenerated={handleAnimationGenerated}
                onScriptGenerated={setScriptData}
                weeklyPlan={weeklyPlan}
              />
            )}

            {activeTab === 'previewer' && (
              <Previewer 
                animationData={animationData} 
                scriptData={scriptData} 
                prefilledAsset={prefilledAsset} 
              />
            )}

            {activeTab === 'viral' && (
              <AutoResearch 
                weeklyPlan={weeklyPlan} 
                setWeeklyPlan={setWeeklyPlan} 
                weeklyResearch={weeklyResearch}
                setWeeklyResearch={setWeeklyResearch}
                setPrefilledAsset={setPrefilledAsset} 
                setActiveTab={setActiveTab} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/4 py-4 px-6">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <Logo />
          <p className="text-white/15 text-xs">
            © 2025 ViAtestprep Content Studio · v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}