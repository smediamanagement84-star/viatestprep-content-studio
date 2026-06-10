import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { BRAND } from '../lib/brandTokens.js';

const ICONS = {
  chevronLeft:  'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  download:     'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  copy:         'M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h0a2 2 0 012 2',
  check:        'M20 6L9 17l-5-5',
  bookmark:     'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z',
  star:         'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
};

const Icon = ({ d, size = 18, color = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ── Geometric accent shapes ──────────────────────────────────────────────────
function GeometricAccents({ examColor, type }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Top-right large circle glow */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 220, height: 220, borderRadius: '50%',
        background: `radial-gradient(circle, ${examColor}22 0%, transparent 70%)`,
      }} />
      {/* Bottom-left subtle glow */}
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 180, height: 180, borderRadius: '50%',
        background: `radial-gradient(circle, ${examColor}12 0%, transparent 70%)`,
      }} />
      {/* Diagonal stripe accent (top-right corner) */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 60, height: 60, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 0, height: 0,
          borderTop: `60px solid ${examColor}18`,
          borderLeft: '60px solid transparent',
        }} />
      </div>
      {/* Small decorative dot grid top-left */}
      {type === 'hook' && (
        <div style={{ position: 'absolute', top: 50, left: -8 }}>
          {[0,1,2].map(r => (
            <div key={r} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              {[0,1,2].map(c => (
                <div key={c} style={{
                  width: 3, height: 3, borderRadius: '50%',
                  background: `${examColor}30`,
                }} />
              ))}
            </div>
          ))}
        </div>
      )}
      {/* Horizontal rule accent */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        height: 1, background: `linear-gradient(90deg, transparent, ${examColor}20, transparent)`,
      }} />
    </div>
  );
}

