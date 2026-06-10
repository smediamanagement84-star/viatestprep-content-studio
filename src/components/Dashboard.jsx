import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Copy, Check, Zap, Download,
  ChevronDown, ChevronUp, TrendingUp, Lightbulb,
  RefreshCw, AlertTriangle, Film, Layout,
} from 'lucide-react';
import { runWeeklyResearch, generateContentPlan, generateCarouselData, generateInfographicData } from '../lib/researchEngine.js';
import { generateCarouselScript, generateAnimationData, generateJSXCode } from '../lib/contentLogic.jsx';
import { BRAND } from '../lib/brandTokens.js';
import html2canvas from 'html2canvas';
import CarouselPreview from './CarouselPreview.jsx';
import InfographicPreview from './InfographicPreview.jsx';

// ─── tiny helpers ────────────────────────────────────────────────────────────
function copyText(text, setFlag) {
  navigator.clipboard.writeText(text).then(() => {
    setFlag(true); setTimeout(() => setFlag(false), 2000);
  }).catch(() => {});
}

function downloadBlob(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ─── Niche map helper ────────────────────────────────────────────────────────
function toNicheKey(category = '') {
  const map = {
    'vocabulary': 'vocabulary', 'vocabulary & word choice': 'vocabulary',
    'speaking': 'speaking',   'speaking fluency': 'speaking',
    'writing': 'writing',     'writing task 2': 'writing',
    'listening': 'listening', 'listening accuracy': 'listening',
    'timemanagement': 'timeManagement', 'time management': 'timeManagement',
    'mindset': 'mindset',     'test psychology': 'mindset',
    'taskachievement': 'taskAchievement', 'task achievement (writing)': 'taskAchievement',
  };
  return map[category.toLowerCase()] || 'writing';
}

// ─── Inline Carousel Slide (minimal read-only card) ─────────────────────────
function SlideCard({ slide, examColor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          background: `${examColor}20`, border: `1px solid ${examColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 900, color: examColor,
        }}>{slide.slide}</div>
        <span style={{ fontSize: 9, fontWeight: 800, color: examColor, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          {slide.label}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {slide.copy}
      </p>
      {slide.visual && (
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4, margin: '8px 0 0', fontStyle: 'italic' }}>
          Visual: {slide.visual}
        </p>
      )}
    </div>
  );
}

// ─── Inline Reel Scene ───────────────────────────────────────────────────────
function SceneCard({ scene, i, examColor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, padding: '12px 14px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: `${examColor}20`, border: `1px solid ${examColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 900, color: examColor,
      }}>{i + 1}</div>
      <div>
        <span style={{ fontSize: 9, fontWeight: 800, color: examColor, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: 4 }}>
          {scene.label}
        </span>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}>
          {scene.lines.join(' / ')}
        </p>
      </div>
    </div>
  );
}

