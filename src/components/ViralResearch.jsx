// ─────────────────────────────────────────────────────────────────────────────
//  ViAtestprep Content Studio — Viral Research Studio + Film Brief Generator
//  src/components/ViralResearch.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Flame, Clapperboard, Copy, Download,
  Check, ChevronDown, Camera, Mic, Lightbulb, Hash,
  BookOpen, Play, Zap, FileText, Eye,
} from 'lucide-react';
import {
  HOOK_FORMULAS,
  VIRAL_FORMATS,
  TRENDING_ANGLES,
  FILMING_SETUPS,
  CONTENT_LIBRARY,
  generateFilmBrief,
} from '../lib/contentLogic.jsx';

// ─── Helpers ────────────────────────────────────────────────────

function copyText(text, setCopied) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }).catch(() => {
    setCopied(false);
  });
}

function downloadMD(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const MOMENTUM_COLOR = {
  'HIGH':        'text-orange border-orange/30 bg-orange/5',
  'MEDIUM-HIGH': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  'MEDIUM':      'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'VERY HIGH':   'text-green-400 border-green-400/30 bg-green-400/5',
};

// ─── Section header ─────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle, count }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center">
        <Icon size={17} className="text-orange" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-semibold text-sm leading-tight">{title}</h2>
          {count !== undefined && (
            <span className="text-xs text-white/25 bg-white/4 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="text-white/35 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Trend Intelligence Panel ────────────────────────────────────

function TrendPanel() {
  const [activeAngleTab,  setActiveAngleTab]  = useState('angles');
  const [expandedHook,    setExpandedHook]    = useState(null);
  const [expandedFormat,  setExpandedFormat]  = useState(null);

  return (
    <div className="space-y-5">

      {/* ── Trending angles ──────────────────────────────── */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <SectionHeader
          icon={TrendingUp}
          title="Trending Angles"
          subtitle="High-momentum content angles in the IELTS niche right now"
          count={TRENDING_ANGLES.length}
        />

        <div className="space-y-2.5">
          {TRENDING_ANGLES.map((item, i) => (
            <motion.div
              key={item.angle}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3.5 rounded-xl bg-obsidian-mid/50 border border-white/4 hover:border-orange/15 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <p className="text-white text-sm font-semibold leading-tight flex-1">
                  {item.angle}
                </p>
                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${MOMENTUM_COLOR[item.momentum] || MOMENTUM_COLOR['MEDIUM']}`}>
                  {item.momentum}
                </span>
              </div>
              <p className="text-orange/80 text-xs italic mb-2">"{item.hook}"</p>
              <p className="text-white/40 text-xs leading-relaxed">{item.reason}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {item.nichefit.map(n => (
                  <span key={n} className="text-xs text-white/25 bg-white/4 px-2 py-0.5 rounded-full">
                    {n}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Hook formulas ────────────────────────────────── */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <SectionHeader
          icon={Flame}
          title="Hook Formula Library"
          subtitle="7 proven opening structures — ranked by avg retention"
          count={HOOK_FORMULAS.length}
        />

        <div className="space-y-2">
          {[...HOOK_FORMULAS].sort((a, b) => b.avgRetention - a.avgRetention).map((hook) => (
            <div key={hook.id}>
              <button
                onClick={() => setExpandedHook(expandedHook === hook.id ? null : hook.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-obsidian-mid/40 border border-white/4 hover:border-orange/20 transition-colors text-left"
              >
                {/* Retention bar */}
                <div className="flex-shrink-0 w-10 text-center">
                  <span className="text-orange font-bold text-sm">{hook.avgRetention}%</span>
                  <p className="text-white/20 text-xs">retain</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{hook.label}</p>
                  <p className="text-white/40 text-xs truncate">{hook.template}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-white/25 flex-shrink-0 transition-transform ${expandedHook === hook.id ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {expandedHook === hook.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 mx-1 mb-1 rounded-b-xl bg-obsidian-mid/30 border border-t-0 border-white/4 space-y-2">
                      <div>
                        <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Template</p>
                        <p className="text-white/70 text-xs font-mono bg-obsidian rounded-lg p-2 border border-white/6">
                          {hook.template}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Live Example</p>
                        <p className="text-orange/80 text-xs italic">"{hook.example}"</p>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-orange/4 border border-orange/10">
                        <Lightbulb size={11} className="text-orange mt-0.5 flex-shrink-0" />
                        <p className="text-white/55 text-xs leading-relaxed">{hook.why}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── Format benchmarks ────────────────────────────── */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <SectionHeader
          icon={Play}
          title="Format Performance Benchmarks"
          subtitle="Loop rate data across Reels / TikTok for IELTS content"
          count={VIRAL_FORMATS.length}
        />

        <div className="space-y-2">
          {[...VIRAL_FORMATS].sort((a, b) => {
            const numA = parseInt(a.retention);
            const numB = parseInt(b.retention);
            return numB - numA;
          }).map((fmt) => (
            <div key={fmt.id}>
              <button
                onClick={() => setExpandedFormat(expandedFormat === fmt.id ? null : fmt.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-obsidian-mid/40 border border-white/4 hover:border-orange/20 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 text-center">
                  <span className="text-orange font-bold text-sm">
                    {fmt.retention.split(' ')[0]}
                  </span>
                  <p className="text-white/20 text-xs">loop</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{fmt.label}</p>
                  <p className="text-white/35 text-xs">{fmt.duration}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-white/25 flex-shrink-0 transition-transform ${expandedFormat === fmt.id ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {expandedFormat === fmt.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 mx-1 mb-1 rounded-b-xl bg-obsidian-mid/30 border border-t-0 border-white/4 space-y-2">
                      <p className="text-white/60 text-xs leading-relaxed">{fmt.description}</p>
                      <div>
                        <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Structure</p>
                        <div className="flex flex-wrap gap-1.5">
                          {fmt.structure.map(s => (
                            <span key={s} className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Production</p>
                        <p className="text-white/50 text-xs leading-relaxed">{fmt.production}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Film Brief Scene Card ───────────────────────────────────────

function SceneCard({ scene, index }) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass rounded-xl border border-white/6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-orange/12 border border-orange/20 flex items-center justify-center flex-shrink-0">
            <span className="text-orange text-xs font-bold">{scene.id}</span>
          </div>
          <div>
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">
              {scene.label}
            </span>
            <span className="ml-2 text-white/25 text-xs font-mono">{scene.timeCode}</span>
          </div>
        </div>
        <button
          onClick={() => copyText(scene.script, setCopied)}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-orange px-2 py-1 rounded-lg hover:bg-orange/5 transition-all"
        >
          {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Verbatim script */}
        <div className="sm:col-span-2">
          <p className="text-xs text-white/25 uppercase tracking-widest mb-2">
            🎤 Verbatim Script
          </p>
          <div className="bg-obsidian rounded-xl p-3.5 border border-white/6">
            <p className="text-white text-sm leading-relaxed font-medium">
              "{scene.script}"
            </p>
          </div>
        </div>

        {/* Visual direction */}
        <div>
          <p className="text-xs text-white/25 uppercase tracking-widest mb-2">
            🎥 Visual Direction
          </p>
          <p className="text-white/60 text-xs leading-relaxed border-l-2 border-orange/30 pl-3">
            {scene.visual}
          </p>
        </div>

        {/* Caption */}
        <div>
          <p className="text-xs text-white/25 uppercase tracking-widest mb-2">
            💬 On-Screen Caption
          </p>
          <p className="text-orange/80 text-xs italic leading-relaxed">
            {scene.caption}
          </p>
        </div>

        {/* B-Roll */}
        {scene.bRoll && (
          <div className="sm:col-span-2">
            <p className="text-xs text-white/25 uppercase tracking-widest mb-2">
              🎬 B-Roll / Overlay
            </p>
            <p className="text-white/45 text-xs leading-relaxed">{scene.bRoll}</p>
          </div>
        )}

        {/* Director note */}
        <div className="sm:col-span-2">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-orange/4 border border-orange/10">
            <Eye size={11} className="text-orange mt-0.5 flex-shrink-0" />
            <p className="text-white/55 text-xs leading-relaxed">
              <span className="text-orange/80 font-semibold">Director note: </span>
              {scene.dirNote}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Film Brief Output ───────────────────────────────────────────

function FilmBriefOutput({ brief }) {
  const [copiedCaption,    setCopiedCaption]    = useState(false);
  const [copiedHashtags,   setCopiedHashtags]   = useState(false);
  const [activeSection,    setActiveSection]    = useState('scenes');

  function exportBriefMD() {
    const md = `# FILM BRIEF — ${brief.topic}
Generated: ${brief.createdAt}
Format: ${brief.format} · Target length: ${brief.totalEstimatedLength}

---

## HOOK FORMULA
**Type:** ${brief.hook.label}
**Verbatim opening:** "${brief.verbatimHook}"

---

## SCENES

${brief.scenes.map(s => `### Scene ${s.id} — ${s.label} [${s.timeCode}]

**🎤 Script (verbatim):**
"${s.script}"

**🎥 Visual direction:**
${s.visual}

**💬 On-screen caption:**
${s.caption}

${s.bRoll ? `**🎬 B-Roll:**\n${s.bRoll}\n` : ''}
**👁️ Director note:**
${s.dirNote}

---
`).join('\n')}

## THUMBNAIL CONCEPT
- **Headline:** ${brief.thumbnail.headline}
- **Layout:** ${brief.thumbnail.layout}
- **Colours:** ${brief.thumbnail.colours}
- **Avoid:** ${brief.thumbnail.avoid}
- **Tip:** ${brief.thumbnail.tip}

---

## CAPTION
${brief.caption}

---

## HASHTAGS
${brief.hashtags}

---

## FILMING SETUP (${brief.filmingSetup.label})
**Gear:** ${brief.filmingSetup.gear.join(' · ')}
**Audio:** ${brief.filmingSetup.audio}
**Pro tip:** ${brief.filmingSetup.tip}
`;
    downloadMD(md, `FilmBrief-${brief.topic.replace(/\s+/g,'-')}-${Date.now()}.md`);
  }

  const sections = [
    { id: 'scenes',    label: 'Scene Script',   icon: Clapperboard },
    { id: 'thumbnail', label: 'Thumbnail',       icon: Eye },
    { id: 'caption',   label: 'Caption',         icon: FileText },
    { id: 'setup',     label: 'Filming Setup',   icon: Camera },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Brief meta */}
      <div className="flex items-start justify-between gap-4 p-4 glass rounded-2xl border border-orange/20">
        <div>
          <p className="text-orange text-xs uppercase tracking-widest mb-0.5">Film Brief Ready</p>
          <p className="text-white font-bold text-base">{brief.topic}</p>
          <p className="text-white/40 text-xs mt-1">
            {brief.format} · {brief.totalEstimatedLength} · {brief.scenes.length} scenes · {brief.createdAt}
          </p>
        </div>
        <button
          onClick={exportBriefMD}
          className="flex items-center gap-1.5 text-xs text-white px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-dim transition-colors flex-shrink-0"
        >
          <Download size={13} />
          Export .md
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 p-1 bg-obsidian-mid rounded-xl overflow-x-auto">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all
              ${activeSection === id ? 'bg-orange text-white' : 'text-white/40 hover:text-white/60'}
            `}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Scenes */}
      {activeSection === 'scenes' && (
        <div className="space-y-3">
          {brief.scenes.map((scene, i) => (
            <SceneCard key={scene.id} scene={scene} index={i} />
          ))}
        </div>
      )}

      {/* Thumbnail */}
      {activeSection === 'thumbnail' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 border border-white/5 space-y-4"
        >
          <SectionHeader icon={Eye} title="Thumbnail Concept" subtitle="Visual brief for design" />

          {[
            { label: 'Headline',   value: brief.thumbnail.headline },
            { label: 'Sub-line',   value: brief.thumbnail.subline },
            { label: 'Layout',     value: brief.thumbnail.layout },
            { label: 'Colours',    value: brief.thumbnail.colours },
            { label: 'Font',       value: brief.thumbnail.font },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-white/25 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-white/75 text-sm leading-relaxed">{value}</p>
            </div>
          ))}

          <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/15">
            <p className="text-xs text-red-400/70 uppercase tracking-widest mb-1">Avoid</p>
            <p className="text-white/55 text-xs">{brief.thumbnail.avoid}</p>
          </div>

          <div className="p-3 rounded-xl bg-orange/5 border border-orange/15">
            <p className="text-xs text-orange/70 uppercase tracking-widest mb-1">Key Rule</p>
            <p className="text-white/70 text-xs">{brief.thumbnail.tip}</p>
          </div>
        </motion.div>
      )}

      {/* Caption */}
      {activeSection === 'caption' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader icon={FileText} title="Post Caption" subtitle="Copy-paste ready" />
              <button
                onClick={() => copyText(brief.caption, setCopiedCaption)}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-orange px-3 py-1.5 rounded-lg border border-white/8 hover:border-orange/30 transition-all"
              >
                {copiedCaption ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copiedCaption ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-obsidian/60 rounded-xl p-4 border border-white/5">
              {brief.caption}
            </pre>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader icon={Hash} title="Hashtags" subtitle="Optimised for IELTS niche reach" />
              <button
                onClick={() => copyText(brief.hashtags, setCopiedHashtags)}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-orange px-3 py-1.5 rounded-lg border border-white/8 hover:border-orange/30 transition-all"
              >
                {copiedHashtags ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copiedHashtags ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {brief.hashtags.split(' ').map(tag => (
                <span key={tag} className="text-xs text-orange/80 bg-orange/8 border border-orange/15 px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filming setup */}
      {activeSection === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {FILMING_SETUPS.map((setup) => (
            <div key={setup.id} className="glass rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Camera size={15} className="text-orange" />
                <h3 className="text-white font-semibold text-sm">{setup.label}</h3>
              </div>

              <div>
                <p className="text-xs text-white/25 uppercase tracking-widest mb-2">Gear</p>
                <ul className="space-y-1">
                  {setup.gear.map(g => (
                    <li key={g} className="flex items-center gap-2 text-xs text-white/65">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Audio</p>
                <p className="text-white/55 text-xs"><Mic size={11} className="inline mr-1 text-orange" />{setup.audio}</p>
              </div>

              <div>
                <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Background</p>
                <p className="text-white/55 text-xs">{setup.bg}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-orange/5 border border-orange/15">
                <p className="text-orange/80 text-xs font-semibold">
                  <Lightbulb size={11} className="inline mr-1" />
                  Pro tip: {setup.tip}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Film Brief Generator Form ───────────────────────────────────

function FilmBriefGenerator() {
  const [topic,    setTopic]    = useState('');
  const [hookId,   setHookId]   = useState('counter');
  const [formatId, setFormatId] = useState('myth_truth');
  const [duration, setDuration] = useState('30');
  const [nicheKey, setNicheKey] = useState('writing');
  const [brief,    setBrief]    = useState(null);

  const niches = Object.values(CONTENT_LIBRARY);

  function handleGenerate() {
    if (!topic.trim()) return;
    const result = generateFilmBrief(topic.trim(), hookId, formatId, duration, nicheKey);
    setBrief(result);
  }

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <SectionHeader
          icon={Clapperboard}
          title="Film Brief Generator"
          subtitle="Fill in the brief — get a scene-by-scene director script for your content creator"
        />

        <div className="space-y-4">
          {/* Topic */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              Reel Topic *
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. IELTS vocabulary mistakes, Speaking Band 7 strategy..."
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange/50 transition-all"
            />
          </div>

          {/* Hook formula */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              Hook Formula
            </label>
            <select
              value={hookId}
              onChange={e => setHookId(e.target.value)}
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange/50 transition-all appearance-none cursor-pointer"
            >
              {HOOK_FORMULAS.map(h => (
                <option key={h.id} value={h.id}>
                  {h.label} — {h.avgRetention}% avg retention
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
              Reel Format
            </label>
            <select
              value={formatId}
              onChange={e => setFormatId(e.target.value)}
              className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange/50 transition-all appearance-none cursor-pointer"
            >
              {VIRAL_FORMATS.map(f => (
                <option key={f.id} value={f.id}>
                  {f.label} · {f.duration} · {f.retention}
                </option>
              ))}
            </select>
          </div>

          {/* Duration + Niche row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">
                Target Duration
              </label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-obsidian-mid border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange/50 transition-all appearance-none cursor-pointer"
              >
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="45">45 seconds</option>
                <option value="60">60 seconds</option>
              </select>
            </div>

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
                    {n.emoji} {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="
              w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
              bg-orange text-white font-bold text-sm
              hover:bg-orange-dim transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <Clapperboard size={16} />
            Generate Film Brief
          </button>
        </div>
      </div>

      {/* Output */}
      <AnimatePresence>
        {brief && <FilmBriefOutput brief={brief} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ViralResearch component ────────────────────────────────

export default function ViralResearch() {
  const [activePanel, setActivePanel] = useState('generator');

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Viral Research Studio</h2>
          <p className="text-white/35 text-sm mt-1">
            Trend intelligence + director-ready film briefs for your content creator
          </p>
        </div>

        {/* Panel toggle */}
        <div className="flex gap-1 p-1 bg-obsidian-mid rounded-xl">
          {[
            { id: 'generator', label: 'Film Brief',   icon: Clapperboard },
            { id: 'trends',    label: 'Trend Intel',  icon: TrendingUp },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activePanel === id ? 'bg-orange text-white' : 'text-white/40 hover:text-white/60'}
              `}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {activePanel === 'generator'
            ? <FilmBriefGenerator />
            : <TrendPanel />
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
