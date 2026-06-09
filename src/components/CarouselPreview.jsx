import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { BRAND } from '../lib/brandTokens.js';

const ICONS = {
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  copy: 'M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h0a2 2 0 012 2',
  check: 'M20 6L9 17l-5-5',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z',
  share: 'M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98M12 12a3 3 0 11-6 0 3 3 0 016 0zm9-6a3 3 0 11-6 0 3 3 0 016 0zm0 12a3 3 0 11-6 0 3 3 0 016 0z'
};

const Icon = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function CarouselPreview({ data, examColor }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const slideRef = useRef(null);

  const slides = data?.slides || [];
  const slide = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handleDownloadSlide = async () => {
    if (!slideRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(slideRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: BRAND.bg,
        scale: 2, // high res
        logging: false,
      });
      const url = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VIA-Carousel-Slide-${currentSlide + 1}-${data.topic.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const copySlideText = () => {
    let text = '';
    if (slide.type === 'hook') {
      text = `${slide.headline}\n${slide.subline}`;
    } else if (slide.type === 'problem') {
      text = `${slide.label}\n${slide.headline}\n${slide.body}`;
    } else if (slide.type === 'data') {
      text = `${slide.label}\n${slide.stat}\n${slide.body}`;
    } else if (slide.type === 'comparison') {
      text = `${slide.label}\nWrong: ${slide.wrong}\nRight: ${slide.right}`;
    } else if (slide.type === 'fix') {
      text = `${slide.label}\n${slide.headline}\n${slide.body}`;
    } else if (slide.type === 'cta') {
      text = `${slide.headline}\n${slide.body}\n${slide.handle}`;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Format headline text to highlight words wrapped in asterisks or quotes
  const renderFormattedHeadline = (text, isGold = false) => {
    if (!text) return '';
    // Look for parts in single/double quotes or specific keywords to colorize
    const words = text.split(' ');
    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      const isKeyword = ['failed', 'hurting', 'plateau', 'template', 'trap', 'speed', 'myth', 'killing', 'wrong', 'failing', 'stuck', 'error', 'impossible', 'destroy', 'score', 'grades', 'points', 'stop', 'retakers'].includes(cleanWord.toLowerCase());
      const isSuccessKeyword = ['works', 'fix', 'smarter', 'formula', 'right', 'fluent', 'correct', 'pass', 'score', 'improve'].includes(cleanWord.toLowerCase());
      
      let color = BRAND.white;
      if (isGold && isKeyword) color = BRAND.gold;
      else if (!isGold && isSuccessKeyword) color = BRAND.teal;
      
      return (
        <span key={i} style={{ color, marginRight: '6px', display: 'inline-block' }}>
          {word}
        </span>
      );
    });
  };

  if (!slide) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Slide Container (Instagram square style 1:1, scaled down for UI) */}
      <div 
        ref={slideRef}
        style={{
          width: 420,
          height: 420,
          background: BRAND.bg,
          border: `1px solid ${BRAND.border}`,
          borderRadius: BRAND.radius,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          fontFamily: BRAND.font,
          boxShadow: BRAND.shadowCard,
        }}
      >
        {/* Subtle Brand Background Glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: slide.type === 'problem' || slide.type === 'hook' ? BRAND.bgGoldGlow : BRAND.bgTealGlow,
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: examColor,
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.dim, letterSpacing: '1px', textTransform: 'uppercase' }}>
              VIA TESTPREP
            </span>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, color: examColor,
            background: `${examColor}15`, border: `1px solid ${examColor}25`,
            padding: '2px 8px', borderRadius: 12, textTransform: 'uppercase'
          }}>
            {data.exam}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, margin: '20px 0' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
            >
              {/* SLIDE TYPE: HOOK */}
              {slide.type === 'hook' && (
                <div>
                  <h1 style={{ 
                    fontSize: 24, 
                    fontWeight: 900, 
                    color: BRAND.white, 
                    lineHeight: 1.35, 
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.5px' 
                  }}>
                    {renderFormattedHeadline(slide.headline, true)}
                  </h1>
                  <p style={{ fontSize: 13, color: BRAND.dim, margin: 0, fontWeight: 500 }}>
                    {slide.subline}
                  </p>
                </div>
              )}

              {/* SLIDE TYPE: PROBLEM */}
              {slide.type === 'problem' && (
                <div>
                  <span style={{ 
                    fontSize: 10, fontWeight: 800, color: BRAND.gold, 
                    letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 
                  }}>
                    {slide.label}
                  </span>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: BRAND.white, lineHeight: 1.4, margin: '0 0 12px 0' }}>
                    {slide.headline}
                  </h2>
                  <p style={{ fontSize: 13, color: BRAND.dim, lineHeight: 1.6, margin: 0 }}>
                    {slide.body}
                  </p>
                </div>
              )}

              {/* SLIDE TYPE: DATA */}
              {slide.type === 'data' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ 
                    fontSize: 10, fontWeight: 800, color: BRAND.gold, 
                    letterSpacing: '2px', textTransform: 'uppercase', display: 'block' 
                  }}>
                    {slide.label}
                  </span>
                  <div style={{ fontSize: 42, fontWeight: 900, color: BRAND.gold, lineHeight: 1 }}>
                    {slide.stat.match(/\d+%?/)?.[0] || '73%'}
                  </div>
                  <p style={{ fontSize: 13, color: BRAND.white, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                    {slide.stat}
                  </p>
                  <p style={{ fontSize: 12, color: BRAND.dim, lineHeight: 1.5, margin: 0 }}>
                    {slide.body}
                  </p>
                </div>
              )}

              {/* SLIDE TYPE: COMPARISON */}
              {slide.type === 'comparison' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span style={{ 
                    fontSize: 10, fontWeight: 800, color: BRAND.teal, 
                    letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 4 
                  }}>
                    {slide.label}
                  </span>
                  
                  {/* Wrong Column */}
                  <div style={{ 
                    background: 'rgba(239, 68, 68, 0.06)', 
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderRadius: 10, padding: '10px 14px'
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 2 }}>WHAT DOESN'T WORK:</div>
                    <div style={{ fontSize: 12, color: BRAND.dim, lineHeight: 1.4 }}>{slide.wrong}</div>
                  </div>

                  {/* Right Column */}
                  <div style={{ 
                    background: `${BRAND.teal}08`, 
                    border: `1px solid ${BRAND.teal}20`,
                    borderRadius: 10, padding: '10px 14px'
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.teal, marginBottom: 2 }}>WHAT WORKS:</div>
                    <div style={{ fontSize: 12, color: BRAND.white, lineHeight: 1.4, fontWeight: 600 }}>{slide.right}</div>
                  </div>
                </div>
              )}

              {/* SLIDE TYPE: FIX */}
              {slide.type === 'fix' && (
                <div>
                  <span style={{ 
                    fontSize: 10, fontWeight: 800, color: BRAND.teal, 
                    letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 
                  }}>
                    {slide.label}
                  </span>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: BRAND.white, lineHeight: 1.4, margin: '0 0 12px 0' }}>
                    {renderFormattedHeadline(slide.headline, false)}
                  </h2>
                  <p style={{ fontSize: 13, color: BRAND.dim, lineHeight: 1.6, margin: 0 }}>
                    {slide.body}
                  </p>
                </div>
              )}

              {/* SLIDE TYPE: CTA */}
              {slide.type === 'cta' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
                  <div style={{ 
                    width: 50, height: 50, borderRadius: '50%', background: BRAND.goldDim,
                    border: `1px solid ${BRAND.borderGold}`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon d={ICONS.bookmark} size={22} color={BRAND.gold} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 950, color: BRAND.white, margin: '0 0 6px 0' }}>
                      {slide.headline}
                    </h2>
                    <p style={{ fontSize: 12, color: BRAND.dim, lineHeight: 1.5, margin: 0, maxWidth: 280 }}>
                      {slide.body}
                    </p>
                  </div>
                  <div style={{ 
                    fontSize: 14, fontWeight: 900, color: BRAND.gold, 
                    letterSpacing: '1px', background: 'rgba(255,255,255,0.03)',
                    padding: '6px 16px', borderRadius: 20, border: `1px solid ${BRAND.border}`
                  }}>
                    {slide.handle}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Hints */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          borderTop: `1px solid ${BRAND.border}`, paddingTop: '16px', zIndex: 2 
        }}>
          <span style={{ fontSize: 11, color: BRAND.dimmer, fontWeight: 600 }}>
            Slide {currentSlide + 1} of {slides.length}
          </span>
          
          {slide.swipeHint && currentSlide === 0 && (
            <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: BRAND.gold }}
            >
              <span style={{ fontSize: 11, fontWeight: 700 }}>Swipe Left</span>
              <Icon d={ICONS.chevronRight} size={12} color={BRAND.gold} />
            </motion.div>
          )}

          {slide.saveHint && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: BRAND.gold }}>
              <Icon d={ICONS.bookmark} size={12} color={BRAND.gold} />
              <span style={{ fontSize: 11, fontWeight: 700 }}>Save this post</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button 
          onClick={handlePrev}
          style={{
            width: 38, height: 38, borderRadius: 10, border: `1px solid ${BRAND.border}`,
            background: BRAND.bgCard, color: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', outline: 'none'
          }}
        >
          <Icon d={ICONS.chevronLeft} size={16} />
        </button>

        {/* Indicator dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? 18 : 6,
                height: 6,
                borderRadius: 3,
                border: 'none',
                background: idx === currentSlide ? examColor : BRAND.border,
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: 0
              }}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          style={{
            width: 38, height: 38, borderRadius: 10, border: `1px solid ${BRAND.border}`,
            background: BRAND.bgCard, color: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', outline: 'none'
          }}
        >
          <Icon d={ICONS.chevronRight} size={16} />
        </button>
      </div>

      {/* Action panel (Copy/Download) */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button 
          onClick={copySlideText}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: copied ? BRAND.tealDim : 'rgba(255,255,255,0.05)', 
            border: `1px solid ${copied ? BRAND.borderTeal : BRAND.border}`,
            borderRadius: 8, color: copied ? BRAND.teal : BRAND.dim,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font
          }}
        >
          <Icon d={copied ? ICONS.check : ICONS.copy} size={12} color={copied ? BRAND.teal : BRAND.dim} />
          {copied ? 'Copied Slide Text' : 'Copy Slide Text'}
        </button>

        <button 
          onClick={handleDownloadSlide}
          disabled={downloading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: BRAND.gradGold, border: 'none',
            borderRadius: 8, color: '#08162b',
            fontSize: 12, fontWeight: 700, cursor: downloading ? 'wait' : 'pointer', fontFamily: BRAND.font
          }}
        >
          <Icon d={ICONS.download} size={12} color="#08162b" />
          {downloading ? 'Capturing...' : 'Download Slide PNG'}
        </button>
      </div>
    </div>
  );
}
