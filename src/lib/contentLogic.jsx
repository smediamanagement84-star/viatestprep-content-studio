// ─────────────────────────────────────────────────────────────────────────────
//  ViAtestprep Content Studio — Intelligence Engine
//  src/lib/contentLogic.js
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
//  CONTENT LIBRARY — Researched pain points + paradox angles
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTENT_LIBRARY = {
  vocabulary: {
    id: 'vocabulary',
    label: 'Vocabulary & Word Choice',
    emoji: '📚',
    painPoints: [
      'Using memorised "big words" that sound unnatural to examiners',
      'Vocabulary range vs. accuracy trade-off (range kills band score)',
      'Repeating the same words because synonyms feel forced',
      'Mixing colloquial and academic register mid-essay',
      'Memorising word lists instead of learning contextual usage',
    ],
    paradox: 'Why Big Words Are KILLING Your IELTS Score',
    paradoxExplainer:
      'Examiners reward ACCURACY over range. Using advanced vocab incorrectly drops you from Band 7 to Band 5 instantly.',
    quickTip:
      'Replace one "impressive" word per paragraph with the most precise word possible.',
  },

  speaking: {
    id: 'speaking',
    label: 'Speaking Fluency',
    emoji: '🎙️',
    painPoints: [
      'Sounding robotic or over-rehearsed — examiners deduct for memorised speeches',
      'Wrong pausing: hesitating AFTER filler words instead of BEFORE ideas',
      'Pronunciation patterns that reduce intelligibility (not accent)',
      'Overusing stock phrases ("That\'s a good question")',
      'Running out of things to say after 10 seconds',
    ],
    paradox: 'The More You Rehearse Scripts, The Lower Your Speaking Score',
    paradoxExplainer:
      'IELTS Speaking tests spontaneous language production. Scripted answers are penalised for "memorised language."',
    quickTip:
      'Practice speaking about random topics for 2 min straight — zero preparation. Daily.',
  },

  writing: {
    id: 'writing',
    label: 'Writing Task 2',
    emoji: '✍️',
    painPoints: [
      'The Band 6.5 plateau: structure is correct, ideas are generic',
      'Overusing connectives (Furthermore, Moreover, In addition...)',
      'Thesis statements that restate the question instead of answering it',
      'Confusing "complex sentences" with "convoluted sentences"',
      'Body paragraphs with no specific examples or data',
    ],
    paradox: 'Why "Perfect Structure" IELTS Essays Score Band 6',
    paradoxExplainer:
      'Template-based essays are easy to identify. Examiners call them "formulaic" — it caps your score at 6 regardless of grammar.',
    quickTip:
      'Start your thesis with a concession: "While X is true, Y is more significant because..."',
  },

  listening: {
    id: 'listening',
    label: 'Listening Accuracy',
    emoji: '🎧',
    painPoints: [
      'Mishearing unstressed syllables and function words',
      'Losing focus after missing one answer and spiralling',
      'Unfamiliar accents (Australian, Scottish, South African)',
      'Spelling errors on answers you heard correctly',
      'Over-reading ahead during listening — missing the current answer',
    ],
    paradox: "You Don't Have A Listening Problem. You Have A Focus Problem.",
    paradoxExplainer:
      'Most IELTS listening errors happen in the 3 seconds AFTER a missed answer — not because of difficulty.',
    quickTip:
      'Miss an answer? Draw a line, move on immediately. Review spelling after — not during.',
  },

  timeManagement: {
    id: 'timeManagement',
    label: 'Time Management',
    emoji: '⏱️',
    painPoints: [
      'Spending 30+ minutes on Writing Task 1 (it is worth less)',
      'Running out of time in Reading because of re-reading',
      'Checking all answers vs. attempting more questions',
      'Planning 10+ minutes, leaving only 20 for writing',
      'Finishing Speaking Part 2 in under a minute',
    ],
    paradox: 'The Test-Taker Who Finishes Early Always Scores Lower',
    paradoxExplainer:
      'Finishing early = unanswered questions. Every unanswered question in Listening/Reading = guaranteed zero.',
    quickTip:
      'Set a hard time limit per task before the test. When the timer hits — move. No exceptions.',
  },

  mindset: {
    id: 'mindset',
    label: 'Test Psychology',
    emoji: '🧠',
    painPoints: [
      'The Band 6.5 plateau mindset — feeling "almost there" but stalling',
      'Exam anxiety causing known grammar rules to vanish under pressure',
      'Over-studying without targeted gap analysis',
      'Comparing progress to others instead of personal benchmarks',
      'Treating mock tests as practice instead of real performance data',
    ],
    paradox: 'Stop Practising IELTS To Score Higher on IELTS',
    paradoxExplainer:
      'Generic practice builds generic skills. You need gap-specific drilling — practising ONLY your weakest 15%.',
    quickTip:
      'After every mock test: write down your top 3 error patterns. Next week: fix ONLY those 3.',
  },

  taskAchievement: {
    id: 'taskAchievement',
    label: 'Task Achievement (Writing)',
    emoji: '🎯',
    painPoints: [
      'Writing about a related topic instead of THE topic given',
      'Arguing both sides instead of taking a clear position',
      'Not covering all parts of the question (common in multi-part Qs)',
      'Word count anxiety — padding with irrelevant sentences',
      'Missing the implied "To what extent?" even when not stated',
    ],
    paradox: 'The #1 Reason Band 8 Writers Score Band 6',
    paradoxExplainer:
      'Task Achievement (TA) is the first criterion examiners check. A perfectly written off-topic essay = Band 4 TA.',
    quickTip:
      'Underline every noun in the question. Your essay must address ALL of them explicitly.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
//  WEEKLY CONTENT CALENDAR TEMPLATES (Paradox Strategy)
// ═══════════════════════════════════════════════════════════════════════════════

export const WEEKLY_TEMPLATES = [
  {
    day: 'Monday',
    shortDay: 'MON',
    format: 'Myth-Buster Reel',
    icon: '🔥',
    type: 'animation',
    description: 'Open the week by debunking the #1 myth in your niche',
    postTime: '7:00 AM',
    psychPrinciple: 'Pattern Interrupt',
  },
  {
    day: 'Tuesday',
    shortDay: 'TUE',
    format: 'Error Diagnosis Carousel',
    icon: '🔍',
    type: 'script',
    description: 'Show the exact mistake + the fix in carousel format',
    postTime: '12:00 PM',
    psychPrinciple: 'Pain Amplification',
  },
  {
    day: 'Wednesday',
    shortDay: 'WED',
    format: "The '1% Fix' Reel",
    icon: '⚡',
    type: 'animation',
    description: 'One tiny, actionable change with a measurable result',
    postTime: '6:00 PM',
    psychPrinciple: 'Micro-commitment',
  },
  {
    day: 'Thursday',
    shortDay: 'THU',
    format: 'Student Transformation Story',
    icon: '📈',
    type: 'script',
    description: 'Before/after case study with specific band score data',
    postTime: '12:00 PM',
    psychPrinciple: 'Social Proof',
  },
  {
    day: 'Friday',
    shortDay: 'FRI',
    format: 'Strategy Deep-Dive',
    icon: '🎯',
    type: 'animation',
    description: 'The counterintuitive strategy examiners actually reward',
    postTime: '5:00 PM',
    psychPrinciple: 'Authority + Curiosity',
  },
  {
    day: 'Saturday',
    shortDay: 'SAT',
    format: 'Spot-the-Error Challenge',
    icon: '💪',
    type: 'script',
    description: 'Interactive quiz carousel — drives saves and comments',
    postTime: '10:00 AM',
    psychPrinciple: 'Engagement Loop',
  },
  {
    day: 'Sunday',
    shortDay: 'SUN',
    format: 'Week Recap + Teaser',
    icon: '🗓️',
    type: 'animation',
    description: "This week's #1 insight + hint at next week's content",
    postTime: '8:00 PM',
    psychPrinciple: 'Recency + Anticipation',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  GENERATE WEEKLY PLAN
// ═══════════════════════════════════════════════════════════════════════════════

export function generateWeeklyPlan(nicheInput) {
  const nicheKeys = Object.keys(CONTENT_LIBRARY);
  return WEEKLY_TEMPLATES.map((template, i) => {
    const nicheKey  = nicheKeys[i % nicheKeys.length];
    const niche     = CONTENT_LIBRARY[nicheKey];
    const painPoint = niche.painPoints[Math.floor(Math.random() * niche.painPoints.length)];

    const topicBase = nicheInput
      ? `${nicheInput} — ${template.format}`
      : niche.paradox;

    return {
      ...template,
      topic:      topicBase,
      hook:       buildHook(template.format, niche, nicheInput),
      painPoint,
      niche:      niche.label,
      nicheEmoji: niche.emoji,
      paradox:    niche.paradox,
    };
  });
}

function buildHook(format, niche, customNiche) {
  const base = customNiche || niche.label;
  const hooks = {
    'Myth-Buster Reel':
      `🚨 STOP. Everything you know about ${base} is wrong.`,
    'Error Diagnosis Carousel':
      `❌ 94% of IELTS students make this exact ${base} mistake...`,
    "The '1% Fix' Reel":
      `One 30-second ${base} fix. +0.5 band score. Watch.`,
    'Student Transformation Story':
      `She was stuck at Band 6.5 for 9 months (${base}). Here's what changed in 2 weeks.`,
    'Strategy Deep-Dive':
      `The ${base} strategy examiners WANT you to use (but won't tell you).`,
    'Spot-the-Error Challenge':
      `Can you spot the ${base} error? 90% of Band 7 students can't.`,
    'Week Recap + Teaser':
      `This week's biggest ${base} lesson: ${niche.paradox}`,
  };
  return hooks[format] || `🎯 ${niche.paradox}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GENERATE CAROUSEL SCRIPT (6-slide blueprint)
// ═══════════════════════════════════════════════════════════════════════════════

export function generateCarouselScript(topic, paradoxAngle, nicheKey) {
  const niche     = CONTENT_LIBRARY[nicheKey] || CONTENT_LIBRARY.writing;
  const angle     = paradoxAngle || niche.paradox;
  const painPoint = niche.painPoints[0];

  return [
    {
      slide:       1,
      label:       'HOOK / COVER',
      visual:
        'Full-bleed #0b0f19. Headline in white, 36px bold. Orange accent underline (4px). "Swipe →" in orange at bottom-right.',
      copy:        `⚠️ ${angle}\n\n↓ Swipe to find out why`,
      logic:
        'Pattern Interrupt — the paradox headline forces a double-take. The subtext creates curiosity tension that demands the swipe.',
    },
    {
      slide:       2,
      label:       'THE PROBLEM',
      visual:
        'Split card: ❌ column (red tint) left, ✅ column (orange tint) right. Glassmorphism panel. Bold contrast typography.',
      copy:        `What everyone tells you:\n❌ "${painPoint}"\n\nWhat actually works:\n✅ Targeted gap analysis first — practice second.`,
      logic:
        'Pain Amplification — validates the reader\'s frustration with generic advice. The binary layout triggers a "this is me" recognition moment.',
    },
    {
      slide:       3,
      label:       'THE DATA / PROOF',
      visual:
        'Dark card. Large orange stat number (72px). Supporting stat in white (16px). Source tag in grey at bottom.',
      copy:        `73% of students stuck at Band 6.5 share one trait:\n\nThey practise the full test instead of their weakest 15%.`,
      logic:
        'Authority Positioning — specific numbers eliminate scepticism. "73%" feels researched, not invented. Precision = credibility.',
    },
    {
      slide:       4,
      label:       'SOCIAL PROOF',
      visual:
        'Glassmorphism quote block. Large quotation mark in orange. Student name + band score in orange. Dark background.',
      copy:        `"I was stuck at 6.5 for seven months. After two weeks of gap-specific drilling, I hit 7.5."\n\n— Priya M., Band 7.5 (${niche.label})`,
      logic:
        'Social Proof — a real-name, specific-outcome testimonial. Readers with the same problem identify instantly. The band score is the proof unit.',
    },
    {
      slide:       5,
      label:       'THE 3-STEP FIX',
      visual:
        'Numbered list. Orange numbers (48px), white text (18px). Clean vertical spacing. Each step on its own visual row.',
      copy:        `The 3-Step Fix:\n\n1️⃣  Record yourself for 90 seconds on "${topic}"\n2️⃣  Identify your single most-repeated error\n3️⃣  Drill ONLY that error for 7 days straight`,
      logic:
        'Transformation Promise — three steps make change feel achievable. "Only" and "7 days" reduce commitment anxiety. The action is specific enough to start today.',
    },
    {
      slide:       6,
      label:       'CTA / LOOP CLOSE',
      visual:
        '#FF6B00 accent background strip at bottom. White CTA text. @viatestprep handle. Save icon callout. Clean, brand-locked slide.',
      copy:        `🔖 Save this. You'll need it.\n\nShare with someone stuck at Band 6.5.\n\nFollow @viatestprep — new strategy every week.\n\n(Start from Slide 1 again — it hits different now.)`,
      logic:
        'CTA + Loop Back — the "(Start from Slide 1)" instruction re-engages the carousel, doubling watch time. Save + share = algorithm amplification signal.',
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GENERATE ANIMATION DATA (for Reel / AnimationPlayer)
// ═══════════════════════════════════════════════════════════════════════════════

export function generateAnimationData(topic, customHook, nicheKey) {
  const niche  = CONTENT_LIBRARY[nicheKey] || CONTENT_LIBRARY.writing;
  const hook   = customHook || `Everyone says practise more. They're lying.`;

  const scenes = buildSeamlessScenes(topic, hook, niche);

  return {
    id:     Date.now(),
    topic,
    niche:  niche.label,
    scenes,
    colors: {
      bg:      '#0b0f19',
      primary: '#FFFFFF',
      accent:  '#FF6B00',
      dim:     'rgba(255,255,255,0.45)',
    },
    timing: {
      sceneDuration: 3000,   // ms per scene
      stagger:       0.15,   // seconds between line animations
      exitDuration:  0.4,
    },
    branding: '@viatestprep',
  };
}

function buildSeamlessScenes(topic, hook, niche) {
  // Last scene must grammatically bridge back to the first — the seamless loop.
  return [
    {
      id:      0,
      label:   'HOOK',
      accent:  true,
      style:   'headline',
      lines:   [hook],
    },
    {
      id:      1,
      label:   'PAIN',
      accent:  false,
      style:   'stacked',
      lines: [
        `You've been studying`,
        `${topic}`,
        `for months.`,
        `Your score hasn't moved.`,
      ],
    },
    {
      id:      2,
      label:   'PARADOX',
      accent:  true,
      style:   'stacked',
      lines: [
        `Here's the problem:`,
        `You're practising`,
        `the wrong things.`,
      ],
    },
    {
      id:      3,
      label:   'REVELATION',
      accent:  false,
      style:   'stacked',
      lines: [
        `Band 7+ students`,
        `don't practise more.`,
        `They practise SMARTER.`,
      ],
    },
    {
      id:      4,
      label:   'THE FIX',
      accent:  true,
      style:   'stacked',
      lines: [
        `Smarter means targeting`,
        `your specific 1%`,
        `blind spot.`,
      ],
    },
    {
      id:      5,
      label:   'LOOP',
      accent:  false,
      style:   'stacked',
      // ← Grammatical bridge back to scene 0 hook:
      //   "So yes — everyone says practise more."  → hook triggers again
      lines: [
        `So stop practising MORE.`,
        `Start practising RIGHT.`,
        `(Watch again ↑)`,
      ],
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GENERATE JSX CODE STRING (downloadable .jsx file)
// ═══════════════════════════════════════════════════════════════════════════════

// Sanitize user-supplied strings before embedding in generated JSX source.
// Strips backticks and bare dollar signs to prevent template-literal injection.
function sanitizeForCode(str) {
  return String(str)
    .replace(/`/g, "'")
    .replace(/\$\{/g, '\\${');
}

export function generateJSXCode(animationData) {
  const scenesJSON = JSON.stringify(animationData.scenes, null, 2);
  const { bg, primary, accent, dim } = animationData.colors;
  const { sceneDuration, stagger } = animationData.timing;

  const safeTopic    = sanitizeForCode(animationData.topic);
  const safeBranding = sanitizeForCode(animationData.branding);

  // Use array join to avoid JSX-in-template-literal parsing errors in esbuild
  const lines = [
    '// ViAtestprep — Generated Reel Animation',
    '// Topic: ' + safeTopic,
    '// Generated: ' + new Date().toISOString(),
    '// -----------------------------------------',
    '',
    "import { useState, useEffect } from 'react';",
    "import { motion, AnimatePresence } from 'framer-motion';",
    '',
    'const SCENES = ' + scenesJSON + ';',
    '',
    'const COLORS = {',
    "  bg:      '" + bg + "',",
    "  primary: '" + primary + "',",
    "  accent:  '" + accent + "',",
    "  dim:     '" + dim + "',",
    '};',
    '',
    'export default function ViAReelAnimation() {',
    '  const [sceneIndex, setSceneIndex] = useState(0);',
    '  const [loopKey,    setLoopKey]    = useState(0);',
    '',
    '  useEffect(() => {',
    '    const id = setInterval(() => {',
    '      setSceneIndex(prev => {',
    '        const next = (prev + 1) % SCENES.length;',
    '        if (next === 0) setLoopKey(k => k + 1);',
    '        return next;',
    '      });',
    '    }, ' + sceneDuration + ');',
    '    return () => clearInterval(id);',
    '  }, []);',
    '',
    '  const scene = SCENES[sceneIndex];',
    "  const isHeadline = scene.style === 'headline';",
    '',
    '  return (',
    '    <div style={{',
    "      width: '390px', height: '693px', background: COLORS.bg,",
    "      display: 'flex', flexDirection: 'column',",
    "      justifyContent: 'center', alignItems: 'center',",
    "      padding: '35px', fontFamily: 'Inter, system-ui, sans-serif',",
    "      overflow: 'hidden', position: 'relative',",
    '    }}>',
    '      {/* Progress bar */}',
    '      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.06)" }}>',
    '        <motion.div',
    '          key={sceneIndex + \'-\' + loopKey}',
    '          initial={{ width: "0%" }} animate={{ width: "100%" }}',
    '          transition={{ duration: ' + (sceneDuration / 1000) + ', ease: "linear" }}',
    '          style={{ height: "100%", background: COLORS.accent }}',
    '        />',
    '      </div>',
    '      {/* Scene label */}',
    '      <div style={{ position: "absolute", top: "18px", left: "35px", color: COLORS.accent, fontSize: "9px", letterSpacing: "3px", fontWeight: 700, textTransform: "uppercase" }}>',
    '        {scene.label}',
    '      </div>',
    '      {/* Main content */}',
    '      <AnimatePresence mode="wait">',
    '        <motion.div',
    '          key={sceneIndex + \'-content-\' + loopKey}',
    '          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}',
    '          transition={{ duration: 0.45 }}',
    '          style={{ width: "100%", textAlign: "center", padding: "0 4px", wordBreak: "break-word" }}',
    '        >',
    '          {scene.lines.map((line, i) => {',
    '            const isAccentLine = scene.accent && i === scene.lines.length - 1;',
    '            return (',
    '              <motion.p key={i}',
    '                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}',
    '                transition={{ delay: i * ' + stagger + ', duration: 0.38 }}',
    '                style={{',
    '                  color: isAccentLine ? COLORS.accent : COLORS.primary,',
    '                  fontSize: isHeadline ? "28px" : line.length > 20 ? "22px" : "26px",',
    '                  fontWeight: isHeadline ? 800 : i === 0 ? 400 : 700,',
    '                  lineHeight: 1.25,',
    '                  marginBottom: i < scene.lines.length - 1 ? "6px" : "0",',
    '                }}',
    '              >{line}</motion.p>',
    '            );',
    '          })}',
    '        </motion.div>',
    '      </AnimatePresence>',
    '      {/* Branding */}',
    '      <div style={{ position: "absolute", bottom: "24px", color: COLORS.dim, fontSize: "11px", letterSpacing: "2px", fontWeight: 600, textTransform: "uppercase" }}>',
    '        ' + safeBranding,
    '      </div>',
    '    </div>',
    '  );',
    '}',
  ];

  return lines.join('\n');
}


// ═══════════════════════════════════════════════════════════════════════════════
//  HOOK FORMULAS  —  7 proven opening structures (sorted by avg retention)
// ═══════════════════════════════════════════════════════════════════════════════

export const HOOK_FORMULAS = [
  {
    id:           'counter',
    label:        'Counter-Intuitive Opener',
    template:     'Stop doing [common advice]. Here\'s why it\'s hurting your [metric].',
    example:      'Stop practising full IELTS tests. Here\'s why it\'s hurting your score.',
    avgRetention: 82,
    why:          'Violates the viewer\'s expectation — the brain immediately demands resolution. High curiosity gap.',
  },
  {
    id:           'stat_shock',
    label:        'Stat Shock',
    template:     '[Surprising %] of [audience] make this exact [mistake]...',
    example:      '94% of IELTS students make this exact Speaking mistake on exam day.',
    avgRetention: 79,
    why:          'Specific numbers feel researched. The viewer immediately self-identifies and needs to know if they\'re in the 94%.',
  },
  {
    id:           'direct_address',
    label:        'Direct Address + Pain',
    template:     'If you\'re stuck at [pain state], watch this.',
    example:      'If you\'re stuck at Band 6.5, watch this before your next attempt.',
    avgRetention: 76,
    why:          'Laser-targeted. The viewer feels the content was made for them. Filters out noise immediately.',
  },
  {
    id:           'time_bound',
    label:        'Time-Bound Promise',
    template:     'One [time] fix. [Measurable result]. Watch.',
    example:      'One 30-second vocabulary fix. +0.5 band score. Watch.',
    avgRetention: 74,
    why:          'Micro-commitment — a tiny time investment for a specific reward. Removes the "I don\'t have time" objection.',
  },
  {
    id:           'before_after',
    label:        'Before / After Bridge',
    template:     'She was stuck at [state] for [time]. Here\'s what changed in [short time].',
    example:      'She was stuck at Band 6.5 for 9 months. Here\'s what changed in 2 weeks.',
    avgRetention: 71,
    why:          'Social proof + time compression. Viewers project themselves into the "before" state.',
  },
  {
    id:           'examiner_secret',
    label:        'Examiner Insider',
    template:     'The [metric] strategy examiners WANT you to use (but won\'t tell you).',
    example:      'The Writing strategy examiners WANT you to use (but won\'t tell you).',
    avgRetention: 68,
    why:          'Authority + conspiracy framing. The word "won\'t tell you" implies suppressed information the viewer deserves.',
  },
  {
    id:           'challenge',
    label:        'Challenge / Test',
    template:     'Can you spot the [error]? [%] of [audience level] students can\'t.',
    example:      'Can you spot the vocabulary error? 90% of Band 7 students can\'t.',
    avgRetention: 65,
    why:          'Gamification triggers competitiveness. The viewer must watch to find out if they\'re in the majority.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  VIRAL FORMATS  —  Format performance benchmarks
// ═══════════════════════════════════════════════════════════════════════════════

export const VIRAL_FORMATS = [
  {
    id:          'myth_truth',
    label:       'Myth vs. Truth Reel',
    duration:    '15–30s',
    retention:   '72% loop rate',
    description: 'Open with a bold myth statement, disprove it with one data point, close with the correct approach. The contrast triggers share behaviour.',
    structure:   ['Myth (0–3s)', 'Disprove (3–10s)', 'Truth reveal (10–20s)', 'CTA (20–30s)'],
    production:  'Talking-head + text overlays. No B-roll needed. Hook on screen within first frame.',
  },
  {
    id:          'step_formula',
    label:       '3-Step Formula Reel',
    duration:    '30–45s',
    retention:   '68% loop rate',
    description: 'Numbered steps create a cognitive checklist viewers feel compelled to complete. High save rate because it\'s actionable.',
    structure:   ['Problem (0–5s)', 'Step 1 (5–15s)', 'Step 2 (15–25s)', 'Step 3 (25–35s)', 'CTA (35–45s)'],
    production:  'On-screen text + voice. Each step needs ONE concrete example.',
  },
  {
    id:          'carousel_paradox',
    label:       'Paradox Carousel',
    duration:    '6 slides',
    retention:   '65% swipe-through',
    description: 'A counter-intuitive headline drives swipes. Each slide deepens the paradox before resolving it on the final slide with a CTA.',
    structure:   ['Hook slide', 'Problem', 'Data', 'Social proof', '3-step fix', 'CTA + loop'],
    production:  'Dark background, single stat or quote per slide. Consistent brand colours throughout.',
  },
  {
    id:          'case_study',
    label:       'Student Case Study',
    duration:    '30–60s',
    retention:   '61% watch-through',
    description: 'Before/after with specific band score data. Must include student name + outcome number to be credible.',
    structure:   ['Before state (0–10s)', 'Turning point (10–25s)', 'After result (25–40s)', 'Your offer (40–60s)'],
    production:  'Voice-over or text-on-screen. Quote overlay works well. Avoid generic stock footage.',
  },
  {
    id:          'error_diagnosis',
    label:       'Error Diagnosis Carousel',
    duration:    '5–7 slides',
    retention:   '58% swipe-through',
    description: 'Show the mistake on one slide, the correction on the next. Interactive format drives comments ("I always do this!").',
    structure:   ['Hook: "spot the error"', 'Wrong example', 'Why it\'s wrong', 'Correct version', 'Rule to remember', 'Save CTA'],
    production:  'Side-by-side layouts work best. Red/green colour coding for wrong/right.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  TRENDING ANGLES  —  High-momentum content angles in the IELTS niche
// ═══════════════════════════════════════════════════════════════════════════════

export const TRENDING_ANGLES = [
  {
    angle:    'The Band 6.5 Plateau Exposed',
    hook:     'Why 73% of IELTS retakers score the SAME band twice in a row.',
    reason:   'The 6.5 plateau is the single most-searched IELTS pain point. Calling it out by name creates instant recognition.',
    momentum: 'VERY HIGH',
    nichefit: ['Writing', 'Speaking', 'Mindset'],
  },
  {
    angle:    'What Examiners Actually Write in Their Notes',
    hook:     'An ex-IELTS examiner reveals what she writes when a candidate starts speaking.',
    reason:   'Insider perspective content performs 3× better than generic advice. "Examiner reveals" triggers authority + curiosity.',
    momentum: 'HIGH',
    nichefit: ['Speaking', 'Writing', 'Task Achievement'],
  },
  {
    angle:    'The 1% Vocabulary Rule',
    hook:     'One vocabulary swap. +0.5 band score. Every single time.',
    reason:   'Specific, micro-actionable advice outperforms comprehensive guides. The "1%" framing implies low effort for high return.',
    momentum: 'HIGH',
    nichefit: ['Vocabulary', 'Writing'],
  },
  {
    angle:    'IELTS Listening: It\'s Not a Listening Test',
    hook:     'You failed IELTS Listening because of your memory, not your English.',
    reason:   'Reframing the problem creates a paradigm shift. The counter-intuitive angle forces viewers to reconsider everything they\'ve practised.',
    momentum: 'MEDIUM-HIGH',
    nichefit: ['Listening', 'Mindset'],
  },
  {
    angle:    'The Writing Template Trap',
    hook:     'That essay template your teacher gave you is capping your score at 6.',
    reason:   'Challenges the prevailing wisdom of template-based preparation — directly attacks the most common study approach.',
    momentum: 'HIGH',
    nichefit: ['Writing', 'Task Achievement'],
  },
  {
    angle:    'Speaking Fluency ≠ Speaking Fast',
    hook:     'You\'re speaking faster because you\'re nervous. Your examiner can tell.',
    reason:   'Unmasks a behaviour many candidates exhibit without realising. Shame + relief loop drives saves and comments.',
    momentum: 'MEDIUM-HIGH',
    nichefit: ['Speaking'],
  },
  {
    angle:    'Time Management: The Finish-Early Myth',
    hook:     'The test-taker who finishes 10 minutes early ALWAYS scores lower.',
    reason:   'Counter-intuitive and verifiable. Finishing early feels like success — the paradox reframes it as a mistake.',
    momentum: 'MEDIUM',
    nichefit: ['Listening', 'Reading', 'Time Management'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  FILMING SETUPS  —  Three production tiers
// ═══════════════════════════════════════════════════════════════════════════════

export const FILMING_SETUPS = [
  {
    id:    'minimal',
    label: 'Minimal Setup (Phone-Only)',
    gear:  [
      'Smartphone (iPhone 13+ or equivalent) — rear camera for max quality',
      'Ring light or position near window (natural light preferred)',
      'Simple tripod or phone clip on a stack of books',
    ],
    audio: 'Built-in mic + quiet room. Record at 6–8am for minimum ambient noise. Re-record any clip where you hesitate.',
    bg:    'Plain wall (white, grey, or dark — brand colours if possible). Declutter before filming.',
    tip:   'Film in portrait 9:16. Lock focus and exposure (tap and hold on iPhone) before pressing record.',
  },
  {
    id:    'semi_pro',
    label: 'Semi-Pro Setup',
    gear:  [
      'Sony ZV-E10 or similar entry mirrorless with 16mm f/1.4 lens',
      'Elgato Key Light or equivalent LED panel (5600K daylight)',
      'GorillaPod or desk stand for eye-level framing',
    ],
    audio: 'Rode Wireless GO II clip-on mic. Monitor with in-ear headphones during recording. Trim first 0.5s of every clip.',
    bg:    'Softbox backdrop or blurred bookshelf. Ensure subject is 1m+ from background for natural depth.',
    tip:   'Set shutter speed to 2× your frame rate (50fps → 1/100s shutter). Enables natural motion blur and avoids strobing.',
  },
  {
    id:    'pro',
    label: 'Pro Studio Tier',
    gear:  [
      'Sony A7 IV or Canon R6 Mark II with 35mm f/1.8 prime',
      'Two-point lighting: key + rim/hair light (Aputure 120D II)',
      'Teleprompter app on secondary iPad for scripts without eye movement',
    ],
    audio: 'Sennheiser MKE 600 shotgun mic on boom arm. Interface: Focusrite Scarlett 2i2. Monitor throughout.',
    bg:    'Seamless backdrop paper (dark charcoal) or custom-printed brand set. LED accent strip behind subject for depth.',
    tip:   'Shoot 4K, edit in 1080p — gives full freedom to reframe in post without quality loss. Shoot 3× more footage than you need.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  GENERATE FILM BRIEF  —  Full scene-by-scene director script
// ═══════════════════════════════════════════════════════════════════════════════

export function generateFilmBrief(topic, hookId, formatId, duration, nicheKey) {
  const niche       = CONTENT_LIBRARY[nicheKey] || CONTENT_LIBRARY.writing;
  const hookDef     = HOOK_FORMULAS.find(h => h.id === hookId) || HOOK_FORMULAS[0];
  const formatDef   = VIRAL_FORMATS.find(f => f.id === formatId) || VIRAL_FORMATS[0];
  const filmSetup   = FILMING_SETUPS[0];
  const dur         = parseInt(duration) || 30;

  // Build verbatim hook from the formula template
  const verbatimHook = hookDef.template
    .replace('[common advice]', `generic ${niche.label} practice`)
    .replace('[metric]', 'band score')
    .replace('[audience]', 'IELTS students')
    .replace('[mistake]', `${niche.label.toLowerCase()} mistake`)
    .replace('[pain state]', `Band 6.5 in ${niche.label}`)
    .replace('[state]', 'Band 6.5')
    .replace('[time]', '9 months')
    .replace('[short time]', '2 weeks')
    .replace('[metric]', niche.label)
    .replace('[error]', `${niche.label.toLowerCase()} error`)
    .replace('[%]', '90%')
    .replace('[audience level]', 'Band 7');

  // Distribute duration across scenes
  const sceneDurations = {
    15: ['0–3s', '3–8s', '8–12s', '12–15s'],
    30: ['0–5s', '5–12s', '12–22s', '22–28s', '28–30s'],
    45: ['0–5s', '5–15s', '15–25s', '25–35s', '35–42s', '42–45s'],
    60: ['0–5s', '5–15s', '15–28s', '28–40s', '40–52s', '52–60s'],
  };
  const timeCodes = sceneDurations[dur] || sceneDurations[30];

  const scenes = [
    {
      id:      1,
      label:   'HOOK',
      timeCode: timeCodes[0] || '0–5s',
      script:  verbatimHook,
      visual:  `Face fills 70% of frame. Eye contact with camera. No gestures — stillness creates authority. Cut at the last word.`,
      caption: `⚠️ ${topic}`,
      bRoll:   null,
      dirNote: 'Hook must land in the first 1.5 seconds. If the opening word isn\'t compelling, re-shoot.',
    },
    {
      id:      2,
      label:   'PROBLEM',
      timeCode: timeCodes[1] || '5–12s',
      script:  `Here's the problem. ${niche.painPoints[0]} Most students think more practice fixes this. It doesn't.`,
      visual:  'Lean slightly forward — shows engagement. Pause after "Here\'s the problem" for 0.5s beat.',
      caption: `❌ ${niche.painPoints[0]}`,
      bRoll:   'Text overlay: the pain point statement in large white text on dark background.',
      dirNote: 'Speak slower here than the hook. Let the pain point land. The pause is part of the script.',
    },
    {
      id:      3,
      label:   'PARADOX / REVEAL',
      timeCode: timeCodes[2] || '12–22s',
      script:  `${niche.paradox}. ${niche.paradoxExplainer}`,
      visual:  'Direct address. No filler movement. Point at camera on key words for emphasis.',
      caption: `💡 "${niche.paradox}"`,
      bRoll:   'Graphic overlay: stat or key concept. Use brand orange (#FF6B00) for numbers.',
      dirNote: 'This is the content\'s core value. If this scene is cut short, the reel fails.',
    },
    {
      id:      4,
      label:   'THE FIX',
      timeCode: timeCodes[3] || '22–28s',
      script:  `So here is the fix. ${niche.quickTip}`,
      visual:  'Raise one hand to count the steps or gesture the fix. Energy level rises slightly.',
      caption: `✅ ${niche.quickTip}`,
      bRoll:   null,
      dirNote: 'The fix must be so specific the viewer can act on it today. Vague fixes = low saves.',
    },
    {
      id:      5,
      label:   'CTA',
      timeCode: timeCodes[4] || '28–30s',
      script:  `Save this. Share it with someone stuck at Band 6.5. And follow for a new strategy every week.`,
      visual:  'Slight smile — not performative. Natural close. Hold eye contact until after the final word.',
      caption: `🔖 Save · Share · Follow @viatestprep`,
      bRoll:   null,
      dirNote: 'Never end on a question — end on a command. "Follow" then cut. No hanging pause.',
    },
  ].slice(0, timeCodes.length);

  const caption = `${verbatimHook}\n\n${niche.paradoxExplainer}\n\nQuick fix: ${niche.quickTip}\n\n🔖 Save this for your next IELTS attempt.\n💬 Comment your current band score below.\n👉 Follow @viatestprep — new strategy every week.`;

  const hashtags = [
    '#IELTS', '#IELTSTips', '#IELTSPreparation', '#IELTSBand7',
    `#IELTS${niche.label.replace(/\s+/g, '')}`,
    '#EnglishLearning', '#StudyAbroad', '#IELTSCoach',
    '#IELTSOnline', '#Band7', '#IELTSWriting', '#IELTSSpeaking',
    '#viatestprep', '#IELTSStudy',
  ].join(' ');

  const thumbnail = {
    headline: niche.paradox,
    subline:  `The truth about ${niche.label} your teacher won't tell you`,
    layout:   'Bold headline top-third. Creator face bottom-half. Orange accent border.',
    colours:  'Background: #0b0f19. Headline: white. Accent: #FF6B00.',
    font:     'Inter Black (900 weight) for headline. Inter Medium for subline.',
    avoid:    'Busy backgrounds, multiple faces, more than 6 words in the headline.',
    tip:      'The thumbnail and hook must tell the SAME story — a mismatch destroys trust.',
  };

  return {
    topic,
    format:              formatDef.label,
    totalEstimatedLength: `${dur} seconds`,
    hook:                hookDef,
    verbatimHook,
    scenes,
    thumbnail,
    caption,
    hashtags,
    filmingSetup:        filmSetup,
    createdAt:           new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
  };
}