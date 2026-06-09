import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Zap, Copy, Check, ArrowRight,
  TrendingUp, Clock, RefreshCw, AlertTriangle
} from 'lucide-react';
import { runWeeklyResearch, generateContentPlan } from '../lib/researchEngine.js';
import { BRAND } from '../lib/brandTokens.js';

// ─── Helpers ────────────────────────────────────────────────────
function copyTextToClipboard(text, setCopiedState) {
  navigator.clipboard.writeText(text).then(() => {
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  }).catch(() => {});
}

export default function Dashboard({ weeklyPlan, setWeeklyPlan, setPrefilledAsset, setActiveTab }) {
  const [copiedDay, setCopiedDay] = useState(null);
  const [copiedType, setCopiedType] = useState(null); // 'idea' | 'hook'

  // Initialize with default deterministic plan if none exists
  useEffect(() => {
    if (!weeklyPlan) {
      const research = runWeeklyResearch();
      const plan = generateContentPlan(research);
      setWeeklyPlan(plan);
    }
  }, [weeklyPlan, setWeeklyPlan]);

  const handleSendToGenerator = (day) => {
    // Pack the day data into a prefilledAsset object
    setPrefilledAsset({
      topic: day.topic,
      angle: day.angle || day.painPoint,
      format: day.format,
      exam: day.exam,
      category: day.category,
      hook: day.hook,
      painPoint: day.painPoint,
      stat: day.stat,
      fix: day.fix,
      insight: day.insight,
      hashtags: day.hashtags,
      caption: day.caption,
      trendId: day.trendId
    });
    
    // Switch to Generator tab
    setActiveTab('generator');
  };

  const handleCopy = (text, dayIndex, type) => {
    copyTextToClipboard(text, (val) => {
      if (val) {
        setCopiedDay(dayIndex);
        setCopiedType(type);
      } else {
        setCopiedDay(null);
        setCopiedType(null);
      }
    });
  };

  const days = weeklyPlan || [];

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6" style={{ fontFamily: BRAND.font }}>
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-white font-extrabold text-2xl tracking-tight flex items-center gap-2">
            <Calendar className="text-orange" size={24} />
            Command Center: Weekly Content Calendar
          </h1>
          <p className="text-white/40 text-sm mt-1">
            7-Day campaign overview. Copy topics to transform them or click "Generate" to build assets.
          </p>
        </div>
        
        {/* Navigation back to AI Research */}
        <button
          onClick={() => setActiveTab('viral')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 hover:border-orange/30 text-white/60 hover:text-orange bg-white/3 transition-all duration-200"
        >
          <RefreshCw size={13} />
          Go to AI Research for Trends
        </button>
      </div>

      {/* Calendar Grid List */}
      <div className="space-y-4">
        {days.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-white/5">
            <AlertTriangle className="text-white/20 mx-auto mb-4" size={40} />
            <p className="text-white/40 text-sm">Generating your weekly planner...</p>
          </div>
        ) : (
          days.map((day, idx) => {
            const isCopied = copiedDay === idx;
            const examColor = day.exam === 'IELTS' ? BRAND.gold : BRAND.teal;
            const formatColor = day.format === 'carousel' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' : 'text-orange border-orange/20 bg-orange/5';

            return (
              <motion.div
                key={day.dayIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-2xl border border-white/5 hover:border-white/12 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200"
                style={{ background: BRAND.bgCard }}
              >
                {/* Day Badge & Schedule */}
                <div className="flex items-center gap-3.5 flex-shrink-0">
                  <div 
                    className="w-16 text-center rounded-xl p-2.5 border"
                    style={{ 
                      borderColor: `${examColor}30`, 
                      background: `${examColor}08` 
                    }}
                  >
                    <div className="text-xs font-black tracking-wider" style={{ color: examColor }}>
                      {day.shortDay}
                    </div>
                    <div className="text-[10px] text-white/30 mt-1 font-mono">{day.postTime}</div>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-col gap-1.5">
                    <span 
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold border text-center"
                      style={{ color: examColor, borderColor: `${examColor}25`, background: `${examColor}10` }}
                    >
                      {day.exam}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border text-center uppercase tracking-wider ${formatColor}`}>
                      {day.format}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0 space-y-1 md:pr-4">
                  <div className="text-white/30 text-[10px] uppercase tracking-wider font-semibold">
                    Topic: {day.category}
                  </div>
                  <h3 className="text-white font-bold text-sm leading-tight truncate-2-lines">
                    {day.topic}
                  </h3>
                  <p className="text-orange/90 text-xs italic font-medium leading-relaxed">
                    "{day.hook}"
                  </p>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  
                  {/* Copy Topic Button */}
                  <button
                    onClick={() => handleCopy(day.topic, idx, 'idea')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-white/8 hover:border-white/15 text-white/50 hover:text-white bg-white/3 transition-all"
                  >
                    {isCopied && copiedType === 'idea' ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Idea</span>
                      </>
                    )}
                  </button>

                  {/* Copy Hook Button */}
                  <button
                    onClick={() => handleCopy(day.hook, idx, 'hook')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-white/8 hover:border-white/15 text-white/50 hover:text-white bg-white/3 transition-all"
                  >
                    {isCopied && copiedType === 'hook' ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Hook</span>
                      </>
                    )}
                  </button>

                  {/* Send to Generator Button */}
                  <button
                    onClick={() => handleSendToGenerator(day)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange hover:bg-orange-dim text-white shadow-lg transition-colors flex-shrink-0 ml-auto md:ml-0"
                  >
                    <span>Generate Asset</span>
                    <ArrowRight size={12} />
                  </button>

                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Posting Best Practices Quick Reference */}
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-3" style={{ background: BRAND.bgCard2 }}>
        <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={12} className="text-orange" />
          Optimal Posting Best Practices
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-white/70 font-semibold block">Morning Slot (7:00 AM):</span>
            <span className="text-white/40 block mt-0.5">Target: Students prep before class. Focus: High-impact hooks.</span>
          </div>
          <div>
            <span className="text-white/70 font-semibold block">Lunch Slot (12:00 PM):</span>
            <span className="text-white/40 block mt-0.5">Target: Casual browse. Focus: Short infographics/carousels.</span>
          </div>
          <div>
            <span className="text-white/70 font-semibold block">Evening Slot (6:00 PM):</span>
            <span className="text-white/40 block mt-0.5">Target: Intensive studying. Focus: Full carousel fixes/deep-dives.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
