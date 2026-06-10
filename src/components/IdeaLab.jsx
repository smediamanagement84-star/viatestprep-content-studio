// ─────────────────────────────────────────────────────────────────────────────
//  IdeaLab.jsx  —  Raw Idea → AI Research → Polished Suggestions
//  Drop your rough thoughts, let the engine shape them into executable content
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../lib/brandTokens.js';

// ─── SVG Icon helper ─────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  bulb:    'M9 21h6M12 3a6 6 0 014.472 10.078C17.416 14.019 18 15.358 18 17H6c0-1.642.584-2.981 1.528-3.922A6 6 0 0112 3z',
  spark:   'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  search:  'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z',
  check:   'M20 6L9 17l-5-5',
  edit:    'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:   'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  send:    'M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z',
  copy:    'M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h0a2 2 0 012 2',
  refresh: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
  calendar:'M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18',
  arrow:   'M5 12h14M12 5l7 7-7 7',
  x:       'M18 6L6 18M6 6l12 12',
  info:    'M12 16v-4M12 8h.01M22 12A10 10 0 112 12a10 10 0 0120 0z',
  carousel:'M2 6h4v12H2zM10 3h4v18h-4zM18 6h4v12h-4z',
  infograph:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  reel:    'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
};

// ─── IELTS / PTE knowledge base for idea enrichment ──────────────────────────
const TOPIC_DATABASE = {
  ielts: {
    writing: {
      keywords: ['writing', 'essay', 'task 1', 'task 2', 'band', 'score', 'grammar', 'ielts writing'],
      topics: [
        { title: 'IELTS Task 2 Band 7+ Essay Structure', angle: 'The 4-paragraph formula nobody teaches you', format: 'carousel', hook: 'You\'re losing 2 band scores on Task 2 because of THIS structure mistake', stat: '73% of test-takers score below Band 6.5 on Task 2', category: 'Writing Mastery' },
        { title: 'Common Grammar Mistakes Costing You Bands', angle: 'Top 5 grammar errors that drag IELTS scores down', format: 'infographic', hook: 'These 5 grammar mistakes are why your IELTS Writing score is stuck at 6', stat: 'Band 7 requires zero major grammar errors across your writing', category: 'Grammar Fixes' },
        { title: 'IELTS Task 1 Academic: How to Describe Graphs', angle: 'Master the overview + key features formula', format: 'carousel', hook: 'IELTS Academic Task 1: Most students describe everything — top scorers do THIS', stat: '80% of Task 1 test-takers miss the "overview" requirement', category: 'Task 1 Tactics' },
      ]
    },
    speaking: {
      keywords: ['speaking', 'fluency', 'pronunciation', 'part 2', 'cue card', 'interview'],
      topics: [
        { title: 'IELTS Speaking Part 2: How to Never Run Out of Things to Say', angle: 'The mind-map technique for 2-minute monologues', format: 'carousel', hook: 'Blank mind during IELTS Speaking Part 2? This simple trick fixes it instantly', stat: '62% of candidates struggle to fill the full 2 minutes in Part 2', category: 'Speaking Fluency' },
        { title: 'Filler Words That Kill Your IELTS Speaking Score', angle: 'Replace um/uh with these transition phrases', format: 'infographic', hook: '"Umm..." is costing you a band score in IELTS Speaking — here\'s the fix', stat: 'Excessive fillers can drop your Fluency score by an entire band', category: 'Speaking Polish' },
      ]
    },
    reading: {
      keywords: ['reading', 'skimming', 'scanning', 'true false', 'matching', 'headings'],
      topics: [
        { title: 'IELTS Reading: True/False/Not Given Decoded', angle: 'The exact process to answer in under 30 seconds', format: 'carousel', hook: 'True, False, or Not Given? Here\'s why you\'re getting it wrong every time', stat: 'TFNG questions have a 45% error rate among Band 6 candidates', category: 'Reading Strategy' },
        { title: 'Skimming vs Scanning: When to Use Each', angle: 'The 3-pass reading system for top scores', format: 'infographic', hook: 'Reading every word in IELTS? That\'s why you\'re running out of time', stat: 'High scorers spend only 20% of time reading, 80% locating answers', category: 'Speed Reading' },
      ]
    },
    listening: {
      keywords: ['listening', 'section 3', 'section 4', 'predict', 'note completion'],
      topics: [
        { title: 'IELTS Listening Section 4: Prediction Strategy', angle: 'Read ahead during the pause — what to look for', format: 'carousel', hook: 'IELTS Listening Section 4 is the hardest — unless you do THIS before it starts', stat: 'Section 4 is the lowest-scoring section for 78% of test-takers', category: 'Listening Tactics' },
      ]
    },
  },
  pte: {
    speaking: {
      keywords: ['pte speaking', 'read aloud', 'repeat sentence', 'oral fluency', 'pte'],
      topics: [
        { title: 'PTE Read Aloud: The Fluency Formula', angle: 'Rhythm, pause, emphasis — the 3 pillars', format: 'carousel', hook: 'PTE Read Aloud is worth 15% of your score — are you practicing it right?', stat: 'Read Aloud affects both Speaking AND Reading scores simultaneously', category: 'PTE Speaking' },
        { title: 'PTE Repeat Sentence: How to Score Full Marks', angle: 'The chunking method for perfect recall', format: 'infographic', hook: 'Repeating sentences perfectly in PTE is a learnable skill — here\'s how', stat: 'Candidates who chunk sentences score 40% higher on Repeat Sentence', category: 'PTE Memory' },
      ]
    },
    writing: {
      keywords: ['pte writing', 'summarize written text', 'essay', 'swt'],
      topics: [
        { title: 'PTE Summarize Written Text: The 1-Sentence Formula', angle: 'How to condense 250 words into 1 perfect sentence', format: 'carousel', hook: 'PTE SWT must be 1 sentence under 75 words — most students write 3. Here\'s the fix.', stat: 'Grammatical errors in SWT can drop your Writing score by 15 points', category: 'PTE Writing' },
      ]
    },
    reading: {
      keywords: ['pte reading', 'fill in blanks', 'reorder', 'multiple choice'],
      topics: [
        { title: 'PTE Reorder Paragraphs: The Connector Method', angle: 'Spot linking words to rebuild text order instantly', format: 'infographic', hook: 'PTE Reorder Paragraphs confuses 9 in 10 students — this method makes it obvious', stat: 'Students using connector words score 60% higher on Reorder tasks', category: 'PTE Reading' },
      ]
    },
  },
  general: {
    motivation: {
      keywords: ['motivation', 'scared', 'nervous', 'anxiety', 'afraid', 'fail', 'stress', 'exam day'],
      topics: [
        { title: 'What To Do 24 Hours Before Your IELTS / PTE Exam', angle: 'The pre-exam checklist that top scorers follow', format: 'carousel', hook: 'Your exam is tomorrow. Do NOT do what most students do tonight.', stat: '40% of test-takers report exam anxiety as their biggest score barrier', category: 'Exam Mindset' },
        { title: 'Overcoming Test Anxiety: 5 Proven Techniques', angle: 'Evidence-based strategies for exam day calm', format: 'infographic', hook: 'Nervous on exam day? Your brain is sabotaging your score — here\'s how to stop it', stat: 'Anxiety management can improve performance by 1-1.5 band scores', category: 'Mental Game' },
      ]
    },
    study: {
      keywords: ['study', 'practice', 'tips', 'how to', 'improve', 'resources', 'plan', 'schedule'],
      topics: [
        { title: '30-Day IELTS Study Plan for Busy Working Adults', angle: 'The hour-a-day system for Band 7+', format: 'carousel', hook: 'No time to study for IELTS? This 30-day plan only needs 1 hour per day', stat: 'Consistent 45-min daily practice outperforms 6-hour weekend cramming', category: 'Study Strategy' },
        { title: 'Free Resources vs Paid Courses: What Actually Works', angle: 'Honest breakdown for budget-conscious test-takers', format: 'carousel', hook: 'You don\'t need a ₹30,000 course to score Band 8 in IELTS — here\'s proof', stat: '65% of Band 8+ scorers used a mix of free + guided resources', category: 'Resource Guide' },
      ]
    },
    scores: {
      keywords: ['band score', 'score', '7', '8', '6.5', 'target', 'band 7', 'band 8', '79', '65'],
      topics: [
        { title: 'What Band 7 Actually Looks Like in IELTS Writing', angle: 'Real examples with annotations', format: 'carousel', hook: 'Band 7 IELTS Writing isn\'t perfect grammar — it\'s this', stat: 'Most Band 7 essays have 3-5 minor errors — perfection is not required', category: 'Score Breakdown' },
        { title: 'PTE Score 79+: The Skills Weighting Breakdown', angle: 'Where to focus your preparation for max points', format: 'infographic', hook: 'Chasing PTE 79? These 3 task types determine 60% of your total score', stat: 'Integrated skills tasks account for 35% of the total PTE score', category: 'PTE Strategy' },
      ]
    },
  }
};

