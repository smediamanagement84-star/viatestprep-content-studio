import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  runWeeklyResearch, 
  generateContentPlan,
  generateCarouselData,
  generateInfographicData,
  generateReelScript,
  generateCaption,
} from '../lib/researchEngine.js';
import { BRAND } from '../lib/brandTokens.js';
import CarouselPreview from './CarouselPreview.jsx';
import InfographicPreview from './InfographicPreview.jsx';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  refresh:  'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15',
  trending: 'M23 6l-9.5 9.5-5-5L1 18',
  calendar: 'M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18',
  spark:    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  copy:     'M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h0a2 2 0 012 2',
  check:    'M20 6L9 17l-5-5',
  carousel: 'M2 6h4v12H2zM10 3h4v18h-4zM18 6h4v12h-4z',
  infograph:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  script:   'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  caption:  'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  close:    'M18 6L6 18M6 6l12 12',
  eye:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  zap:      'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

const EXAM_COLOR = { IELTS: BRAND.gold, PTE: BRAND.teal };
const FORMAT_ICON = { carousel: ICONS.carousel, infographic: ICONS.infograph, reel: ICONS.script };
const FORMAT_LABEL = { carousel: 'Carousel', infographic: 'Infographic', reel: 'Reel Script' };
const MOMENTUM_LABEL = { 
  h: v => v >= 90 ? '🔥 Hot' : v >= 80 ? '📈 Rising' : '⚡ Steady'
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AutoResearch({ weeklyPlan, setWeeklyPlan, setPrefilledAsset, setActiveTab: setParentTab }) {
  const [research, setResearch] = useState(null);
  const [plan, setPlan]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState('trends'); // trends | plan | generate
  const [transferSuccess, setTransferSuccess] = useState(false);
  
  // Content generation state
  const [selectedDay, setSelectedDay]     = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generating, setGenerating]       = useState(false);
  const [copied, setCopied]               = useState(false);
  const [previewMode, setPreviewMode]     = useState(false);

  // Restore weekly cached research from localStorage (valid for 7 days)
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem('research_engine_data');
      const cachedTime = localStorage.getItem('research_engine_time');
      
      if (cachedData && cachedTime) {
        const timeDiff = Date.now() - new Date(cachedTime).getTime();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        if (timeDiff < oneWeek) {
          const parsed = JSON.parse(cachedData);
          setResearch(parsed);
          const contentPlan = generateContentPlan(parsed);
          setPlan(contentPlan);
        }
      }
    } catch (e) {
      console.error('Failed to load cached research', e);
    }
  }, []);

  // ── Run Research & Cache ────────────────────────────────────────────────
  const handleRunResearch = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const data = runWeeklyResearch();
      const contentPlan = generateContentPlan(data);
      setResearch(data);
      setPlan(contentPlan);
      
      try {
        localStorage.setItem('research_engine_data', JSON.stringify(data));
        localStorage.setItem('research_engine_time', new Date().toISOString());
      } catch (e) {
        console.error('Failed to cache research', e);
      }
      
      setLoading(false);
      setActiveTab('plan');
    }, 1600);
  }, []);

  // ── Transfer Plan to Command Center Planner ──────────────────────────────
  const handleTransferToPlanner = useCallback(() => {
    if (!plan) return;
    setWeeklyPlan(plan);
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setParentTab('dashboard'); // Redirect to Command Center Content Calendar
    }, 1200);
  }, [plan, setWeeklyPlan, setParentTab]);

  // ── Generate Content ─────────────────────────────────────────────────────
  const handleGenerate = useCallback((dayData, formatOverride) => {
    const format = formatOverride || dayData.format;
    setSelectedDay(dayData);
    setSelectedFormat(format);
    setGenerating(true);
    setGeneratedContent(null);
    setActiveTab('generate');
    
    setTimeout(() => {
      let content;
      // Build a trend object from the day plan
      const trend = {
        exam:       dayData.exam,
        topic:      dayData.topic,
        hook:       dayData.hook,
        angle:      dayData.angle,
        painPoint:  dayData.painPoint,
        stat:       dayData.stat,
        fix:        dayData.fix,
        caption:    dayData.caption,
        hashtags:   dayData.hashtags,
        insight:    dayData.insight,
        momentum:   dayData.momentum,
        category:   dayData.category,
      };
      
      if (format === 'carousel')    content = { type: 'carousel',    data: generateCarouselData(trend) };
      if (format === 'infographic') content = { type: 'infographic', data: generateInfographicData(trend) };
      if (format === 'reel')        content = { type: 'reel',        data: generateReelScript(trend) };
      
      // Also generate caption regardless of format
      content.caption  = generateCaption(trend, format);
      content.hashtags = trend.hashtags;
      
      setGeneratedContent(content);
      setGenerating(false);
    }, 1200);
  }, []);

  const copyCaption = useCallback(() => {
    if (!generatedContent?.caption) return;
    navigator.clipboard.writeText(generatedContent.caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [generatedContent]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `linear-gradient(135deg, ${BRAND.gold}22, ${BRAND.teal}22)`,
            border: `1px solid ${BRAND.goldBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.trending} size={18} color={BRAND.gold} />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: BRAND.white, margin: 0 }}>
              AI Research Engine
            </h2>
            <p style={{ fontSize: 13, color: BRAND.dim, margin: 0 }}>
              Weekly IELTS + PTE trend analysis · 50/50 split · Auto-rotates every Monday
            </p>
          </div>
        </div>

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: 4, marginTop: 20 }}>
          {[
            { id: 'trends',   label: 'Trend Intelligence', icon: ICONS.trending },
            { id: 'plan',     label: 'Weekly Plan',        icon: ICONS.calendar, disabled: !plan },
            { id: 'generate', label: 'Generated Content',  icon: ICONS.spark,    disabled: !generatedContent },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 18px', borderRadius: 8, border: 'none', cursor: tab.disabled ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: BRAND.font,
                transition: 'all 0.2s',
                background: activeTab === tab.id ? BRAND.gold : 'rgba(255,255,255,0.05)',
                color: activeTab === tab.id ? '#08162b' : tab.disabled ? BRAND.dimmest : BRAND.dim,
              }}>
              <Icon d={tab.icon} size={14} color={activeTab === tab.id ? '#08162b' : tab.disabled ? BRAND.dimmest : BRAND.dim} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── TAB: TRENDS ─────────────────────────────────────────────────── */}
        {activeTab === 'trends' && (
          <motion.div key="trends"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
              <motion.button
                onClick={handleRunResearch}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px', borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer',
                  background: loading ? 'rgba(241,196,15,0.2)' : BRAND.gradGold,
                  color: loading ? BRAND.gold : '#08162b',
                  fontSize: 15, fontWeight: 700, fontFamily: BRAND.font,
                  boxShadow: loading ? 'none' : BRAND.shadowGold,
                  transition: 'all 0.2s',
                }}>
                <motion.div animate={{ rotate: loading ? 360 : 0 }}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}>
                  <Icon d={ICONS.refresh} size={18} color={loading ? BRAND.gold : '#08162b'} />
                </motion.div>
                {loading ? 'Analysing trends…' : research ? 'Refresh Research' : 'Run Weekly Research'}
              </motion.button>

              {research && !loading && (
                <motion.button
                  onClick={handleTransferToPlanner}
                  disabled={transferSuccess}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 28px', borderRadius: 12, border: `1px solid ${BRAND.borderTeal}`, 
                    cursor: 'pointer',
                    background: transferSuccess ? `${BRAND.teal}22` : BRAND.tealDim,
                    color: BRAND.teal,
                    fontSize: 15, fontWeight: 700, fontFamily: BRAND.font,
                    boxShadow: BRAND.shadowTeal,
                    transition: 'all 0.2s',
                  }}>
                  <Icon d={ICONS.calendar} size={18} color={BRAND.teal} />
                  {transferSuccess ? 'Transferred to Planner! Redirecting...' : 'Transfer Best Ideas to Content Planner'}
                </motion.button>
              )}
            </div>

            {!research && !loading && (
              <NoDataState onRun={handleRunResearch} />
            )}

            {loading && <LoadingState />}

            {research && !loading && (
              <>
                {/* Week Summary */}
                <WeekSummary data={research} />

                {/* Market Signals */}
                <div style={{ marginBottom: 28 }}>
                  <SectionLabel icon={ICONS.zap} label="Market Signals This Week" color={BRAND.teal} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {research.marketSignals.map((s, i) => (
                      <MarketSignalCard key={i} signal={s} />
                    ))}
                  </div>
                </div>

                {/* Trend Cards */}
                <div>
                  <SectionLabel icon={ICONS.trending} label={`Top ${research.trends.length} Trending Topics`} color={BRAND.gold} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {research.trends.map((trend, i) => (
                      <TrendCard key={trend.id} trend={trend} rank={i + 1}
                        onGenerate={(fmt) => handleGenerate({
                          ...trend,
                          format:   fmt || trend.formats[0],
                          postTime: '7:00 AM',
                          dayIndex: i,
                          day:      ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i] || 'Monday',
                          shortDay: ['MON','TUE','WED','THU','FRI','SAT','SUN'][i] || 'MON',
                        }, fmt)}
                      />
                    ))}
                  </div>
                </div>

                {/* View Plan CTA */}
                <motion.button onClick={() => setActiveTab('plan')}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{
                    marginTop: 28, width: '100%', padding: '14px',
                    background: BRAND.tealDim, border: `1px solid ${BRAND.tealBorder}`,
                    borderRadius: 12, color: BRAND.teal, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', fontFamily: BRAND.font,
                  }}>
                  <Icon d={ICONS.calendar} size={16} color={BRAND.teal} /> View 7-Day Content Plan →
                </motion.button>
              </>
            )}
          </motion.div>
        )}

        {/* ── TAB: PLAN ───────────────────────────────────────────────────── */}
        {activeTab === 'plan' && plan && (
          <motion.div key="plan"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: BRAND.dim, fontSize: 13, margin: 0 }}>
                Week {research?.weekNumber} · {research?.generatedAt} · Next refresh: {research?.nextRefresh}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.map(day => (
                <PlanDayCard key={day.dayIndex} day={day} onGenerate={handleGenerate} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── TAB: GENERATE ───────────────────────────────────────────────── */}
        {activeTab === 'generate' && (
          <motion.div key="generate"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>

            {generating && <LoadingState message="Generating your content…" />}

            {!generating && generatedContent && (
              <GeneratedContentView
                content={generatedContent}
                dayData={selectedDay}
                format={selectedFormat}
                onCopyCaption={copyCaption}
                copied={copied}
                onBack={() => setActiveTab('plan')}
                onRegenerate={() => handleGenerate(selectedDay, selectedFormat)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <Icon d={icon} size={14} color={color} />
      <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

function NoDataState({ onRun }) {
  return (
    <div style={{
      textAlign: 'center', padding: '64px 32px',
      background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, ${BRAND.bg} 100%)`,
      border: `1px solid ${BRAND.border}`, borderRadius: 20,
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h3 style={{ color: BRAND.white, fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
        No research data yet
      </h3>
      <p style={{ color: BRAND.dim, fontSize: 14, margin: '0 0 24px' }}>
        Click "Run Weekly Research" to analyse trending IELTS + PTE topics,<br />
        generate a 7-day content plan, and start building content.
      </p>
      <button onClick={onRun} style={{
        padding: '12px 28px', background: BRAND.gradGold, border: 'none',
        borderRadius: 10, color: '#08162b', fontSize: 14, fontWeight: 700,
        cursor: 'pointer', fontFamily: BRAND.font,
      }}>
        Run Research Now
      </button>
    </div>
  );
}

function LoadingState({ message = 'Analysing trending IELTS + PTE topics…' }) {
  const steps = [
    'Scanning IELTS pain point database…',
    'Analysing PTE market trends…',
    'Scoring content momentum…',
    'Building content suggestions…',
    'Generating 7-day plan…',
  ];
  const [step, setStep] = useState(0);
  useState(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 600);
    return () => clearInterval(id);
  });
  return (
    <div style={{
      textAlign: 'center', padding: '48px 32px',
      background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, ${BRAND.bg} 100%)`,
      border: `1px solid ${BRAND.borderGold}`, borderRadius: 20,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-block', marginBottom: 20 }}>
        <Icon d={ICONS.refresh} size={36} color={BRAND.gold} />
      </motion.div>
      <h3 style={{ color: BRAND.white, fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
        {message}
      </h3>
      <motion.p
        key={step}
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        style={{ color: BRAND.dim, fontSize: 13, margin: 0 }}>
        {steps[step]}
      </motion.p>
    </div>
  );
}

function WeekSummary({ data }) {
  const s = data.weekSummary;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, rgba(241,196,15,0.04) 100%)`,
      border: `1px solid ${BRAND.borderGold}`, borderRadius: 16,
      padding: '20px 24px', marginBottom: 24,
      display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center',
    }}>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontSize: 11, color: BRAND.dim, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
          Week {data.weekNumber} Research
        </div>
        <div style={{ fontSize: 15, color: BRAND.white, fontWeight: 700 }}>{data.generatedAt}</div>
        <div style={{ fontSize: 12, color: BRAND.dim, marginTop: 2 }}>Next: {data.nextRefresh}</div>
      </div>
      {[
        { label: 'IELTS Topics', value: s.ieltsCount, color: BRAND.gold },
        { label: 'PTE Topics',   value: s.pteCount,   color: BRAND.teal },
        { label: 'Avg Momentum', value: s.avgMomentum + '%', color: BRAND.white },
      ].map(stat => (
        <div key={stat.label} style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
          <div style={{ fontSize: 11, color: BRAND.dim, fontWeight: 600 }}>{stat.label}</div>
        </div>
      ))}
      <div style={{
        flex: '0 0 200px', background: BRAND.goldDim, borderRadius: 10, padding: '12px 16px',
        border: `1px solid ${BRAND.borderGold}`,
      }}>
        <div style={{ fontSize: 10, color: BRAND.gold, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
          🔥 Top Topic
        </div>
        <div style={{ fontSize: 13, color: BRAND.white, fontWeight: 700 }}>{s.topExam} — {s.topTopic}</div>
      </div>
    </div>
  );
}

function MarketSignalCard({ signal }) {
  return (
    <div style={{
      background: BRAND.tealDim, border: `1px solid ${BRAND.borderTeal}`,
      borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{ fontSize: 12, color: BRAND.teal, fontWeight: 700, marginBottom: 6 }}>
        {signal.signal}
      </div>
      <div style={{ fontSize: 12, color: BRAND.white, fontWeight: 600, marginBottom: 4 }}>
        → {signal.impact}
      </div>
      <div style={{ fontSize: 11, color: BRAND.dim }}>
        💡 {signal.opportunity}
      </div>
    </div>
  );
}

function TrendCard({ trend, rank, onGenerate }) {
  const [expanded, setExpanded] = useState(false);
  const examColor = EXAM_COLOR[trend.exam] || BRAND.gold;
  const momentum = trend.momentum;

  return (
    <motion.div
      layout
      style={{
        background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, ${BRAND.bg} 100%)`,
        border: `1px solid ${expanded ? examColor + '44' : BRAND.border}`,
        borderRadius: 14, overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}>
      {/* Card Header */}
      <button onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}>
        {/* Rank */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: rank <= 3 ? examColor + '22' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${rank <= 3 ? examColor + '44' : BRAND.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 900, color: rank <= 3 ? examColor : BRAND.dim,
        }}>
          {rank}
        </div>

        {/* Exam badge */}
        <div style={{
          padding: '3px 10px', borderRadius: 20, flexShrink: 0,
          background: examColor + '18', border: `1px solid ${examColor}44`,
          fontSize: 11, fontWeight: 800, color: examColor, letterSpacing: '0.5px',
        }}>
          {trend.exam}
        </div>

        {/* Topic */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.white, marginBottom: 2 }}>
            {trend.topic}
          </div>
          <div style={{ fontSize: 12, color: BRAND.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {trend.hook}
          </div>
        </div>

        {/* Momentum bar */}
        <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 70 }}>
          <div style={{ fontSize: 11, color: examColor, fontWeight: 700, marginBottom: 4 }}>
            {momentum >= 90 ? '🔥 Hot' : momentum >= 80 ? '📈 Rising' : '⚡ Steady'}
          </div>
          <div style={{ height: 4, width: 64, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${momentum}%`, background: examColor, borderRadius: 4 }} />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}>
            <div style={{
              borderTop: `1px solid ${BRAND.border}`, padding: '16px 20px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            }}>
              <InfoBlock label="Pain Point" value={trend.painPoint} color={BRAND.dim} />
              <InfoBlock label="Key Stat" value={trend.stat} color={examColor} />
              <InfoBlock label="Insight" value={trend.insight} color={BRAND.dim} span={2} />
              <InfoBlock label="The Fix" value={trend.fix} color={BRAND.teal} span={2} />
              
              {/* Generate buttons */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, marginTop: 4 }}>
                {trend.formats.map(fmt => (
                  <motion.button key={fmt}
                    onClick={() => onGenerate(fmt)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 8, border: `1px solid ${examColor}44`,
                      background: examColor + '14', color: examColor,
                      fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
                    }}>
                    <Icon d={FORMAT_ICON[fmt] || ICONS.spark} size={12} color={examColor} />
                    Generate {FORMAT_LABEL[fmt]}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoBlock({ label, value, color, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <div style={{ fontSize: 10, color: BRAND.dimmer, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function PlanDayCard({ day, onGenerate }) {
  const examColor = EXAM_COLOR[day.exam] || BRAND.gold;
  const formatIcon = FORMAT_ICON[day.format] || ICONS.spark;

  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      background: BRAND.bgCard, border: `1px solid ${BRAND.border}`,
      borderRadius: 14, padding: '16px 20px',
    }}>
      {/* Day badge */}
      <div style={{
        flexShrink: 0, width: 48, textAlign: 'center',
        background: examColor + '18', border: `1px solid ${examColor}44`,
        borderRadius: 10, padding: '8px 4px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: examColor, letterSpacing: '0.5px' }}>{day.shortDay}</div>
        <div style={{ fontSize: 10, color: BRAND.dim, marginTop: 2 }}>{day.postTime}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
            background: examColor + '18', color: examColor, letterSpacing: '0.5px',
          }}>{day.exam}</span>
          <span style={{
            padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
            background: 'rgba(255,255,255,0.06)', color: BRAND.dim,
          }}>{FORMAT_LABEL[day.format]}</span>
          <span style={{ fontSize: 11, color: BRAND.dimmer }}>{day.category}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.white, marginBottom: 3 }}>
          {day.topic}
        </div>
        <div style={{ fontSize: 12, color: BRAND.dim, marginBottom: 10 }}>
          "{day.hook}"
        </div>

        {/* Format picker + generate */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['carousel', 'infographic', 'reel'].map(fmt => (
            <motion.button key={fmt}
              onClick={() => onGenerate(day, fmt)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 8,
                border: `1px solid ${fmt === day.format ? examColor + '66' : BRAND.border}`,
                background: fmt === day.format ? examColor + '18' : 'rgba(255,255,255,0.03)',
                color: fmt === day.format ? examColor : BRAND.dim,
                fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
              }}>
              <Icon d={FORMAT_ICON[fmt]} size={11} color={fmt === day.format ? examColor : BRAND.dim} />
              {FORMAT_LABEL[fmt]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  GENERATED CONTENT VIEW
// ─────────────────────────────────────────────────────────────────────────────
function GeneratedContentView({ content, dayData, format, onCopyCaption, copied, onBack, onRegenerate }) {
  const examColor = EXAM_COLOR[dayData?.exam] || BRAND.gold;
  const [captionCopied, setCaptionCopied] = useState(false);
  const [hashCopied, setHashCopied]       = useState(false);

  const copyText = (text, setter) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    }).catch(() => {});
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`,
          borderRadius: 8, color: BRAND.dim, fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: BRAND.font,
        }}>
          ← Back to Plan
        </button>
        <span style={{ color: BRAND.border }}>·</span>
        <span style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: examColor + '18', color: examColor,
        }}>{dayData?.exam}</span>
        <span style={{ fontSize: 13, color: BRAND.dim, fontWeight: 600 }}>{dayData?.topic}</span>
        <button onClick={onRegenerate} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`,
          borderRadius: 8, color: BRAND.dim, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: BRAND.font,
        }}>
          <Icon d={ICONS.refresh} size={12} color={BRAND.dim} />
          Regenerate
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        
        {/* Left: Preview */}
        <div>
          <SectionLabel icon={ICONS.eye} label="Preview" color={examColor} />
          {content.type === 'carousel' && (
            <CarouselPreview data={content.data} examColor={examColor} />
          )}
          {content.type === 'infographic' && (
            <InfographicPreview data={content.data} examColor={examColor} />
          )}
          {content.type === 'reel' && (
            <ReelScriptView data={content.data} examColor={examColor} />
          )}
        </div>

        {/* Right: Caption + Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Caption Box */}
          <div style={{
            background: BRAND.bgCard, border: `1px solid ${BRAND.border}`, borderRadius: 14,
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: `1px solid ${BRAND.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon d={ICONS.caption} size={14} color={BRAND.dim} />
                <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.dim }}>Instagram Caption</span>
              </div>
              <button onClick={() => copyText(content.caption, setCaptionCopied)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                background: captionCopied ? BRAND.tealDim : 'rgba(255,255,255,0.05)',
                border: `1px solid ${captionCopied ? BRAND.borderTeal : BRAND.border}`,
                borderRadius: 6, color: captionCopied ? BRAND.teal : BRAND.dim,
                fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: BRAND.font,
              }}>
                <Icon d={captionCopied ? ICONS.check : ICONS.copy} size={11} color={captionCopied ? BRAND.teal : BRAND.dim} />
                {captionCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{
              padding: '14px 16px', fontSize: 12, color: BRAND.dim,
              lineHeight: 1.7, maxHeight: 220, overflowY: 'auto',
              whiteSpace: 'pre-wrap', fontFamily: 'monospace',
            }}>
              {content.caption}
            </div>
          </div>

          {/* Hashtags */}
          <div style={{
            background: BRAND.bgCard, border: `1px solid ${BRAND.border}`, borderRadius: 14,
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: `1px solid ${BRAND.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.dim }}>Hashtags</span>
              <button onClick={() => copyText(content.hashtags?.join(' ') || '', setHashCopied)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                background: hashCopied ? BRAND.tealDim : 'rgba(255,255,255,0.05)',
                border: `1px solid ${hashCopied ? BRAND.borderTeal : BRAND.border}`,
                borderRadius: 6, color: hashCopied ? BRAND.teal : BRAND.dim,
                fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: BRAND.font,
              }}>
                <Icon d={hashCopied ? ICONS.check : ICONS.copy} size={11} color={hashCopied ? BRAND.teal : BRAND.dim} />
                {hashCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {content.hashtags?.map(h => (
                <span key={h} style={{
                  padding: '3px 10px', borderRadius: 20,
                  background: examColor + '14', color: examColor,
                  fontSize: 11, fontWeight: 600,
                }}>{h}</span>
              ))}
            </div>
          </div>

          {/* Best Post Time */}
          <div style={{
            background: BRAND.goldDim, border: `1px solid ${BRAND.borderGold}`,
            borderRadius: 12, padding: '12px 16px',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <Icon d={ICONS.zap} size={16} color={BRAND.gold} />
            <div>
              <div style={{ fontSize: 11, color: BRAND.gold, fontWeight: 700 }}>Best Post Time</div>
              <div style={{ fontSize: 13, color: BRAND.white, fontWeight: 600 }}>{dayData?.postTime || '7:00 AM'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reel Script View ─────────────────────────────────────────────────────────
function ReelScriptView({ data, examColor }) {
  const [copying, setCopying] = useState(false);
  
  const downloadScript = () => {
    const text = [
      `// ${data.exam} REEL SCRIPT — ${data.topic}`,
      `// Duration: ${data.duration}`,
      `// ${data.createdAt}`,
      `// Generated by @viatestprep Content Studio`,
      '',
      ...data.scenes.map(s =>
        `[${s.label}] ${s.timeCode}\nSCRIPT: ${s.script}\nVISUAL: ${s.visual}\nCAPTION: ${s.caption}\nDIRECTOR: ${s.dirNote}\n`
      ),
      '---',
      `FILMING: ${data.filmingSetup}`,
      `EDITING: ${data.editingNote}`,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `VIA-Script-${data.topic.replace(/\s+/g,'-')}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: BRAND.white, fontWeight: 700 }}>
          {data.topic} · {data.duration}
        </div>
        <motion.button onClick={downloadScript}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: BRAND.gradGold, border: 'none', borderRadius: 8,
            color: '#08162b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
          }}>
          <Icon d={ICONS.download} size={13} color="#08162b" />
          Download Script
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.scenes.map((scene, i) => (
          <motion.div key={scene.id}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: BRAND.bgCard, border: `1px solid ${i === 0 ? examColor + '44' : BRAND.border}`,
              borderRadius: 12, overflow: 'hidden',
            }}>
            <div style={{
              display: 'flex', gap: 12, alignItems: 'center', padding: '10px 16px',
              background: i === 0 ? examColor + '10' : 'transparent',
              borderBottom: `1px solid ${BRAND.border}`,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 800, color: examColor,
                letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>{scene.label}</span>
              <span style={{ fontSize: 11, color: BRAND.dimmer }}>{scene.timeCode}</span>
              {scene.caption && (
                <span style={{ marginLeft: 'auto', fontSize: 11, color: BRAND.dim }}>{scene.caption}</span>
              )}
            </div>
            <div style={{ padding: '12px 16px', display: 'grid', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: BRAND.dimmer, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: 3 }}>Script</div>
                <div style={{ fontSize: 13, color: BRAND.white, lineHeight: 1.6, fontWeight: 600 }}>"{scene.script}"</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: BRAND.dimmer, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: 3 }}>Visual Direction</div>
                  <div style={{ fontSize: 12, color: BRAND.dim, lineHeight: 1.5 }}>{scene.visual}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: BRAND.dimmer, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: 3 }}>Director Note</div>
                  <div style={{ fontSize: 12, color: BRAND.dim, lineHeight: 1.5 }}>{scene.dirNote}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filming + Editing notes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        {[
          { label: '🎥 Filming Setup', value: data.filmingSetup },
          { label: '✂️ Editing Note', value: data.editingNote },
        ].map(note => (
          <div key={note.label} style={{
            background: BRAND.bgCard, border: `1px solid ${BRAND.border}`,
            borderRadius: 12, padding: '12px 16px',
          }}>
            <div style={{ fontSize: 11, color: BRAND.gold, fontWeight: 700, marginBottom: 6 }}>{note.label}</div>
            <div style={{ fontSize: 12, color: BRAND.dim, lineHeight: 1.5 }}>{note.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
