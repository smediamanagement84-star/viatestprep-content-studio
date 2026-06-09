// ─────────────────────────────────────────────────────────────────────────────
//  ViAtestprep Content Studio — Mobile Viewport & Export Hub
//  src/components/Previewer.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Download, RefreshCw, Play, Pause,
  Monitor, ImageDown, AlertCircle, Loader2,
} from 'lucide-react';
import html2canvas from 'html2canvas';

// ═══════════════════════════════════════════════════════════════════════════════
//  ANIMATION PLAYER  —  renders inside the 9:16 viewport
// ═══════════════════════════════════════════════════════════════════════════════

function AnimationPlayer({ animationData, isPlaying }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [loopKey,    setLoopKey]    = useState(0);
  const intervalRef = useRef(null);

  const { scenes, colors, timing, branding } = animationData;
  const scene = scenes[sceneIndex];

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current);
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSceneIndex(prev => {
        const next = (prev + 1) % scenes.length;
        if (next === 0) setLoopKey(k => k + 1);
        return next;
      });
    }, timing.sceneDuration);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, scenes.length, timing.sceneDuration]);

  // Reset on new animation data
  useEffect(() => {
    setSceneIndex(0);
    setLoopKey(0);
  }, [animationData.id]);

  const isHeadline = scene.style === 'headline';

  return (
    <div
      style={{
        width:          '100%',
        height:         '100%',
        background:     colors.bg,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        alignItems:     'center',
        position:       'relative',
        overflow:       'hidden',
        fontFamily:     'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── Subtle grid background ── */}
      <div style={{
        position:          'absolute',
        inset:             0,
        backgroundImage:   `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize:    '32px 32px',
        pointerEvents:     'none',
      }} />

      {/* ── Progress bar ── */}
      <div style={{
        position:    'absolute',
        top:         0,
        left:        0,
        right:       0,
        height:      '3px',
        background:  'rgba(255,255,255,0.06)',
        zIndex:      10,
      }}>
        <motion.div
          key={`progress-${sceneIndex}-${loopKey}`}
          initial={{ width: '0%' }}
          animate={{ width: isPlaying ? '100%' : '0%' }}
          transition={{ duration: timing.sceneDuration / 1000, ease: 'linear' }}
          style={{ height: '100%', background: colors.accent }}
        />
      </div>

      {/* ── Scene counter dots ── */}
      <div style={{
        position:  'absolute',
        top:       '18px',
        right:     '35px',
        display:   'flex',
        gap:       '5px',
        zIndex:    10,
      }}>
        {scenes.map((_, i) => (
          <div
            key={i}
            style={{
              width:        i === sceneIndex ? '18px' : '5px',
              height:       '5px',
              borderRadius: '3px',
              background:   i === sceneIndex ? colors.accent : 'rgba(255,255,255,0.15)',
              transition:   'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* ── Scene label ── */}
      <div style={{
        position:      'absolute',
        top:           '18px',
        left:          '35px',
        color:         colors.accent,
        fontSize:      '9px',
        letterSpacing: '3px',
        fontWeight:    700,
        textTransform: 'uppercase',
        zIndex:        10,
      }}>
        {scene.label}
      </div>

      {/* ── Main content ── */}
      <div style={{
        width:      '100%',
        padding:    '0 35px',
        zIndex:     5,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`scene-${sceneIndex}-${loopKey}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ textAlign: 'center' }}
          >
            {scene.lines.map((line, i) => {
              const isAccentLine  = scene.accent && i === scene.lines.length - 1;
              const isLastScene   = sceneIndex === scenes.length - 1;
              const isDimLine     = isLastScene && i === scene.lines.length - 1;

              return (
                <motion.p
                  key={`line-${sceneIndex}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * timing.stagger, duration: 0.38 }}
                  style={{
                    color:         isAccentLine ? colors.accent
                                 : isDimLine    ? colors.dim
                                 : colors.primary,
                    fontSize:      isHeadline                ? '26px'
                                 : line.length > 22         ? '21px'
                                 : '24px',
                    fontWeight:    isHeadline ? 800
                                 : i === 0   ? 400
                                 : 700,
                    lineHeight:    1.25,
                    marginBottom:  i < scene.lines.length - 1 ? '6px' : 0,
                    letterSpacing: isHeadline ? '-0.5px' : '0',
                    wordBreak:     'break-word',
                    whiteSpace:    'normal',
                    overflowWrap:  'break-word',
                  }}
                >
                  {line}
                </motion.p>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <motion.div
        key={`divider-${sceneIndex}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        style={{
          position:        'absolute',
          bottom:          '58px',
          left:            '35px',
          right:           '35px',
          height:          '1px',
          background:      'rgba(255,255,255,0.07)',
          transformOrigin: 'left',
        }}
      />

      {/* ── Branding ── */}
      <div style={{
        position:      'absolute',
        bottom:        '22px',
        color:         'rgba(255,255,255,0.35)',
        fontSize:      '10px',
        letterSpacing: '2.5px',
        fontWeight:    600,
        textTransform: 'uppercase',
      }}>
        {branding}
      </div>

      {/* ── Paused overlay ── */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position:       'absolute',
              inset:          0,
              background:     'rgba(0,0,0,0.45)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              zIndex:         20,
            }}
          >
            <div style={{
              width:          '52px',
              height:         '52px',
              borderRadius:   '50%',
              background:     'rgba(255,107,0,0.15)',
              border:         '1px solid rgba(255,107,0,0.3)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <Play size={20} color="#FF6B00" style={{ marginLeft: '3px' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EMPTY STATE  —  shown when no animation is loaded
// ═══════════════════════════════════════════════════════════════════════════════

function EmptyViewport() {
  return (
    <div
      style={{
        width:          '100%',
        height:         '100%',
        background:     '#0b0f19',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '12px',
        fontFamily:     'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{
        width:          '52px',
        height:         '52px',
        borderRadius:   '16px',
        background:     'rgba(255,107,0,0.08)',
        border:         '1px solid rgba(255,107,0,0.15)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <Smartphone size={22} color="rgba(255,107,0,0.5)" />
      </div>
      <p style={{
        color:         'rgba(255,255,255,0.25)',
        fontSize:      '12px',
        textAlign:     'center',
        padding:       '0 32px',
        lineHeight:    1.5,
        letterSpacing: '0.2px',
      }}>
        Generate an animation in the
        <br />
        <span style={{ color: 'rgba(255,107,0,0.6)' }}>Asset Generator</span>
        {' '}→ Animation Compiler
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EXPORT PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function ExportPanel({ viewportRef, animationData, isExporting, setIsExporting }) {
  const [exportMsg, setExportMsg] = useState('');

  async function handleExportPNG() {
    if (!viewportRef.current || !animationData) return;
    setIsExporting(true);
    setExportMsg('');
    try {
      const canvas = await html2canvas(viewportRef.current, {
        useCORS:          true,
        allowTaint:       true,
        backgroundColor:  '#0b0f19',
        scale:            3, // 3× for high-res
        logging:          false,
        imageTimeout:     0,
        removeContainer:  true,
      });
      const url = canvas.toDataURL('image/png', 1.0);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `VIA-Reel-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setExportMsg('PNG exported at 3× resolution');
    } catch (err) {
      setExportMsg('Export failed — try pausing the animation first');
      console.error(err);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportMsg(''), 4000);
    }
  }

  if (!animationData) return null;

  return (
    <div className="space-y-3">
      <button
        onClick={handleExportPNG}
        disabled={isExporting}
        className="
          w-full flex items-center justify-center gap-2
          py-3.5 rounded-xl bg-orange text-white font-bold text-sm
          hover:bg-orange-dim transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isExporting
          ? <><Loader2 size={16} className="animate-spin" /> Capturing...</>
          : <><ImageDown size={16} /> Download PNG (3× Hi-Res)</>
        }
      </button>

      {exportMsg && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-white/40"
        >
          {exportMsg}
        </motion.p>
      )}

      <p className="text-xs text-white/25 text-center leading-relaxed">
        Pause animation before export for a clean single-frame capture.
        The PNG is saved at 1170×2079px (3×).
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PREVIEWER
// ═══════════════════════════════════════════════════════════════════════════════

export default function Previewer({ animationData }) {
  const viewportRef    = useRef(null);
  const [isPlaying,    setIsPlaying]    = useState(true);
  const [isExporting,  setIsExporting]  = useState(false);

  // Auto-play when new animation arrives
  useEffect(() => {
    if (animationData) setIsPlaying(true);
  }, [animationData]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-full">

      {/* ════════════════════════════════════════════════════════
          LEFT — Viewport frame
      ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col items-center gap-4 flex-shrink-0">

        {/* Device chrome */}
        <div className="flex items-center gap-2 self-start">
          <Monitor size={14} className="text-white/30" />
          <span className="text-white/30 text-xs">9:16 Preview  ·  390 × 693 px</span>
        </div>

        {/* Outer phone bezel */}
        <div
          style={{
            background:   '#0a0a0a',
            borderRadius: '40px',
            padding:      '12px',
            border:       '1px solid rgba(255,255,255,0.08)',
            boxShadow:    '0 0 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Notch */}
          <div style={{
            width:           '80px',
            height:          '6px',
            borderRadius:    '3px',
            background:      '#1a1a1a',
            margin:          '0 auto 8px',
          }} />

          {/* Viewport — 9:16 locked container */}
          <div
            ref={viewportRef}
            className="viewport-916"
            style={{
              borderRadius: '12px',
              overflow:     'hidden',
            }}
          >
            {animationData
              ? <AnimationPlayer
                  animationData={animationData}
                  isPlaying={isPlaying && !isExporting}
                />
              : <EmptyViewport />
            }
          </div>

          {/* Home bar */}
          <div style={{
            width:        '100px',
            height:       '4px',
            borderRadius: '2px',
            background:   '#1a1a1a',
            margin:       '8px auto 0',
          }} />
        </div>

        {/* Playback controls */}
        {animationData && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/6 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {isPlaying
                ? <><Pause size={14} /> Pause</>
                : <><Play  size={14} /> Play</>
              }
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 50);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white/50 text-sm hover:text-white hover:bg-white/8 transition-colors"
            >
              <RefreshCw size={13} />
              Restart
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT — Controls & export
      ════════════════════════════════════════════════════════ */}
      <div className="flex-1 space-y-5 min-w-0">

        {/* Header */}
        <div>
          <h2 className="text-white font-bold text-xl">Preview & Export Hub</h2>
          <p className="text-white/35 text-sm mt-1">
            Zero-bleed 9:16 viewport — capture at 3× resolution
          </p>
        </div>

        {/* Animation details */}
        {animationData ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Meta card */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
                Active Animation
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Topic',   value: animationData.topic },
                  { label: 'Niche',   value: animationData.niche },
                  { label: 'Scenes',  value: `${animationData.scenes.length} (incl. seamless loop)` },
                  { label: 'Format',  value: '9:16 · 390 × 693 px' },
                  { label: 'Duration', value: `${(animationData.scenes.length * animationData.timing.sceneDuration / 1000).toFixed(1)}s per loop` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-white/35 text-xs flex-shrink-0">{label}</span>
                    <span className="text-white/80 text-xs text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand tokens */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
                Brand System
              </p>
              <div className="flex gap-3">
                {[
                  { name: 'Obsidian',  hex: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)' },
                  { name: 'Alert Orange', hex: '#FF6B00', border: 'none' },
                  { name: 'Pure White', hex: '#FFFFFF',  border: '1px solid rgba(0,0,0,0.2)' },
                ].map(({ name, hex, border }) => (
                  <div key={name} className="flex-1 text-center">
                    <div
                      style={{
                        width:        '100%',
                        aspectRatio:  '1',
                        background:   hex,
                        borderRadius: '10px',
                        border,
                        marginBottom: '6px',
                      }}
                    />
                    <p className="text-white/50 text-xs">{name}</p>
                    <p className="text-white/25 text-xs font-mono">{hex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero-bleed spec */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                Zero-Bleed Spec
              </p>
              <div className="space-y-2">
                {[
                  ['Safety margin',    '35px (left + right)'],
                  ['Text wrap',        'break-word + normal'],
                  ['Overflow',         'hidden (all axes)'],
                  ['Font rendering',   '-webkit-font-smoothing: antialiased'],
                  ['Export scale',     '3× (1170 × 2079 px PNG)'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-white/35 text-xs">{k}</span>
                    <span className="text-white/65 text-xs font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export panel */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
                Export Asset
              </p>
              <ExportPanel
                viewportRef={viewportRef}
                animationData={animationData}
                isExporting={isExporting}
                setIsExporting={setIsExporting}
              />
            </div>
          </motion.div>
        ) : (
          /* No animation loaded */
          <div className="glass rounded-2xl p-8 border border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/3 flex items-center justify-center">
              <AlertCircle size={20} className="text-white/20" />
            </div>
            <div>
              <p className="text-white/50 font-semibold text-sm">No animation loaded</p>
              <p className="text-white/25 text-xs mt-1 leading-relaxed">
                Go to the Asset Generator → Animation Compiler tab,
                fill in your topic, and click "Compile Animation."
                The preview will appear here automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