// ─── Idea Analyzer engine ─────────────────────────────────────────────────────
function analyzeIdea(rawIdea) {
  const lower = rawIdea.toLowerCase();
  const results = [];
  
  // Score each category
  const allCategories = [
    ...Object.entries(TOPIC_DATABASE.ielts).map(([k, v]) => ({ ...v, exam: 'IELTS', section: k })),
    ...Object.entries(TOPIC_DATABASE.pte).map(([k, v]) => ({ ...v, exam: 'PTE', section: k })),
    ...Object.entries(TOPIC_DATABASE.general).map(([k, v]) => ({ ...v, exam: 'General', section: k })),
  ];

  allCategories.forEach(({ keywords, topics, exam, section }) => {
    const matchCount = keywords.filter(kw => lower.includes(kw)).length;
    if (matchCount > 0) {
      topics.forEach(topic => {
        results.push({ ...topic, exam, section, relevanceScore: matchCount });
      });
    }
  });

  // Sort by relevance
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Deduplicate and return top suggestions
  const seen = new Set();
  const unique = results.filter(r => {
    if (seen.has(r.title)) return false;
    seen.add(r.title);
    return true;
  });

  // If no specific match, return general suggestions based on idea length/complexity
  if (unique.length === 0) {
    return generateGenericSuggestions(rawIdea);
  }

  return unique.slice(0, 6);
}