// ─── Content Generator Panel (opens per day card) ───────────────────────────
function ContentPanel({ day, onClose }) {
  const examColor = day.exam === 'IELTS' ? BRAND.gold : BRAND.teal;
  const currentFormat = day.format;
  const isReel    = currentFormat === 'reel';
  const nicheKey  = toNicheKey(day.category);

  const [generated, setGenerated] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [copied,    setCopied]    = useState(false);

  function handleGenerate() {
    setLoading(true);
    setTimeout(() => {
      if (isReel) {
        const data = generateAnimationData(day.topic, day.hook || '', nicheKey);
        setGenerated({ type: 'reel', data });
      } else if (currentFormat === 'infographic') {
        const visualData = generateInfographicData(day);
        setGenerated({ type: 'infographic', data: visualData });
      } else {
        const slides = generateCarouselScript(day.topic, day.hook || '', nicheKey);
        const visualData = generateCarouselData(day);
        setGenerated({ type: 'carousel', slides, visualData });
      }
      setLoading(false);
    }, 600);
  }

  function handleDownload() {
    if (!generated) return;
    if (generated.type === 'carousel') {
      const text = generated.slides.map(s =>
        `SLIDE ${s.slide} [${s.label}]\n${s.copy}\n\nVisual: ${s.visual}\nPsychology: ${s.logic}`
      ).join('\n\n────────\n\n');
      downloadBlob(`CAROUSEL: ${day.topic}\n${'─'.repeat(40)}\n\n${text}`, `carousel-${day.shortDay}.txt`);
    } else if (generated.type === 'infographic') {
      const text = `INFOGRAPHIC: ${day.topic}\n${'─'.repeat(40)}\n\nHeadline: ${generated.data.headline}\nInsight: ${generated.data.insight}\nStat: ${generated.data.stat}\nFix: ${generated.data.fix}`;
      downloadBlob(text, `infographic-${day.shortDay}.txt`);
    } else {
      const scenes = generated.data.scenes.map((s, i) =>
        `SCENE ${i + 1}: ${s.label}\n${s.lines.join('\n')}`
      ).join('\n\n────────\n\n');
      const jsxCode = generateJSXCode(generated.data);
      downloadBlob(
        `REEL: ${day.topic}\n${'─'.repeat(40)}\n\n${scenes}\n\n${'─'.repeat(40)}\nJSX CODE:\n\n${jsxCode}`,
        `reel-${day.shortDay}.txt`
      );
    }
  }

  function handleCopyAll() {
    if (!generated) return;
    let text = '';
    if (generated.type === 'carousel') {
      text = generated.slides.map(s => `SLIDE ${s.slide}: ${s.copy}`).join('\n\n');
    } else if (generated.type === 'infographic') {
      text = `Headline: ${generated.data.headline}\nInsight: ${generated.data.insight}\nStat: ${generated.data.stat}\nFix: ${generated.data.fix}`;
    } else {
      text = generated.data.scenes.map((s, i) => `Scene ${i + 1} [${s.label}]: ${s.lines.join(' | ')}`).join('\n');
    }
    copyText(text, setCopied);
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
      <div style={{
        margin: '0 0 0 0',
        padding: '20px',
        background: 'rgba(8,22,43,0.95)',
        border: `1px solid ${examColor}25`,
        borderTop: 'none',
        borderRadius: '0 0 18px 18px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          {isReel ? <Film size={14} color={examColor} /> : <Layout size={14} color={examColor} />}
          <span style={{ fontSize: 11, fontWeight: 800, color: examColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isReel ? 'Reel Script Generator' : currentFormat === 'infographic' ? 'Infographic Asset Generator' : 'Carousel Asset Generator'}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
            {day.topic.slice(0, 40)}{day.topic.length > 40 ? '...' : ''}
          </span>
        </div>

        {!generated ? (
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: 12,
              background: `linear-gradient(135deg, ${examColor}, ${examColor}90)`,
              border: 'none', color: '#08162b', fontSize: 13, fontWeight: 800,
              cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              boxShadow: `0 4px 20px ${examColor}30`,
            }}
          >
            {loading
              ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
              : <><Zap size={14} /> Generate {isReel ? 'Reel Script' : currentFormat === 'infographic' ? 'Infographic' : 'Carousel Slides'}</>
            }
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Action bar */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCopyAll}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 10,
                  background: copied ? 'rgba(0,173,181,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${copied ? 'rgba(0,173,181,0.35)' : 'rgba(255,255,255,0.1)'}`,
                  color: copied ? '#00adb5' : 'rgba(255,255,255,0.6)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Text Data'}
              </button>
              <button
                onClick={handleDownload}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 10,
                  background: `linear-gradient(135deg, ${examColor}, ${examColor}88)`,
                  border: 'none', color: '#08162b',
                  fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: `0 3px 14px ${examColor}30`,
                }}
              >
                <Download size={13} />
                Download Script .txt
              </button>
              <button
                onClick={() => setGenerated(null)}
                style={{
                  padding: '9px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Redo
              </button>
            </div>

            {/* Content Preview */}
            <div style={{ marginTop: 12 }}>
              {generated.type === 'carousel' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, justifyItems: 'center' }}>
                  {/* Visual Preview */}
                  <div style={{ width: '100%', maxWidth: 420 }}>
                    <CarouselPreview data={generated.visualData} examColor={examColor} />
                  </div>
                  {/* Detailed Slide Content */}
                  <div style={{ width: '100%', maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 4 }}>
                      Slide Text Blueprints
                    </span>
                    {generated.slides.map((s, i) => <SlideCard key={i} slide={s} examColor={examColor} />)}
                  </div>
                </div>
              )}

              {generated.type === 'infographic' && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <InfographicPreview data={generated.data} examColor={examColor} />
                </div>
              )}

              {generated.type === 'reel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto' }}>
                  {generated.data.scenes.map((s, i) => <SceneCard key={i} scene={s} i={i} examColor={examColor} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard({ weeklyPlan, setWeeklyPlan, setActiveTab }) {
  const [copiedDay,  setCopiedDay]  = useState(null);
  const [copiedType, setCopiedType] = useState(null);
  const [openPanel,  setOpenPanel]  = useState(null); // dayIndex with open generator


  const handleCopy = (text, dayIndex, type) => {
    copyText(text, (val) => {
      if (val) { setCopiedDay(dayIndex); setCopiedType(type); }
      else { setCopiedDay(null); setCopiedType(null); }
    });
  };

  const days = weeklyPlan || [];

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-5" style={{ fontFamily: BRAND.font }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-white font-extrabold text-2xl tracking-tight flex items-center gap-2">
            <Calendar className="text-orange" size={22} />
            Weekly Content Planner
          </h1>
          <p className="text-white/35 text-sm mt-1">
            7-day plan from AI research. Click <span className="text-orange font-semibold">Generate Content</span> to build & download any post.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('viral')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 hover:border-orange/30 text-white/50 hover:text-orange bg-white/3 transition-all"
        >
          <Zap size={12} />
          Run AI Research
        </button>
      </div>

      {/* ── Quick stats ─────────────────────────────────────────── */}
      {days.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Posts This Week', value: days.length, color: BRAND.gold },
            { label: 'Carousels', value: days.filter(d => d.format !== 'reel').length, color: '#60a5fa' },
            { label: 'Reels', value: days.filter(d => d.format === 'reel').length, color: BRAND.teal },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4 border border-white/5 text-center" style={{ background: BRAND.bgCard }}>
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-white/35 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Day Cards ───────────────────────────────────────────── */}
      <div className="space-y-3">
        {days.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-white/5">
            <AlertTriangle className="text-white/20 mx-auto mb-4" size={36} />
            <p className="text-white/40 text-sm">No plan yet — go to AI Research to generate one.</p>
            <button
              onClick={() => setActiveTab('viral')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-orange text-white text-xs font-bold hover:bg-orange-dim transition-colors"
            >
              Go to AI Research →
            </button>
          </div>
        ) : (
          days.map((day, idx) => {
            const examColor  = day.exam === 'IELTS' ? BRAND.gold : BRAND.teal;
            const isReel     = day.format === 'reel';
            const isOpen     = openPanel === idx;
            const isCopied   = copiedDay === idx;

            return (
              <div key={day.dayIndex}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="glass border border-white/6 hover:border-white/12 transition-all duration-200"
                  style={{
                    background: BRAND.bgCard,
                    borderRadius: isOpen ? '18px 18px 0 0' : 18,
                    padding: '16px 20px',
                  }}
                >
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

                    {/* Day badge */}
                    <div className="flex-shrink-0 text-center rounded-xl p-2.5 border w-14" style={{ borderColor: `${examColor}30`, background: `${examColor}08` }}>
                      <div className="text-xs font-black tracking-wider" style={{ color: examColor }}>{day.shortDay}</div>
                      <div className="text-[9px] text-white/30 mt-0.5 font-mono">{day.postTime}</div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <span className="text-[9px] px-2 py-1 rounded-full font-bold border" style={{ color: examColor, borderColor: `${examColor}25`, background: `${examColor}10` }}>
                        {day.exam}
                      </span>
                      <span className={`text-[9px] px-2 py-1 rounded-full font-bold border uppercase tracking-wider ${isReel ? 'text-orange border-orange/20 bg-orange/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'}`}>
                        {isReel ? '🎬 Reel' : '📱 Carousel'}
                      </span>
                    </div>

                    {/* Content info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">{day.category}</div>
                      <h3 className="text-white font-bold text-sm leading-snug" style={{ overflowWrap: 'break-word' }}>{day.topic}</h3>
                      <p className="text-orange/80 text-xs italic mt-0.5 leading-relaxed" style={{ overflowWrap: 'break-word' }}>"{day.hook}"</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleCopy(day.hook, idx, 'hook')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold border border-white/8 hover:border-white/15 text-white/40 hover:text-white bg-white/3 transition-all"
                      >
                        {isCopied && copiedType === 'hook' ? <><Check size={11} className="text-green-400" /><span className="text-green-400">Copied</span></> : <><Copy size={11} />Hook</>}
                      </button>
                      <button
                        onClick={() => handleCopy(day.topic, idx, 'idea')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold border border-white/8 hover:border-white/15 text-white/40 hover:text-white bg-white/3 transition-all"
                      >
                        {isCopied && copiedType === 'idea' ? <><Check size={11} className="text-green-400" /><span className="text-green-400">Copied</span></> : <><Copy size={11} />Topic</>}
                      </button>

                      {/* ★ THE MAIN BUTTON */}
                      <button
                        onClick={() => setOpenPanel(isOpen ? null : idx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '8px 14px', borderRadius: 10,
                          background: isOpen ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${examColor}, ${examColor}90)`,
                          border: 'none',
                          color: isOpen ? 'rgba(255,255,255,0.6)' : '#08162b',
                          fontSize: 12, fontWeight: 800, cursor: 'pointer',
                          boxShadow: isOpen ? 'none' : `0 4px 16px ${examColor}30`,
                          transition: 'all 0.2s',
                        }}
                      >
                        <Zap size={13} />
                        {isOpen ? 'Close' : 'Generate Content'}
                        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Inline generator panel */}
                <AnimatePresence>
                  {isOpen && <ContentPanel day={day} onClose={() => setOpenPanel(null)} />}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* ── Posting Tips ──────────────────────────────────────────── */}
      {days.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3" style={{ background: BRAND.bgCard2 }}>
          <h4 className="text-white/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={11} className="text-orange" />
            Best Posting Times
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {[
              { slot: '7:00 AM', tip: 'Students prepping before class. Use high-impact hooks.' },
              { slot: '12:00 PM', tip: 'Casual browse. Short carousels & infographics work best.' },
              { slot: '6:00 PM', tip: 'Deep study session. Full carousel fixes & breakdowns.' },
            ].map(t => (
              <div key={t.slot}>
                <span className="text-white/60 font-semibold block">{t.slot}</span>
                <span className="text-white/30 block mt-0.5 leading-relaxed">{t.tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
