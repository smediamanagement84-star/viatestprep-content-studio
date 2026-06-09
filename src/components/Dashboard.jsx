// ─────────────────────────────────────────────────────────────────────────────
//  ViAtestprep Content Studio — Strategic Command Center
//  src/components/Dashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Zap, BookOpen, AlertTriangle, ChevronDown, ChevronRight,
  TrendingUp, Target, Clock, RefreshCw, Lightbulb,
} from 'lucide-react';
import {
  CONTENT_LIBRARY,
  WEEKLY_TEMPLATES,
  generateWeeklyPlan,
} from '../lib/contentLogic.jsx';

// ─── Sub-components ────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center">
        <Icon size={17} className="text-orange" />
      </div>
      <div>
        <h2 className="text-white font-semibold text-base leading-tight">{title}</h2>
        {subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function DayCard({ item, index, isActive, onClick }) {
  const typeColor = item.type === 'animation'
    ? 'text-orange border-orange/30 bg-orange/5'
    : 'text-blue-400 border-blue-400/30 bg-blue-400/5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onClick={onClick}
      className={`
        glass rounded-xl p-4 cursor-pointer transition-all duration-200 select-none
        ${isActive
          ? 'border border-orange/40 orange-glow'
          : 'border border-white/5 hover:border-white/15'}
      `}
    >
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-orange font-bold text-xs tracking-widest uppercase">
            {item.shortDay}
          </span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs">{item.postTime}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColor} font-medium`}>
          {item.type === 'animation' ? 'Reel' : 'Carousel'}
        </span>
      </div>

      {/* Emoji + format */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{item.icon}</span>
        <span className="text-white font-semibold text-sm leading-tight">
          {item.format}
        </span>
      </div>

      {/* Topic */}
      <p className="text-white/60 text-xs leading-relaxed mb-3 line-clamp-2">
        {item.topic}
      </p>

      {/* Hook preview */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 pt-3 mt-1">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Hook</p>
              <p className="text-orange/90 text-xs leading-relaxed italic">
                "{item.hook}"
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-white/30">Psychology:</span>
                <span className="text-xs text-white/60 font-medium">
                  {item.psychPrinciple}
                </span>
              </div>
              <div className="mt-1 flex items-start gap-2">
                <span className="text-xs text-white/30 flex-shrink-0">Pain point:</span>
                <span className="text-xs text-white/50 leading-relaxed">
                  {item.painPoint}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LibraryCard({ niche, isExpanded, onToggle }) {
  return (
    <motion.div
      layout
      className="glass rounded-xl border border-white/5 overflow-hidden"
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{niche.emoji}</span>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{niche.label}</p>
            <p className="text-white/40 text-xs mt-0.5 italic">
              "{niche.paradox}"
            </p>
          </div>
        </div>
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={15} className="text-white/30" />
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5">
              {/* Paradox explainer */}
              <div className="mt-3 p-3 rounded-lg bg-orange/5 border border-orange/15">
                <p className="text-xs text-orange/70 uppercase tracking-widest mb-1">
                  Paradox Logic
                </p>
                <p className="text-white/80 text-xs leading-relaxed">
                  {niche.paradoxExplainer}
                </p>
              </div>

              {/* Pain points */}
              <div className="mt-3">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
                  Researched Pain Points
                </p>
                <ul className="space-y-1.5">
                  {niche.painPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange mt-0.5 flex-shrink-0">›</span>
                      <span className="text-white/60 text-xs leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick tip */}
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-white/3">
                <Lightbulb size={13} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-white/70 text-xs leading-relaxed">
                  <span className="text-yellow-400 font-semibold">Quick tip: </span>
                  {niche.quickTip}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export default function Dashboard() {
  const [nicheInput,       setNicheInput]       = useState('');
  const [weeklyPlan,       setWeeklyPlan]        = useState(null);
  const [activeDayIndex,   setActiveDayIndex]    = useState(null);
  const [expandedNiches,   setExpandedNiches]    = useState({});
  const [activeLibTab,     setActiveLibTab]      = useState('paradox');

  const niches = Object.values(CONTENT_LIBRARY);

  function handleGeneratePlan() {
    const plan = generateWeeklyPlan(nicheInput.trim());
    setWeeklyPlan(plan);
    setActiveDayIndex(0);
  }

  function toggleNiche(id) {
    setExpandedNiches(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-full">

      {/* ════════════════════════════════════════════════════════
          LEFT COLUMN — Calendar + Generator
      ════════════════════════════════════════════════════════ */}
      <div className="space-y-6">

        {/* ── Niche input ─────────────────────────────────── */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <SectionHeader
            icon={Target}
            title="Weekly Content Planner"
            subtitle="Enter your niche to generate a 7-day paradox-strategy calendar"
          />

          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={nicheInput}
                onChange={e => setNicheInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGeneratePlan()}
                placeholder="e.g. IELTS Writing Task 2, Speaking Band 7..."
                className="
                  flex-1 bg-obsidian-mid border border-white/10 rounded-xl
                  px-4 py-3 text-white text-sm placeholder-white/25
                  focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/20
                  transition-all duration-200
                "
              />
              <button
                onClick={handleGeneratePlan}
                className="
                  flex items-center gap-2 px-5 py-3 bg-orange text-white
                  font-semibold text-sm rounded-xl hover:bg-orange-dim
                  transition-colors duration-200 flex-shrink-0
                "
              >
                <Zap size={15} />
                Generate
              </button>
            </div>

            {!weeklyPlan && (
              <button
                onClick={() => { setNicheInput(''); handleGeneratePlan(); }}
                className="text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                Or generate with default IELTS topics →
              </button>
            )}
          </div>
        </div>

        {/* ── 7-Day Calendar ──────────────────────────────── */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <SectionHeader
            icon={Calendar}
            title="7-Day Content Calendar"
            subtitle={weeklyPlan ? 'Click any day to expand the full brief' : 'Generate a plan above to populate the calendar'}
          />

          {!weeklyPlan ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/3 flex items-center justify-center">
                <Calendar size={22} className="text-white/20" />
              </div>
              <p className="text-white/25 text-sm">No plan generated yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weeklyPlan.map((item, i) => (
                <DayCard
                  key={item.day}
                  item={item}
                  index={i}
                  isActive={activeDayIndex === i}
                  onClick={() =>
                    setActiveDayIndex(activeDayIndex === i ? null : i)
                  }
                />
              ))}
            </div>
          )}

          {weeklyPlan && (
            <button
              onClick={handleGeneratePlan}
              className="
                mt-4 w-full flex items-center justify-center gap-2
                py-2.5 rounded-xl border border-white/8 text-white/40
                text-xs hover:border-orange/30 hover:text-orange/70
                transition-all duration-200
              "
            >
              <RefreshCw size={12} />
              Regenerate Plan
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT COLUMN — Content Intelligence Library
      ════════════════════════════════════════════════════════ */}
      <div className="space-y-6">

        {/* ── Stats bar ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BookOpen, label: 'Pain Points', value: `${Object.values(CONTENT_LIBRARY).reduce((a, n) => a + n.painPoints.length, 0)}+` },
            { icon: AlertTriangle, label: 'Paradox Angles', value: `${Object.keys(CONTENT_LIBRARY).length}` },
            { icon: TrendingUp, label: 'Post Templates', value: `${WEEKLY_TEMPLATES.length}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass rounded-xl p-4 border border-white/5 text-center">
              <Icon size={16} className="text-orange mx-auto mb-2" />
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-white/35 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Content Library ─────────────────────────────── */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <SectionHeader
            icon={BookOpen}
            title="Content Intelligence Library"
            subtitle="Researched pain points + paradox angles for each IELTS niche"
          />

          {/* Tab switcher */}
          <div className="flex gap-2 mb-5 p-1 bg-obsidian-mid rounded-xl">
            {[
              { id: 'paradox', label: 'Paradox Angles' },
              { id: 'allniches', label: 'All Niches' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveLibTab(tab.id)}
                className={`
                  flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${activeLibTab === tab.id
                    ? 'bg-orange text-white'
                    : 'text-white/40 hover:text-white/60'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeLibTab === 'paradox' ? (
            /* Paradox quick-view grid */
            <div className="space-y-2">
              {niches.map((niche) => (
                <motion.div
                  key={niche.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-mid/50 border border-white/4 hover:border-orange/20 transition-colors"
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{niche.emoji}</span>
                  <div>
                    <p className="text-orange text-xs font-semibold leading-tight">
                      "{niche.paradox}"
                    </p>
                    <p className="text-white/40 text-xs mt-1 leading-relaxed">
                      {niche.paradoxExplainer.substring(0, 80)}...
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* All niches expanded accordion */
            <div className="space-y-2">
              {niches.map((niche) => (
                <LibraryCard
                  key={niche.id}
                  niche={niche}
                  isExpanded={!!expandedNiches[niche.id]}
                  onToggle={() => toggleNiche(niche.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Posting cadence guide ────────────────────────── */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <SectionHeader
            icon={Clock}
            title="Optimal Posting Windows"
            subtitle="Peak engagement times for IELTS audience segments"
          />
          <div className="space-y-2">
            {[
              { window: 'Mon–Fri  7:00 AM',  note: 'Commuters + pre-class prep students', peak: 92 },
              { window: 'Mon–Fri 12:00 PM',  note: 'Lunch-break study sessions',          peak: 78 },
              { window: 'Mon–Fri  6:00 PM',  note: 'Post-work evening learners',           peak: 88 },
              { window: 'Sat–Sun 10:00 AM',  note: 'Weekend intensive study blocks',       peak: 95 },
            ].map(({ window, note, peak }) => (
              <div key={window} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono">{window}</span>
                    <span className="text-orange text-xs font-bold">{peak}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${peak}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-orange rounded-full"
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-1">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