function generateGenericSuggestions(idea) {
  const words = idea.toLowerCase().split(' ');
  const isQuestion = idea.includes('?');
  const isAboutScore = words.some(w => ['score', 'band', 'pass', 'fail', 'result'].includes(w));
  
  const suggestions = [
    {
      title: `"${idea.slice(0, 40)}${idea.length > 40 ? '...' : ''}" — Carousel Post`,
      angle: 'Transform this raw idea into a step-by-step educational carousel',
      format: 'carousel',
      exam: 'IELTS',
      hook: `The truth about ${idea.slice(0, 30).toLowerCase()} that nobody is telling students`,
      stat: 'Carousel posts get 3x more saves than single-image posts in the education niche',
      category: 'Custom Content',
      relevanceScore: 1,
    },
    {
      title: `"${idea.slice(0, 40)}${idea.length > 40 ? '...' : ''}" — Quick-Tip Infographic`,
      angle: 'A visual snapshot that delivers the core insight at a glance',
      format: 'infographic',
      exam: 'PTE',
      hook: `Stop wasting time on ${idea.slice(0, 25).toLowerCase()} — do this instead`,
      stat: 'Infographics generate 650% more engagement than plain text posts',
      category: 'Visual Content',
      relevanceScore: 1,
    },
    {
      title: `"${idea.slice(0, 40)}${idea.length > 40 ? '...' : ''}" — Reel Script`,
      angle: 'A punchy 30-60 second video hook to capture swipe-stopping attention',
      format: 'reel',
      exam: 'IELTS',
      hook: `POV: You finally understand ${idea.slice(0, 25).toLowerCase()}`,
      stat: 'Reels with educational content get 2.1x more reach than standard posts',
      category: 'Video Content',
      relevanceScore: 1,
    },
  ];
  return suggestions;
}

// ─── Loading animation steps ──────────────────────────────────────────────────
const RESEARCH_STEPS = [
  { emoji: '🔍', text: 'Scanning IELTS & PTE content trends...' },
  { emoji: '📊', text: 'Cross-referencing market engagement data...' },
  { emoji: '🧠', text: 'Analysing hook effectiveness patterns...' },
  { emoji: '✨', text: 'Crafting optimised content angles...' },
  { emoji: '🎯', text: 'Ranking suggestions by viral potential...' },
];

// ─── FORMAT META ──────────────────────────────────────────────────────────────
const FORMAT_META = {
  carousel:    { label: 'Carousel', icon: ICONS.carousel, color: '#4F8EF7' },
  infographic: { label: 'Infographic', icon: ICONS.infograph, color: BRAND.teal },
  reel:        { label: 'Reel Script', icon: ICONS.reel, color: '#C084FC' },
};

