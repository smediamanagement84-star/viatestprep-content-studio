// ─────────────────────────────────────────────────────────────────────────────
//  ViAtestprep Content Studio — Asset Generator
//  src/components/Generator.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, Film, Zap, Copy, Download, ChevronRight,
  Check, Sparkles, Eye, Code2, LayoutList,
} from 'lucide-react';
import {
  CONTENT_LIBRARY,
  generateCarouselScript,
  generateAnimationData,
  generateJSXCode,
} from '../lib/contentLogic.jsx';

// ─── Helpers ────────────────────────────────────────────────────

function copyToClipboard(text, setCopied) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }).catch(() => {
    // Clipboard access denied — show temporary error state
    setCopied(false);
  });
}

function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Mode toggle ────────────────────────────────────────────────

function ModeToggle({ mode, onChange }) {
  const modes = [
    { id: 'script',    label: 'Script Writer',       icon: LayoutList, sub: 'Mode A — Carousel' },
    { id: 'animation', label: 'Animation Compiler',  icon: Film,       sub: 'Mode B — Reel' },
  ];

  return (
    <div className="flex gap-3 p-1 bg-obsidian-mid rounded-2xl">
      {modes.map(({ id, label, icon: Icon, sub }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            ${mode === id
              ? 'bg-orange text-white shadow-lg'
              : 'text-white/40 hover:text-white/60 hover:bg-white/3'}
          `}
        >
          <Icon size={16} className="flex-shrink-0" />
          <div className="text-left">
            <p className={`text-sm font-semibold leading-tight ${mode === id ? 'text-white' : ''}`}>
              {label}
            </p>
            <p className={`text-xs ${mode === id ? 'text-orange-100/70' : 'text-white/30'}`}>
              {sub}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Slide card (carousel output) ──────────────────────────────

function SlideCard({ slide, index }) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass rounded-xl border border-white/6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-orange/15 border border-orange/25 flex items-center justify-center">
            <span className="text-orange text-xs font-bold">{slide.slide}</span>
          </div>
          <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
            {slide.label}
          </span>
        </div>
        <button
          onClick={() => copyToClipboard(slide.copy, setCopied)}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-orange transition-colors py-1 px-2 rounded-lg hover:bg-orange/5"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Visual instruction */}
        <div>
          <p className="text-xs text-white/25 uppercase tracking-widest mb-1.5">
            Visual Design
          </p>
          <p className="text-white/60 text-xs leading-relaxed border-l-2 border-orange/30 pl-3">
            {slide.visual}
          </p>
        </div>

        {/* Copy */}
        <div>
          <p className="text-xs text-white/25 uppercase tracking-widest mb-1.5">Copy</p>
          <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-sans bg-obsidian-mid/60 rounded-lg p-3 border border-white/5">
            {slide.copy}
          </pre>
        </div>

        {/* Psychological logic */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-orange/4 border border-orange/10">
          <Sparkles size={12} className="text-orange mt-0.5 flex-shrink-0" />
          <p className="text-white/55 text-xs leading-relaxed">
            <span className="text-orange/80 font-semibold">Psychology: </span>
            {slide.logic}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Script Writer (Mode A) ─────────────────────────────────────

function ScriptWriter({ onScriptGenerated, prefilledAsset, setPrefilledAsset }) {
  const [topic,     setTopic]     = useState('');
  const [angle,     setAngle]     = useState('');
  const [nicheKey,  setNicheKey]  = useState('writing');
  const [slides,    setSlides]    = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (prefilledAsset && prefilledAsset.format !== 'reel') {
      setTopic(prefilledAsset.topic || '');
      setAngle(prefilledAsset.angle || prefilledAsset.hook || '');
      
      const nicheMap = {
        'vocabulary': 'vocabulary', 'vocabulary & word choice': 'vocabulary',
        'speaking': 'speaking', 'speaking fluency': 'speaking',
        'writing': 'writing', 'writing task 2': 'writing',
        'listening': 'listening', 'listening accuracy': 'listening',
        'timemanagement': 'timeManagement', 'time management': 'timeManagement',
        'mindset': 'mindset', 'test psychology': 'mindset',
        'taskachievement': 'taskAchievement', 'task achievement (writing)': 'taskAchievement'
      };
      const key = prefilledAsset.category?.toLowerCase() || '';
      setNicheKey(nicheMap[key] || 'writing');
      
      // Clear the prefilledAsset so it doesn't loop
      setPrefilledAsset(null);
    }
  }, [prefilledAsset, setPrefilledAsset]);

  const niches = Object.values(CONTENT_LIBRARY);

  function handleGenerate() {
    if (!topic.trim()) return;
    const result = generateCarouselScript(topic.trim(), angle.trim(), nicheKey);
    setSlides(result);
    onScriptGenerated?.(result);
  }

  function exportMarkdown() {
    if (!slides) return;
    const md = slides.map(s =>
      `## Slide ${s.slide} — ${s.label}\n\n**Visual:** ${s.visual}\n\n**Copy:**\n${s.copy}\n\n**Psychology:** ${s.logic}\n`,
    ).join('\n---\n\n');
    downloadTextFile(md, `carousel-script-${Date.now()}.md`);
  }

  function copyAllSlides() {
    if (!slides) return;
    const text = slides.map(s => `SLIDE ${s.slide} [${s.label}]\n${s.copy}`).join('\n\n────\n\n');
    copyToClipboard(text, setCopiedAll);
  }

  return (
    <div className="space-y-5">
      {/* ── Input form ─────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-2 mb-5">
          <Layout size={16} className="text-orange" />
          <h3 className="text-white font-semibold text-sm">Carousel Blueprint Generator</h3>
          <span className="ml-auto text-xs text-white/25 bg-white/4 px-2 py-0.5 rounded-full">
            6 Slides
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Topic */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              Topic / Subject *
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. IELTS Writing Task 2 cohesion errors"
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange/50 transition-all"
            />
          </div>

          {/* Paradox angle */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              Paradox Angle (optional)
            </label>
            <input
              type="text"
              value={angle}
              onChange={e => setAngle(e.target.value)}
              placeholder="e.g. Why perfect essays score Band 6"
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange/50 transition-all"
            />
          </div>

          {/* Niche selector */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              IELTS Niche
            </label>
            <select
              value={nicheKey}
              onChange={e => setNicheKey(e.target.value)}
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange/50 transition-all appearance-none cursor-pointer"
            >
              {niches.map(n => (
                <option key={n.id} value={n.id}>
                  {n.emoji}  {n.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="
              flex items-center justify-center gap-2 py-3.5 rounded-xl
              bg-orange text-white font-bold text-sm
              hover:bg-orange-dim transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <Zap size={16} />
            Generate 6-Slide Blueprint
          </button>
        </div>
      </div>

      {/* ── Output ─────────────────────────────────────── */}
      <AnimatePresence>
        {slides && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Action bar */}
            <div className="flex items-center justify-between">
              <p className="text-white/40 text-xs">
                <span className="text-orange font-semibold">6 slides</span> generated — copy or export
              </p>
              <div className="flex gap-2">
                <button
                  onClick={copyAllSlides}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-orange px-3 py-1.5 rounded-lg border border-white/8 hover:border-orange/30 transition-all"
                >
                  {copiedAll ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copiedAll ? 'Copied!' : 'Copy All'}
                </button>
                <button
                  onClick={exportMarkdown}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-orange px-3 py-1.5 rounded-lg border border-white/8 hover:border-orange/30 transition-all"
                >
                  <Download size={12} />
                  Export .md
                </button>
              </div>
            </div>

            {/* Slide cards */}
            {slides.map((slide, i) => (
              <SlideCard key={slide.slide} slide={slide} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Animation Compiler (Mode B) ────────────────────────────────

function AnimationCompiler({ onAnimationGenerated, prefilledAsset, setPrefilledAsset, weeklyPlan }) {
  const [topic,     setTopic]     = useState('');
  const [hook,      setHook]      = useState('');
  const [nicheKey,  setNicheKey]  = useState('writing');
  const [animData,  setAnimData]  = useState(null);
  const [jsxCode,   setJsxCode]   = useState('');
  const [codeView,  setCodeView]  = useState(false);
  const [copied,    setCopied]    = useState(false);

  useEffect(() => {
    if (prefilledAsset && prefilledAsset.format === 'reel') {
      setTopic(prefilledAsset.topic || '');
      setHook(prefilledAsset.angle || prefilledAsset.hook || '');
      
      const nicheMap = {
        'vocabulary': 'vocabulary', 'vocabulary & word choice': 'vocabulary',
        'speaking': 'speaking', 'speaking fluency': 'speaking',
        'writing': 'writing', 'writing task 2': 'writing',
        'listening': 'listening', 'listening accuracy': 'listening',
        'timemanagement': 'timeManagement', 'time management': 'timeManagement',
        'mindset': 'mindset', 'test psychology': 'mindset',
        'taskachievement': 'taskAchievement', 'task achievement (writing)': 'taskAchievement'
      };
      const key = prefilledAsset.category?.toLowerCase() || '';
      setNicheKey(nicheMap[key] || 'writing');
      
      // Clear prefilledAsset
      setPrefilledAsset(null);
    }
  }, [prefilledAsset, setPrefilledAsset]);

  const niches = Object.values(CONTENT_LIBRARY);

  function handleGenerate() {
    if (!topic.trim()) return;
    const data = generateAnimationData(topic.trim(), hook.trim(), nicheKey);
    const code = generateJSXCode(data);
    setAnimData(data);
    setJsxCode(code);
    onAnimationGenerated?.(data);
  }

  function downloadJSX() {
    downloadTextFile(jsxCode, `ViAReelAnimation-${Date.now()}.jsx`);
  }

  return (
    <div className="space-y-5">
      {/* ── Input form ─────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-2 mb-5">
          <Film size={16} className="text-orange" />
          <h3 className="text-white font-semibold text-sm">Reel Animation Compiler</h3>
          <span className="ml-auto text-xs text-white/25 bg-white/4 px-2 py-0.5 rounded-full">
            6 Scenes + Loop
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Suggested Topics */}
          {weeklyPlan && weeklyPlan.length > 0 && (
            <div className="border-b border-white/5 pb-4">
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block font-semibold">
                Suggested Topics from Weekly Research
              </label>
              <div className="flex flex-wrap gap-2">
                {weeklyPlan.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(day.topic);
                      setHook(day.hook);
                      
                      const nicheMap = {
                        'vocabulary': 'vocabulary', 'vocabulary & word choice': 'vocabulary',
                        'speaking': 'speaking', 'speaking fluency': 'speaking',
                        'writing': 'writing', 'writing task 2': 'writing',
                        'listening': 'listening', 'listening accuracy': 'listening',
                        'timemanagement': 'timeManagement', 'time management': 'timeManagement',
                        'mindset': 'mindset', 'test psychology': 'mindset',
                        'taskachievement': 'taskAchievement', 'task achievement (writing)': 'taskAchievement'
                      };
                      const key = day.category?.toLowerCase() || '';
                      setNicheKey(nicheMap[key] || 'writing');
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-left text-xs bg-white/4 hover:bg-orange/15 border border-white/6 hover:border-orange/20 text-white/70 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <span className="text-[9px] font-black text-orange uppercase tracking-wider">{day.shortDay}</span>
                    <span className="truncate max-w-[160px]">{day.topic}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              Topic *
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. IELTS Speaking fluency"
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange/50 transition-all"
            />
          </div>

          {/* Custom hook */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              Custom Hook Line (optional)
            </label>
            <input
              type="text"
              value={hook}
              onChange={e => setHook(e.target.value)}
              placeholder="e.g. Your examiner knows you're faking fluency."
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange/50 transition-all"
            />
          </div>

          {/* Niche */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              IELTS Niche
            </label>
            <select
              value={nicheKey}
              onChange={e => setNicheKey(e.target.value)}
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange/50 transition-all appearance-none cursor-pointer"
            >
              {niches.map(n => (
                <option key={n.id} value={n.id}>
                  {n.emoji}  {n.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="
              flex items-center justify-center gap-2 py-3.5 rounded-xl
              bg-orange text-white font-bold text-sm
              hover:bg-orange-dim transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <Film size={16} />
            Compile Animation
          </button>
        </div>
      </div>

      {/* ── Output ─────────────────────────────────────── */}
      <AnimatePresence>
        {animData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Success banner */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange/8 border border-orange/20">
              <div className="w-8 h-8 rounded-full bg-orange/15 flex items-center justify-center flex-shrink-0">
                <Check size={15} className="text-orange" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Animation compiled</p>
                <p className="text-white/40 text-xs">
                  {animData.scenes.length} scenes · seamless loop · 9:16 format
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => onAnimationGenerated?.(animData)}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-orange px-3 py-1.5 rounded-lg border border-white/8 hover:border-orange/30 transition-all"
                >
                  <Eye size={12} />
                  Preview
                </button>
                <button
                  onClick={downloadJSX}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-orange px-3 py-1.5 rounded-lg border border-white/8 hover:border-orange/30 transition-all"
                >
                  <Download size={12} />
                  .jsx
                </button>
              </div>
            </div>

            {/* Scene overview */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white/60 text-xs uppercase tracking-widest">
                  Scene Overview
                </h4>
                <button
                  onClick={() => setCodeView(!codeView)}
                  className="flex items-center gap-1.5 text-xs text-white/30 hover:text-orange transition-colors"
                >
                  <Code2 size={12} />
                  {codeView ? 'Hide code' : 'View JSX'}
                </button>
              </div>

              {!codeView ? (
                <div className="space-y-2">
                  {animData.scenes.map((scene, i) => (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-obsidian-mid flex items-center justify-center">
                        <span className="text-orange text-xs font-bold">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-orange/70 text-xs font-semibold uppercase tracking-widest">
                            {scene.label}
                          </span>
                          {i === animData.scenes.length - 1 && (
                            <span className="text-xs text-white/25 bg-white/4 px-1.5 py-0.5 rounded-full">
                              → loops to scene 1
                            </span>
                          )}
                        </div>
                        <p className="text-white/55 text-xs leading-relaxed truncate">
                          {scene.lines.join(' / ')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(jsxCode, setCopied)}
                    className="absolute top-2 right-2 flex items-center gap-1.5 text-xs text-white/30 hover:text-orange px-2 py-1 rounded border border-white/10 hover:border-orange/30 bg-obsidian transition-all z-10"
                  >
                    {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <pre className="bg-obsidian rounded-xl p-4 border border-white/8 text-xs text-green-300/80 overflow-x-auto max-h-72 leading-relaxed">
                    {jsxCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Seamless loop explanation */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/2 border border-white/6">
              <ChevronRight size={14} className="text-orange mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white/70 text-xs font-semibold mb-1">Seamless Loop Architecture</p>
                <p className="text-white/35 text-xs leading-relaxed">
                  Scene 6 ends with{' '}
                  <span className="text-orange/70 italic">
                    "{animData.scenes[animData.scenes.length - 1]?.lines.at(-2)}"
                  </span>{' '}
                  which grammatically bridges back to the opening hook, sustaining watch-time on the loop.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Generator component ────────────────────────────────────

export default function Generator({ onAnimationGenerated, onScriptGenerated, prefilledAsset, setPrefilledAsset, weeklyPlan }) {
  const [mode, setMode] = useState('script');

  useEffect(() => {
    if (prefilledAsset) {
      if (prefilledAsset.format === 'reel') {
        setMode('animation');
      } else {
        setMode('script');
      }
    }
  }, [prefilledAsset]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-xl">Asset Generator</h2>
        <p className="text-white/35 text-sm mt-1">
          Production engine — choose your output format below
        </p>
      </div>

      {/* Mode toggle */}
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Mode content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {mode === 'script' ? (
            <ScriptWriter 
              onScriptGenerated={onScriptGenerated} 
              prefilledAsset={prefilledAsset} 
              setPrefilledAsset={setPrefilledAsset} 
            />
          ) : (
            <AnimationCompiler 
              onAnimationGenerated={onAnimationGenerated} 
              prefilledAsset={prefilledAsset} 
              setPrefilledAsset={setPrefilledAsset}
              weeklyPlan={weeklyPlan}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