// ── Slide progress bar ───────────────────────────────────────────────────────
function ProgressBar({ current, total, color }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 3,
          background: i <= current ? color : `${color}20`,
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

export default function CarouselPreview({ data, examColor }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading]   = useState(false);
  const [copied, setCopied]             = useState(false);
  const slideRef = useRef(null);

  const slides = data?.slides || [];
  const slide  = slides[currentSlide];

  const handlePrev = () => setCurrentSlide(prev => prev > 0 ? prev - 1 : slides.length - 1);
  const handleNext = () => setCurrentSlide(prev => prev < slides.length - 1 ? prev + 1 : 0);

  const handleDownloadSlide = async () => {
    if (!slideRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(slideRef.current, {
        useCORS: true, allowTaint: true,
        backgroundColor: BRAND.bg, scale: 2.5, logging: false,
      });
      const url = canvas.toDataURL('image/png', 1.0);
      const a   = document.createElement('a');
      a.href    = url;
      a.download = `VIA-Carousel-Slide-${currentSlide + 1}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (err) { console.error(err); }
    finally { setDownloading(false); }
  };

  const copySlideText = () => {
    let text = '';
    if (slide.type === 'hook')       text = `${slide.headline}\n${slide.subline}`;
    if (slide.type === 'problem')    text = `${slide.label}\n${slide.headline}\n${slide.body}`;
    if (slide.type === 'data')       text = `${slide.label}\n${slide.stat}\n${slide.body}`;
    if (slide.type === 'comparison') text = `What doesn't work: ${slide.wrong}\nWhat works: ${slide.right}`;
    if (slide.type === 'fix')        text = `${slide.label}\n${slide.headline}\n${slide.body}`;
    if (slide.type === 'cta')        text = `${slide.headline}\n${slide.body}\n${slide.handle}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!slide) return null;

  const slideNumber = currentSlide + 1;
  const isHookOrCTA = slide.type === 'hook' || slide.type === 'cta';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>

      {/* ── Slide Canvas ──────────────────────────────────────────────── */}
      <div
        ref={slideRef}
        style={{
          width: '100%', maxWidth: 420,
          aspectRatio: '1 / 1',
          background: isHookOrCTA
            ? `linear-gradient(145deg, #0c1e3c 0%, #08162b 60%, #0a1a30 100%)`
            : `linear-gradient(160deg, #0d1e3a 0%, #08162b 100%)`,
          borderRadius: 18,
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 28px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          fontFamily: BRAND.font,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)`,
        }}
      >
        <GeometricAccents examColor={examColor} type={slide.type} />

        {/* ── Top Bar ───────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ProgressBar current={currentSlide} total={slides.length} color={examColor} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {/* Animated logo dot */}
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: `linear-gradient(135deg, ${examColor}, ${examColor}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 900, color: '#08162b',
              }}>
                VIA
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                TESTPREP
              </span>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 800, color: examColor,
              background: `${examColor}15`,
              border: `1px solid ${examColor}30`,
              padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {data.exam}
            </div>
          </div>
        </div>

        {/* ── Main Content ──────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, margin: '16px 0' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* HOOK SLIDE */}
              {slide.type === 'hook' && (
                <div>
                  <div style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: 20, marginBottom: 12,
                    background: `${examColor}18`, border: `1px solid ${examColor}35`,
                    fontSize: 10, fontWeight: 800, color: examColor, letterSpacing: '2px', textTransform: 'uppercase',
                  }}>
                    Must Read
                  </div>
                  <h1 style={{
                    fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 900, color: '#fff',
                    lineHeight: 1.25, margin: '0 0 12px', letterSpacing: '-0.3px',
                    overflowWrap: 'break-word',
                  }}>
                    {slide.headline?.split(' ').map((w, i) => {
                      const bad = ['failed','wrong','killing','stuck','plateau','trap','myth','hurting','error','failing','retakers'].includes(w.toLowerCase().replace(/[^a-z]/g,''));
                      return <span key={i} style={{ color: bad ? examColor : '#fff', marginRight: 5 }}>{w}</span>;
                    })}
                  </h1>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6, wordBreak: 'break-word' }}>
                    {slide.subline}
                  </p>
                  <div style={{ marginTop: 14, width: 36, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${examColor}, transparent)` }} />
                </div>
              )}

              {/* PROBLEM SLIDE */}
              {slide.type === 'problem' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 3, height: 20, borderRadius: 2, background: examColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: examColor, letterSpacing: '2px', textTransform: 'uppercase' }}>
                      {slide.label}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(15px, 3.5vw, 19px)', fontWeight: 900, color: '#fff', lineHeight: 1.3, margin: '0 0 10px', wordBreak: 'break-word' }}>
                    {slide.headline}
                  </h2>
                  <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
                      {slide.body}
                    </p>
                  </div>
                </div>
              )}

              {/* DATA SLIDE */}
              {slide.type === 'data' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 3, height: 20, borderRadius: 2, background: examColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: examColor, letterSpacing: '2px', textTransform: 'uppercase' }}>
                      {slide.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 'clamp(44px, 10vw, 60px)', fontWeight: 900, lineHeight: 1,
                    background: `linear-gradient(135deg, ${examColor}, ${examColor}80)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: 8,
                  }}>
                    {slide.stat?.match(/\d+[%+]?/)?.[0] || '73%'}
                  </div>
                  <p style={{ fontSize: 12, color: '#fff', fontWeight: 700, margin: '0 0 6px', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {slide.stat}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
                    {slide.body}
                  </p>
                </div>
              )}

              {/* COMPARISON SLIDE */}
              {slide.type === 'comparison' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 3, height: 22, borderRadius: 2, background: '#00adb5' }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#00adb5', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      {slide.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{
                      padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', marginBottom: 5, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        ✗ What Doesn't Work
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{slide.wrong}</div>
                    </div>
                    <div style={{
                      padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(0,173,181,0.08)', border: '1px solid rgba(0,173,181,0.25)',
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#00adb5', marginBottom: 5, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        ✓ What Works
                      </div>
                      <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.5, fontWeight: 700 }}>{slide.right}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* FIX SLIDE */}
              {slide.type === 'fix' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 3, height: 20, borderRadius: 2, background: '#00adb5', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#00adb5', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      {slide.label}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(15px, 3.5vw, 19px)', fontWeight: 900, color: '#fff', lineHeight: 1.3, margin: '0 0 10px', wordBreak: 'break-word' }}>
                    {slide.headline?.split(' ').map((w, i) => {
                      const good = ['works','fix','smarter','formula','right','fluent','correct','pass','improve','better'].includes(w.toLowerCase().replace(/[^a-z]/g,''));
                      return <span key={i} style={{ color: good ? '#00adb5' : '#fff', marginRight: 5 }}>{w}</span>;
                    })}
                  </h2>
                  <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(0,173,181,0.06)', border: '1px solid rgba(0,173,181,0.15)' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
                      {slide.body}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA SLIDE */}
              {slide.type === 'cta' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${examColor}25, ${examColor}10)`,
                    border: `2px solid ${examColor}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon d={ICONS.star} size={22} color={examColor} fill={`${examColor}40`} />
                  </div>
                  <h2 style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.25, wordBreak: 'break-word' }}>
                    {slide.headline}
                  </h2>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
                    {slide.body}
                  </p>
                  <div style={{
                    padding: '7px 18px', borderRadius: 24,
                    background: `linear-gradient(135deg, ${examColor}, ${examColor}90)`,
                    fontSize: 12, fontWeight: 900, color: '#08162b', letterSpacing: '0.5px',
                  }}>
                    {slide.handle}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 14, zIndex: 2,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} style={{
                width: idx === currentSlide ? 16 : 5, height: 5, borderRadius: 3,
                background: idx === currentSlide ? examColor : 'rgba(255,255,255,0.12)',
                border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.25s',
              }} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            {slideNumber < slides.length ? (
              <span style={{ color: examColor, fontWeight: 700 }}>Swipe ›</span>
            ) : (
              <span>🔖 Save this</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation Controls ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={handlePrev} style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', outline: 'none',
        }}>
          <Icon d={ICONS.chevronLeft} size={14} />
        </button>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, minWidth: 52, textAlign: 'center' }}>
          {slideNumber} / {slides.length}
        </span>
        <button onClick={handleNext} style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', outline: 'none',
        }}>
          <Icon d={ICONS.chevronRight} size={14} />
        </button>
      </div>

      {/* ── Action Buttons ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 420 }}>
        <button onClick={copySlideText} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          background: copied ? 'rgba(0,173,181,0.15)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${copied ? 'rgba(0,173,181,0.4)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 9, color: copied ? '#00adb5' : 'rgba(255,255,255,0.5)',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
          transition: 'all 0.2s', flex: '1 1 auto',
        }}>
          <Icon d={copied ? ICONS.check : ICONS.copy} size={13} color={copied ? '#00adb5' : 'rgba(255,255,255,0.5)'} />
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
        <button onClick={handleDownloadSlide} disabled={downloading} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          background: `linear-gradient(135deg, ${examColor}, ${examColor}90)`,
          border: 'none', borderRadius: 9, color: '#08162b',
          fontSize: 12, fontWeight: 800, cursor: downloading ? 'wait' : 'pointer',
          fontFamily: BRAND.font, boxShadow: `0 4px 16px ${examColor}30`,
          transition: 'all 0.2s', flex: '1 1 auto',
        }}>
          <Icon d={ICONS.download} size={13} color="#08162b" />
          {downloading ? 'Capturing...' : 'Download PNG'}
        </button>
      </div>
    </div>
  );
}