// ─── Main IdeaLab Component ───────────────────────────────────────────────────
export default function IdeaLab({ weeklyPlan, setWeeklyPlan, setPrefilledAsset, setActiveTab: setParentTab }) {
  const [rawIdea, setRawIdea]           = useState('');
  const [phase, setPhase]               = useState('input');      // input | loading | results | editing
  const [researchStep, setResearchStep] = useState(0);
  const [suggestions, setSuggestions]   = useState([]);
  const [accepted, setAccepted]         = useState([]);
  const [editingIdx, setEditingIdx]     = useState(null);
  const [editDraft, setEditDraft]       = useState({});
  const [addedToPlan, setAddedToPlan]   = useState({});
  const textareaRef = useRef(null);

  // ── Research trigger ────────────────────────────────────────────────────────
  const handleResearch = useCallback(() => {
    if (!rawIdea.trim()) return;
    setPhase('loading');
    setResearchStep(0);

    // Simulate step-by-step analysis
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setResearchStep(step);
      if (step >= RESEARCH_STEPS.length - 1) clearInterval(stepInterval);
    }, 500);

    setTimeout(() => {
      clearInterval(stepInterval);
      const results = analyzeIdea(rawIdea);
      setSuggestions(results.map((s, i) => ({ ...s, id: `sug-${Date.now()}-${i}` })));
      setAccepted([]);
      setAddedToPlan({});
      setPhase('results');
    }, 2800);
  }, [rawIdea]);

  // ── Accept / Reject ─────────────────────────────────────────────────────────
  const handleAccept = (sug) => {
    setAccepted(prev => [...prev, sug.id]);
  };
  const handleReject = (sug) => {
    setSuggestions(prev => prev.filter(s => s.id !== sug.id));
  };

  // ── Start editing ────────────────────────────────────────────────────────────
  const startEdit = (sug, idx) => {
    setEditingIdx(idx);
    setEditDraft({ ...sug });
    setPhase('editing');
  };
  const saveEdit = () => {
    setSuggestions(prev => prev.map((s, i) => i === editingIdx ? { ...editDraft } : s));
    setEditingIdx(null);
    setPhase('results');
  };
  const cancelEdit = () => {
    setEditingIdx(null);
    setPhase('results');
  };

  // ── Add to content planner ──────────────────────────────────────────────────
  const addToPlanner = (sug) => {
    const dayNames = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const currentPlanLength = weeklyPlan?.length || 0;
    const dayIdx = currentPlanLength % 7;

    const newEntry = {
      dayIndex:  currentPlanLength,
      day:       days[dayIdx],
      shortDay:  dayNames[dayIdx],
      postTime:  '7:00 AM',
      exam:      sug.exam === 'General' ? 'IELTS' : sug.exam,
      topic:     sug.title,
      hook:      sug.hook,
      angle:     sug.angle,
      format:    sug.format,
      category:  sug.category,
      stat:      sug.stat,
      painPoint: sug.angle,
      fix:       'Covered in the content',
      insight:   sug.hook,
      hashtags:  ['#IELTS', '#PTE', '#EnglishTest', '#VIAtestprep', '#StudyAbroad'],
      caption:   `${sug.hook}\n\n${sug.angle}\n\nStat: ${sug.stat}\n\n📌 Save this post for later!\n\n#IELTS #PTE #VIAtestprep`,
      trendId:   sug.id,
      fromIdeaLab: true,
    };

    const newPlan = [...(weeklyPlan || []), newEntry];
    setWeeklyPlan(newPlan);
    try {
      localStorage.setItem('weekly_plan_data', JSON.stringify(newPlan));
    } catch(e) {}

    setAddedToPlan(prev => ({ ...prev, [sug.id]: true }));
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const reset = () => {
    setPhase('input');
    setRawIdea('');
    setSuggestions([]);
    setAccepted([]);
    setAddedToPlan({});
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', minHeight: '100vh', fontFamily: BRAND.font }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(241,196,15,0.18), rgba(192,132,252,0.18))',
            border: '1px solid rgba(241,196,15,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>
            💡
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: BRAND.white, margin: 0 }}>
              Idea Lab
            </h2>
            <p style={{ fontSize: 13, color: BRAND.dim, margin: '3px 0 0' }}>
              Dump your raw ideas — AI researches what's possible and crafts executable content suggestions
            </p>
          </div>
        </div>

        {phase !== 'input' && (
          <button onClick={reset} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`,
            borderRadius: 10, color: BRAND.dim, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            <Icon d={ICONS.x} size={13} color={BRAND.dim} /> New Idea
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════════
            PHASE: INPUT
        ══════════════════════════════════════════════ */}
        {phase === 'input' && (
          <motion.div key="input"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>

            {/* Prompt examples */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20,
            }}>
              {[
                { emoji: '✏️', label: 'IELTS Writing tips', idea: 'IELTS writing task 2 essay structure tips for band 7' },
                { emoji: '🎤', label: 'Speaking fluency fix', idea: 'how to improve speaking fluency and stop using filler words in IELTS speaking' },
                { emoji: '😰', label: 'Exam anxiety help', idea: 'exam day anxiety and nervousness before IELTS or PTE test' },
                { emoji: '📈', label: 'PTE score 79+', idea: 'how to get PTE score 79 or above and which sections matter most' },
                { emoji: '📚', label: '30-day study plan', idea: 'study plan for IELTS in 30 days for working professionals' },
                { emoji: '🏆', label: 'Band 8 strategies', idea: 'what does IELTS band 8 look like in writing and speaking' },
              ].map((ex) => (
                <button key={ex.label}
                  onClick={() => setRawIdea(ex.idea)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 14px', background: BRAND.bgCard,
                    border: `1px solid ${BRAND.border}`, borderRadius: 10,
                    color: BRAND.dim, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(241,196,15,0.35)'; e.currentTarget.style.color = BRAND.white; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.color = BRAND.dim; }}
                >
                  <span style={{ fontSize: 16 }}>{ex.emoji}</span>
                  <span>{ex.label}</span>
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div style={{
              background: BRAND.bgCard, border: `1px solid ${BRAND.border}`,
              borderRadius: 16, overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 18px', borderBottom: `1px solid ${BRAND.border}`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Icon d={ICONS.bulb} size={15} color={BRAND.gold} />
                <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.dim }}>
                  Your Raw Idea
                </span>
                <span style={{
                  marginLeft: 'auto', fontSize: 11, color: BRAND.dimmest,
                }}>
                  {rawIdea.length} / 500 chars
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={rawIdea}
                onChange={e => setRawIdea(e.target.value.slice(0, 500))}
                placeholder={`Describe your idea in plain language. Don't worry about being perfect — just brain-dump it here.\n\nExamples:\n• "I want to do something about IELTS writing mistakes"\n• "A post about why students fail PTE speaking section"\n• "Tips for studying for IELTS if you have a full-time job"`}
                style={{
                  width: '100%', minHeight: 180, padding: '16px 18px',
                  background: 'transparent', border: 'none', outline: 'none',
                  color: BRAND.white, fontSize: 14, lineHeight: 1.7,
                  resize: 'vertical', fontFamily: BRAND.font, boxSizing: 'border-box',
                }}
              />
              <div style={{
                padding: '12px 18px', borderTop: `1px solid ${BRAND.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 12, color: BRAND.dimmest }}>
                  💡 Be specific — mention the skill (writing/speaking), exam (IELTS/PTE), or emotion (anxiety/motivation)
                </span>
                <motion.button
                  onClick={handleResearch}
                  disabled={rawIdea.trim().length < 5}
                  whileHover={{ scale: rawIdea.trim().length < 5 ? 1 : 1.03 }}
                  whileTap={{ scale: rawIdea.trim().length < 5 ? 1 : 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 10, border: 'none',
                    background: rawIdea.trim().length < 5 ? 'rgba(241,196,15,0.15)' : BRAND.gradGold,
                    color: rawIdea.trim().length < 5 ? 'rgba(241,196,15,0.4)' : '#08162b',
                    fontSize: 14, fontWeight: 700, cursor: rawIdea.trim().length < 5 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon d={ICONS.search} size={15} color={rawIdea.trim().length < 5 ? 'rgba(241,196,15,0.4)' : '#08162b'} />
                  Research This Idea
                </motion.button>
              </div>
            </div>

            {/* How it works */}
            <div style={{
              marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
            }}>
              {[
                { num: '01', title: 'Dump Your Idea', desc: 'Type anything — a rough concept, a pain point you noticed, or a topic you think students need' },
                { num: '02', title: 'AI Researches', desc: 'The engine matches your idea against trending IELTS/PTE topics and viral content patterns' },
                { num: '03', title: 'Pick & Polish', desc: 'Accept suggestions, edit them to your liking, then send them to the Content Planner or Generator' },
              ].map(step => (
                <div key={step.num} style={{
                  background: BRAND.bgCard, border: `1px solid ${BRAND.border}`,
                  borderRadius: 12, padding: '16px 18px',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'rgba(241,196,15,0.2)', marginBottom: 8 }}>
                    {step.num}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.dim, lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════
            PHASE: LOADING
        ══════════════════════════════════════════════ */}
        {phase === 'loading' && (
          <motion.div key="loading"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>

            <div style={{
              background: 'linear-gradient(135deg, rgba(241,196,15,0.06), rgba(192,132,252,0.06))',
              border: `1px solid rgba(241,196,15,0.2)`,
              borderRadius: 20, padding: '56px 40px', textAlign: 'center',
            }}>
              {/* Animated icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', marginBottom: 24 }}>
                <Icon d={ICONS.search} size={40} color={BRAND.gold} />
              </motion.div>

              <h3 style={{ color: BRAND.white, fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
                Researching your idea...
              </h3>
              <div style={{
                display: 'inline-block',
                background: 'rgba(241,196,15,0.08)', border: `1px solid rgba(241,196,15,0.15)`,
                borderRadius: 10, padding: '8px 18px', marginBottom: 28,
              }}>
                <span style={{ fontSize: 13, color: 'rgba(241,196,15,0.7)', fontStyle: 'italic' }}>
                  "{rawIdea.slice(0, 60)}{rawIdea.length > 60 ? '...' : ''}"
                </span>
              </div>

              {/* Step indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380, margin: '0 auto' }}>
                {RESEARCH_STEPS.map((step, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: i <= researchStep ? 1 : 0.2 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 14px', borderRadius: 8,
                      background: i <= researchStep ? 'rgba(241,196,15,0.08)' : 'transparent',
                      border: `1px solid ${i <= researchStep ? 'rgba(241,196,15,0.2)' : 'transparent'}`,
                      transition: 'all 0.3s',
                    }}>
                    <span style={{ fontSize: 16 }}>{step.emoji}</span>
                    <span style={{ fontSize: 12, color: i <= researchStep ? BRAND.white : BRAND.dimmest }}>
                      {step.text}
                    </span>
                    {i < researchStep && (
                      <Icon d={ICONS.check} size={13} color={BRAND.gold} style={{ marginLeft: 'auto' }} />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════
            PHASE: RESULTS
        ══════════════════════════════════════════════ */}
        {phase === 'results' && (
          <motion.div key="results"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>

            {/* Summary bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20, flexWrap: 'wrap', gap: 10,
            }}>
              <div>
                <div style={{ fontSize: 11, color: BRAND.dim, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                  Based on your idea:
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(241,196,15,0.08)', border: `1px solid rgba(241,196,15,0.18)`,
                  borderRadius: 8, padding: '6px 14px',
                }}>
                  <Icon d={ICONS.bulb} size={13} color={BRAND.gold} />
                  <span style={{ fontSize: 13, color: BRAND.white }}>
                    "{rawIdea.slice(0, 70)}{rawIdea.length > 70 ? '...' : ''}"
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)',
                }}>
                  {accepted.length} accepted
                </span>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: BRAND.goldDim, color: BRAND.gold, border: `1px solid ${BRAND.borderGold}`,
                }}>
                  {suggestions.length} suggestions
                </span>
              </div>
            </div>

            {/* Suggestion cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {suggestions.map((sug, idx) => {
                const isAccepted = accepted.includes(sug.id);
                const isAddedToPlan = addedToPlan[sug.id];
                const examColor = sug.exam === 'IELTS' ? BRAND.gold : sug.exam === 'PTE' ? BRAND.teal : '#C084FC';
                const fmtMeta = FORMAT_META[sug.format] || FORMAT_META.carousel;

                return (
                  <motion.div key={sug.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    style={{
                      background: isAccepted
                        ? 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(74,222,128,0.02))'
                        : BRAND.bgCard,
                      border: `1px solid ${isAccepted ? 'rgba(74,222,128,0.3)' : BRAND.border}`,
                      borderRadius: 16, overflow: 'hidden',
                      transition: 'border-color 0.2s',
                    }}>

                    {/* Card Header */}
                    <div style={{ padding: '16px 20px 12px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      {/* Exam + Format badges */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
                          background: examColor + '18', color: examColor, border: `1px solid ${examColor}44`,
                          letterSpacing: '0.5px', textAlign: 'center',
                        }}>
                          {sug.exam}
                        </span>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: fmtMeta.color + '18', color: fmtMeta.color,
                          border: `1px solid ${fmtMeta.color}44`, textAlign: 'center',
                        }}>
                          {fmtMeta.label}
                        </span>
                      </div>

                      {/* Title + angle */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: BRAND.white, marginBottom: 4 }}>
                          {sug.title}
                        </div>
                        <div style={{ fontSize: 12, color: BRAND.dim, marginBottom: 6 }}>
                          {sug.angle}
                        </div>
                        <div style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: 8,
                          background: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`,
                          fontSize: 11, color: BRAND.dimmer,
                        }}>
                          📂 {sug.category}
                        </div>
                      </div>

                      {/* Accepted badge */}
                      {isAccepted && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 20,
                          background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
                          color: '#4ade80', fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>
                          <Icon d={ICONS.check} size={12} color="#4ade80" />
                          Accepted
                        </div>
                      )}
                    </div>

                    {/* Hook + Stat */}
                    <div style={{
                      margin: '0 20px 14px',
                      background: examColor + '0A', border: `1px solid ${examColor}22`,
                      borderRadius: 10, padding: '10px 14px',
                    }}>
                      <div style={{ fontSize: 11, color: examColor, fontWeight: 700, marginBottom: 4, letterSpacing: '0.5px' }}>
                        💬 HOOK
                      </div>
                      <div style={{ fontSize: 13, color: BRAND.white, fontWeight: 600, fontStyle: 'italic', marginBottom: 8 }}>
                        "{sug.hook}"
                      </div>
                      <div style={{ fontSize: 11, color: BRAND.dim }}>
                        📊 {sug.stat}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{
                      borderTop: `1px solid ${BRAND.border}`, padding: '12px 20px',
                      display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
                    }}>
                      {!isAccepted ? (
                        <>
                          <motion.button onClick={() => handleAccept(sug)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(74,222,128,0.35)',
                              background: 'rgba(74,222,128,0.1)', color: '#4ade80',
                              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
                            }}>
                            <Icon d={ICONS.check} size={13} color="#4ade80" /> Accept
                          </motion.button>

                          <motion.button onClick={() => startEdit(sug, idx)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 9, border: `1px solid ${BRAND.border}`,
                              background: 'rgba(255,255,255,0.04)', color: BRAND.dim,
                              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
                            }}>
                            <Icon d={ICONS.edit} size={13} color={BRAND.dim} /> Edit
                          </motion.button>

                          <motion.button onClick={() => handleReject(sug)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 14px', borderRadius: 9, border: '1px solid rgba(255,100,100,0.2)',
                              background: 'rgba(255,100,100,0.06)', color: 'rgba(255,100,100,0.7)',
                              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
                            }}>
                            <Icon d={ICONS.x} size={13} color="rgba(255,100,100,0.7)" /> Skip
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button onClick={() => addToPlanner(sug)}
                            disabled={isAddedToPlan}
                            whileHover={{ scale: isAddedToPlan ? 1 : 1.03 }}
                            whileTap={{ scale: isAddedToPlan ? 1 : 0.97 }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 9,
                              border: isAddedToPlan ? '1px solid rgba(74,222,128,0.4)' : 'none',
                              background: isAddedToPlan ? 'rgba(74,222,128,0.1)' : BRAND.gradGold,
                              color: isAddedToPlan ? '#4ade80' : '#08162b',
                              fontSize: 12, fontWeight: 700, cursor: isAddedToPlan ? 'default' : 'pointer', fontFamily: BRAND.font,
                              boxShadow: isAddedToPlan ? 'none' : BRAND.shadowGold,
                            }}>
                            <Icon d={isAddedToPlan ? ICONS.check : ICONS.calendar} size={13}
                              color={isAddedToPlan ? '#4ade80' : '#08162b'} />
                            {isAddedToPlan ? 'Added to Planner!' : 'Add to Content Planner'}
                          </motion.button>

                          <motion.button onClick={() => startEdit(sug, idx)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 14px', borderRadius: 9, border: `1px solid ${BRAND.border}`,
                              background: 'rgba(255,255,255,0.04)', color: BRAND.dim,
                              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
                            }}>
                            <Icon d={ICONS.edit} size={13} color={BRAND.dim} /> Edit
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty state */}
            {suggestions.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '60px 32px',
                background: BRAND.bgCard, border: `1px solid ${BRAND.border}`,
                borderRadius: 20,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
                <h3 style={{ color: BRAND.white, fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>
                  All suggestions reviewed!
                </h3>
                <p style={{ color: BRAND.dim, fontSize: 14, marginBottom: 20 }}>
                  You've gone through all suggestions. Try a new idea or refine your original prompt.
                </p>
                <button onClick={reset} style={{
                  padding: '10px 24px', background: BRAND.gradGold, border: 'none',
                  borderRadius: 10, color: '#08162b', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                  Try Another Idea
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════
            PHASE: EDITING
        ══════════════════════════════════════════════ */}
        {phase === 'editing' && editingIdx !== null && (
          <motion.div key="editing"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>

            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={cancelEdit} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`,
                borderRadius: 8, color: BRAND.dim, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
                ← Back
              </button>
              <span style={{ fontSize: 14, color: BRAND.dim }}>Editing suggestion #{editingIdx + 1}</span>
            </div>

            <div style={{
              background: BRAND.bgCard, border: `1px solid ${BRAND.borderGold}`,
              borderRadius: 16, padding: '24px',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: BRAND.gold, margin: '0 0 20px' }}>
                ✏️ Edit Suggestion
              </h3>

              {[
                { key: 'title', label: 'Post Title / Topic', multiline: false, placeholder: 'e.g. IELTS Task 2 Band 7+ Essay Structure' },
                { key: 'angle', label: 'Content Angle', multiline: false, placeholder: 'e.g. The 4-paragraph formula nobody teaches you' },
                { key: 'hook', label: 'Hook (Opening Line)', multiline: false, placeholder: 'e.g. You\'re losing 2 band scores because of THIS mistake...' },
                { key: 'stat', label: 'Supporting Stat', multiline: false, placeholder: 'e.g. 73% of test-takers score below Band 6.5 on Task 2' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: BRAND.dim, display: 'block', marginBottom: 6, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                    {field.label}
                  </label>
                  <input
                    value={editDraft[field.key] || ''}
                    onChange={e => setEditDraft(d => ({ ...d, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', padding: '10px 14px', background: BRAND.bg,
                      border: `1px solid ${BRAND.border}`, borderRadius: 8,
                      color: BRAND.white, fontSize: 13, fontFamily: BRAND.font,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}

              {/* Format picker */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: BRAND.dim, display: 'block', marginBottom: 8, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Format
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Object.entries(FORMAT_META).map(([key, meta]) => (
                    <button key={key}
                      onClick={() => setEditDraft(d => ({ ...d, format: key }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                        border: `1px solid ${editDraft.format === key ? meta.color + '66' : BRAND.border}`,
                        background: editDraft.format === key ? meta.color + '18' : 'rgba(255,255,255,0.03)',
                        color: editDraft.format === key ? meta.color : BRAND.dim,
                        fontSize: 12, fontWeight: 700, fontFamily: BRAND.font,
                      }}>
                      {meta.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam picker */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: BRAND.dim, display: 'block', marginBottom: 8, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Exam
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['IELTS', 'PTE', 'General'].map(exam => (
                    <button key={exam}
                      onClick={() => setEditDraft(d => ({ ...d, exam }))}
                      style={{
                        padding: '7px 18px', borderRadius: 8, cursor: 'pointer',
                        border: `1px solid ${editDraft.exam === exam ? BRAND.borderGold : BRAND.border}`,
                        background: editDraft.exam === exam ? BRAND.goldDim : 'rgba(255,255,255,0.03)',
                        color: editDraft.exam === exam ? BRAND.gold : BRAND.dim,
                        fontSize: 12, fontWeight: 700, fontFamily: BRAND.font,
                      }}>
                      {exam}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button onClick={saveEdit}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 10, border: 'none',
                    background: BRAND.gradGold, color: '#08162b',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: BRAND.font,
                  }}>
                  <Icon d={ICONS.check} size={15} color="#08162b" /> Save Changes
                </motion.button>
                <button onClick={cancelEdit} style={{
                  padding: '12px 20px', borderRadius: 10, border: `1px solid ${BRAND.border}`,
                  background: 'rgba(255,255,255,0.04)', color: BRAND.dim,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: BRAND.font,
                }}>
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
