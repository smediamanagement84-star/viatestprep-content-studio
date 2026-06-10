import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  runWeeklyResearch, 
  generateContentPlan,
} from '../lib/researchEngine.js';
import { BRAND } from '../lib/brandTokens.js';
import {
  TrendingUp, Calendar, Zap, RefreshCw, AlertTriangle, 
  Plus, Check, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';

// ─── Icons ───────────────────────────────────────────────────────────────────
const FORMAT_ICON = { 
  carousel: '📱', 
  infographic: '📊', 
  reel: '🎬' 
};

const FORMAT_LABEL = { 
  carousel: 'Carousel', 
  infographic: 'Infographic', 
  reel: 'Reel' 
};

const EXAM_COLOR = { 
  IELTS: BRAND.gold, 
  PTE: BRAND.teal 
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AutoResearch({ weeklyPlan, setWeeklyPlan, weeklyResearch, setWeeklyResearch, setActiveTab }) {
  const research = weeklyResearch;
  const setResearch = setWeeklyResearch;
  const plan = research ? generateContentPlan(research) : null;
  const [loading, setLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState({});
  const [expandedTrend, setExpandedTrend] = useState(null);

  // ── Run Research & Cache ────────────────────────────────────────────────
  const handleRunResearch = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const data = runWeeklyResearch();
      setResearch(data);
      
      try {
        localStorage.setItem('research_engine_data', JSON.stringify(data));
        localStorage.setItem('research_engine_time', new Date().toISOString());
      } catch (e) {
        console.error('Failed to cache research', e);
      }
      
      setLoading(false);
    }, 1600);
  }, [setResearch]);

  // ── Add single trend to planner ──────────────────────────────────────────
  const handleAddToPlanner = (trend, format) => {
    const dayNames = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const currentPlanLength = weeklyPlan?.length || 0;
    const dayIdx = currentPlanLength % 7;

    const newEntry = {
      dayIndex:  currentPlanLength,
      day:       days[dayIdx],
      shortDay:  dayNames[dayIdx],
      postTime:  '7:00 AM',
      exam:      trend.exam,
      topic:     trend.topic,
      hook:      trend.hook,
      angle:     trend.angle,
      format:    format, // 'carousel', 'reel', or 'infographic'
      category:  trend.category || 'Vocabulary',
      stat:      trend.stat,
      painPoint: trend.painPoint,
      fix:       trend.fix || 'Covered in the content',
      insight:   trend.insight,
      hashtags:  trend.hashtags || ['#IELTS', '#PTE', '#EnglishTest', '#VIAtestprep'],
      caption:   trend.caption || `${trend.hook}\n\n${trend.angle}`,
      trendId:   trend.id,
      fromResearch: true,
    };

    const newPlan = [...(weeklyPlan || []), newEntry];
    setWeeklyPlan(newPlan);
    try {
      localStorage.setItem('weekly_plan_data', JSON.stringify(newPlan));
    } catch (e) {}

    // Track added state
    setAddedToPlan(prev => ({ ...prev, [`${trend.id}-${format}`]: true }));
  };

  // ── Transfer Plan to Command Center Planner ──────────────────────────────
  const handleTransferToPlanner = useCallback(() => {
    if (!plan) return;
    setWeeklyPlan(plan);
    try {
      localStorage.setItem('weekly_plan_data', JSON.stringify(plan));
    } catch (e) {
      console.error('Failed to cache plan', e);
    }
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setActiveTab('dashboard'); // Redirect to Command Center Content Calendar
    }, 1200);
  }, [plan, setWeeklyPlan, setActiveTab]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6" style={{ fontFamily: BRAND.font }}>
      
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange/15 border border-orange/20 flex items-center justify-center">
            <TrendingUp className="text-orange" size={20} />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-2xl tracking-tight">
              AI Research Intelligence
            </h1>
            <p className="text-white/35 text-sm mt-0.5">
              Weekly trending IELTS + PTE content signals. Run research and add best ideas to your planner.
            </p>
          </div>
        </div>

        {research && !loading && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/8 hover:border-white/15 text-white/50 hover:text-white transition-all"
          >
            <Calendar size={13} />
            Go to Weekly Planner
          </button>
        )}
      </div>

      {/* ── Research Control Bar ───────────────────────────────── */}
      {research && !loading && (
        <div className="flex flex-wrap gap-3 items-center justify-between p-4 rounded-2xl border border-white/5 bg-obsidian-mid/40">
          <div className="flex items-center gap-4">
            <button
              onClick={handleRunResearch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange text-white hover:bg-orange-dim transition-colors"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh Weekly Trends
            </button>
            <span className="text-white/20 text-xs font-mono">
              Week {research.weekNumber} · Next auto-rotate: {research.nextRefresh}
            </span>
          </div>

          <button
            onClick={handleTransferToPlanner}
            disabled={transferSuccess}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border border-teal/20 text-teal bg-teal/5 hover:bg-teal/10 transition-colors"
          >
            <Check size={12} />
            {transferSuccess ? 'Transferred Recommended Plan!' : 'Add All 7 Days to Planner'}
          </button>
        </div>
      )}

      {/* ── Content Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Trending Topics (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          
          {!research && !loading && (
            <div className="glass rounded-2xl p-12 text-center border border-white/5 bg-obsidian-mid/40">
              <Zap className="text-white/25 mx-auto mb-4" size={40} />
              <h3 className="text-white font-bold text-lg">No research data yet</h3>
              <p className="text-white/40 text-sm mt-1 mb-6">
                Click below to analyze trending topics and compile data for Nepali & South Asian students.
              </p>
              <button
                onClick={handleRunResearch}
                className="px-6 py-3 rounded-xl bg-orange text-white text-xs font-bold hover:bg-orange-dim transition-colors"
              >
                Run Weekly Research
              </button>
            </div>
          )}

          {loading && (
            <div className="glass rounded-2xl p-12 text-center border border-white/5 bg-obsidian-mid/40 space-y-4">
              <RefreshCw className="text-orange mx-auto animate-spin" size={32} />
              <h3 className="text-white font-bold text-base">Analyzing trends...</h3>
              <p className="text-white/30 text-xs">
                Scanning IELTS pain points & PTE algorithm changes for Q2 2025
              </p>
            </div>
          )}

          {research && !loading && (
            <div className="space-y-3">
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">
                Top Trending Topics ({research.trends.length})
              </h3>
              
              {research.trends.map((trend, idx) => {
                const examColor = EXAM_COLOR[trend.exam] || BRAND.gold;
                const isExpanded = expandedTrend === idx;
                const momentum = trend.momentum;

                return (
                  <div key={trend.id} className="glass border border-white/6 rounded-2xl overflow-hidden" style={{ background: BRAND.bgCard }}>
                    <button
                      onClick={() => setExpandedTrend(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/2 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: `${examColor}15`, color: examColor }}>
                        {idx + 1}
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold border" style={{ color: examColor, borderColor: `${examColor}30`, background: `${examColor}08` }}>
                        {trend.exam}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm leading-tight">{trend.topic}</h4>
                        <p className="text-white/30 text-xs mt-0.5 truncate">"{trend.hook}"</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] font-bold block" style={{ color: examColor }}>
                          {momentum >= 90 ? '🔥 Hot' : '📈 Rising'} ({momentum}%)
                        </span>
                        <div className="w-12 h-1 bg-white/8 rounded-full overflow-hidden mt-1 ml-auto">
                          <div className="h-full rounded-full" style={{ width: `${momentum}%`, backgroundColor: examColor }} />
                        </div>
                      </div>

                      {isExpanded ? <ChevronUp size={14} className="text-white/35" /> : <ChevronDown size={14} className="text-white/35" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5 p-4 bg-obsidian/40 space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-white/30 block mb-0.5">PAIN POINT</span>
                              <span className="text-white/70">{trend.painPoint}</span>
                            </div>
                            <div>
                              <span className="text-white/30 block mb-0.5">KEY STAT</span>
                              <span className="text-orange/80 font-semibold">{trend.stat}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-white/30 block mb-0.5">THE VALUE INSIGHT</span>
                              <span className="text-white/70 italic">"{trend.insight}"</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-white/30 block mb-0.5">THE RECOMMENDED FIX</span>
                              <span className="text-teal font-medium">{trend.fix}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 items-center">
                            <span className="text-white/30 text-[10px] uppercase font-bold mr-1">Add to Planner:</span>
                            {trend.formats.map(fmt => {
                              const key = `${trend.id}-${fmt}`;
                              const isAdded = addedToPlan[key];

                              return (
                                <button
                                  key={fmt}
                                  onClick={() => handleAddToPlanner(trend, fmt)}
                                  disabled={isAdded}
                                  className={`
                                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                    ${isAdded 
                                      ? 'bg-teal/10 text-teal border border-teal/20 cursor-default' 
                                      : 'bg-white/5 border border-white/8 hover:border-orange/30 text-white/70 hover:text-white'}
                                  `}
                                >
                                  {isAdded ? <Check size={11} /> : <Plus size={11} />}
                                  {FORMAT_LABEL[fmt]}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Market Signals & Stats (1/3 width on desktop) */}
        <div className="space-y-5">
          
          {research && !loading && (
            <>
              {/* Quick Summary card */}
              <div className="glass p-5 border border-white/6 rounded-2xl space-y-4" style={{ background: BRAND.bgCard }}>
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">
                  Weekly Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/2 rounded-xl text-center">
                    <span className="text-2xl font-black text-orange">{research.weekSummary.ieltsCount}</span>
                    <span className="text-[10px] text-white/30 block mt-0.5">IELTS Trends</span>
                  </div>
                  <div className="p-3 bg-white/2 rounded-xl text-center">
                    <span className="text-2xl font-black text-teal">{research.weekSummary.pteCount}</span>
                    <span className="text-[10px] text-white/30 block mt-0.5">PTE Trends</span>
                  </div>
                </div>
                <div className="p-3.5 bg-orange/5 border border-orange/15 rounded-xl">
                  <span className="text-orange text-[10px] font-black tracking-wider uppercase block">HOTTEST TREND</span>
                  <span className="text-white font-bold text-xs mt-1 block">{research.weekSummary.topExam}: {research.weekSummary.topTopic}</span>
                </div>
              </div>

              {/* Market Signals */}
              <div className="space-y-3">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">
                  Market Signals
                </h3>
                <div className="space-y-3">
                  {research.marketSignals.map((sig, i) => (
                    <div key={i} className="glass p-4 border border-white/5 rounded-xl bg-obsidian-mid/30 space-y-1.5">
                      <div className="text-orange font-bold text-xs">{sig.signal}</div>
                      <div className="text-white/70 text-xs">{sig.impact}</div>
                      <div className="text-white/35 text-[11px] italic">Nepal/South Asia Opportunity</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

      </div>

      {/* ── Footer CTA ────────────────────────────────────────── */}
      {research && !loading && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange to-orange-dim text-white font-extrabold text-sm hover:shadow-lg hover:shadow-orange/20 transition-all"
          >
            Go to Weekly Planner to Generate Content
            <ArrowRight size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
