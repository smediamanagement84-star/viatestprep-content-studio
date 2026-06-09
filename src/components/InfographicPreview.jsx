import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { BRAND } from '../lib/brandTokens.js';

const ICONS = {
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  copy: 'M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h0a2 2 0 012 2',
  check: 'M20 6L9 17l-5-5',
  alertCircle: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  sparkles: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM17 17a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2zM17 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 17a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z',
};

const Icon = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function InfographicPreview({ data, examColor }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [interactiveScore, setInteractiveScore] = useState(5.5);
  const infographicRef = useRef(null);

  const handleDownload = async () => {
    if (!infographicRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(infographicRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: BRAND.bg,
        scale: 2, // high res
        logging: false,
      });
      const url = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VIA-Infographic-${data.topic.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const copyJSX = () => {
    const code = `
// VIA Testprep - Generated Infographic React Component
// Topic: ${data.topic}

import React from 'react';

export default function VIAInfographic() {
  return (
    <div style={{
      width: 390, height: 620, background: '${BRAND.bg}',
      color: '#fff', padding: 24, borderRadius: 16,
      fontFamily: 'system-ui, sans-serif', border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <h2 style={{ fontSize: 20, color: '${BRAND.gold}', marginBottom: 12 }}>${data.headline}</h2>
      <p style={{ color: '#aaa', fontSize: 13 }}>${data.insight}</p>
      
      <div style={{ margin: '24px 0', padding: 16, background: '${BRAND.bgCard}', borderRadius: 12 }}>
        <strong>${data.stat}</strong>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
        <p style={{ color: '${BRAND.teal}', fontSize: 14 }}><strong>Fix:</strong> ${data.fix}</p>
      </div>
    </div>
  );
}
`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      
      {/* 9:16 Portrait Styled Infographic Card */}
      <div
        ref={infographicRef}
        style={{
          width: 390,
          height: 640,
          background: BRAND.bg,
          border: `1px solid ${BRAND.border}`,
          borderRadius: BRAND.radius,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px 20px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          fontFamily: BRAND.font,
          boxShadow: BRAND.shadowCard,
        }}
      >
        {/* Subtle Brand Background Glow */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: BRAND.bgTealGlow,
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: BRAND.bgGoldGlow,
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: examColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#08162b' }}>V</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: BRAND.dim, letterSpacing: '1.5px' }}>
              VIA TESTPREP
            </span>
          </div>
          <span style={{
            fontSize: 9, fontWeight: 800, color: examColor,
            background: `${examColor}15`, border: `1px solid ${examColor}25`,
            padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {data.exam} · INFOGRAPHIC
          </span>
        </div>

        {/* Headline / Hook */}
        <div style={{ zIndex: 2, marginTop: 8 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 900,
            color: BRAND.white,
            lineHeight: 1.3,
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            {data.headline}
          </h2>
          <p style={{ fontSize: 11, color: BRAND.dim, margin: '4px 0 0 0', lineHeight: 1.45 }}>
            {data.insight}
          </p>
        </div>

        {/* Core Visual Graphic (Responsive to Type) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, margin: '8px 0' }}>
          
          {/* TYPE A: STAT BAR / PROGRESS */}
          {data.type === 'stat_bar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Animated Progress Circle or Bar */}
              <div style={{ background: BRAND.bgCard, border: `1px solid ${BRAND.border}`, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.gold }}>FAIL RATE IN TARGET DEMOGRAPHIC</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: BRAND.gold }}>{data.statValue}%</span>
                </div>
                
                {/* Horizontal Progress Track */}
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.statValue}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ height: '100%', background: BRAND.gradGold, borderRadius: 3 }}
                  />
                </div>
                
                <p style={{ fontSize: 10.5, color: BRAND.dimmer, margin: '6px 0 0 0', lineHeight: 1.35 }}>
                  {data.stat}
                </p>
              </div>

              {/* Interactive Element: Score Simulator Slider */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BRAND.border}`, borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.teal }}>SCORE SIMULATOR</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: BRAND.white }}>Band {interactiveScore}</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="9.0" 
                  step="0.5"
                  value={interactiveScore} 
                  onChange={(e) => setInteractiveScore(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: BRAND.teal, cursor: 'pointer', height: 4, marginBottom: 4 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: BRAND.dimmer, fontWeight: 600 }}>
                  <span>5.0 (Basic)</span>
                  <span>7.0 (Target)</span>
                  <span>9.0 (Expert)</span>
                </div>
                <div style={{ fontSize: 10.5, color: BRAND.white, marginTop: 6, fontWeight: 500 }}>
                  {interactiveScore >= 7.5 ? (
                    <span style={{ color: BRAND.teal }}>✅ Highly safe range. Focus on timing and vocabulary sophistication.</span>
                  ) : interactiveScore >= 6.5 ? (
                    <span style={{ color: BRAND.gold }}>⚠️ Common plateau range. Eliminate generic structures and templates.</span>
                  ) : (
                    <span style={{ color: '#ef4444' }}>❌ High risk level. Focus on basic sentence accuracy and task alignment.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TYPE B: COMPARISON */}
          {data.type === 'comparison' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              
              {/* Student/Wrong Panel */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.12)',
                borderRadius: 10,
                padding: '8px 10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>❌</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', letterSpacing: '1px' }}>
                    {data.comparison.wrong.label.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: BRAND.dim, lineHeight: 1.4, margin: 0 }}>
                  {data.comparison.wrong.text}
                </p>
              </div>

              {/* Success/Right Panel */}
              <div style={{
                background: `${BRAND.teal}06`,
                border: `1px solid ${BRAND.teal}15`,
                borderRadius: 10,
                padding: '8px 10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>✅</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: BRAND.teal, letterSpacing: '1px' }}>
                    {data.comparison.right.label.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: BRAND.white, lineHeight: 1.4, margin: 0, fontWeight: 600 }}>
                  {data.comparison.right.text}
                </p>
              </div>

            </div>
          )}

          {/* TYPE C: STEPS */}
          {data.type === 'steps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { step: 1, title: 'Analyze the Gap', desc: data.painPoint },
                { step: 2, title: 'Implement the Fix', desc: data.fix },
                { step: 3, title: 'Verify the Results', desc: 'Assess and compare score output changes.' }
              ].map((s, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', gap: 8, alignItems: 'center',
                  background: BRAND.bgCard, border: `1px solid ${BRAND.border}`,
                  borderRadius: 8, padding: '6px 10px'
                }}>
                  <div style={{ 
                    width: 20, height: 20, borderRadius: '50%', background: examColor + '15',
                    border: `1px solid ${examColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: examColor, flexShrink: 0
                  }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.white }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: BRAND.dim, marginTop: 1, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Actionable Solution Bottom Footer */}
        <div style={{ zIndex: 2, borderTop: `1px solid ${BRAND.border}`, paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: BRAND.tealDim, border: `1px solid ${BRAND.borderTeal}`, borderRadius: 8, padding: '6px 10px' }}>
            <div style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <Icon d={ICONS.alertCircle} size={11} color={BRAND.teal} />
            </div>
            <div>
              <span style={{ fontSize: 9, fontWeight: 800, color: BRAND.teal, letterSpacing: '0.5px', display: 'block', marginBottom: 2 }}>
                PRO ACTIONABLE STRATEGY
              </span>
              <p style={{ fontSize: 10.5, color: BRAND.white, margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
                {data.fix}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.dimmer }}>
              @viatestprep
            </span>
            <span style={{ fontSize: 10, color: BRAND.dimmer, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Icon d={ICONS.sparkles} size={10} color={BRAND.teal} />
              Save for prep
            </span>
          </div>
        </div>

      </div>

      {/* Action panel (Copy/Download) */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button 
          onClick={copyJSX}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: copied ? BRAND.tealDim : 'rgba(255,255,255,0.05)', 
            border: `1px solid ${copied ? BRAND.borderTeal : BRAND.border}`,
            borderRadius: 8, color: copied ? BRAND.teal : BRAND.dim,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font
          }}
        >
          <Icon d={copied ? ICONS.check : ICONS.copy} size={12} color={copied ? BRAND.teal : BRAND.dim} />
          {copied ? 'Copied Component JSX' : 'Export Component JSX'}
        </button>

        <button 
          onClick={handleDownload}
          disabled={downloading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: BRAND.gradGold, border: 'none',
            borderRadius: 8, color: '#08162b',
            fontSize: 12, fontWeight: 700, cursor: downloading ? 'wait' : 'pointer', fontFamily: BRAND.font
          }}
        >
          <Icon d={downloading ? ICONS.check : ICONS.download} size={12} color="#08162b" />
          {downloading ? 'Capturing...' : 'Download Infographic PNG'}
        </button>
      </div>

    </div>
  );
}
