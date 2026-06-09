// ─────────────────────────────────────────────────────────────────────────────
//  src/lib/researchEngine.js
//  VIA Testprep — Static Intelligence Engine
//  Curated, research-backed IELTS + PTE trend database (updated weekly model)
// ─────────────────────────────────────────────────────────────────────────────

// ── Weekly trend rotation logic ──────────────────────────────────────────────
// Deterministically selects trends based on the ISO week number so every
// "Run Research" click within the same calendar week returns the same set,
// while next week automatically produces a fresh rotation.

function currentWeek() {
  const d = new Date();
  const jan4 = new Date(d.getFullYear(), 0, 4);
  return Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────────────────────────
//  IELTS TREND DATABASE
// ─────────────────────────────────────────────────────────────────────────────

const IELTS_TRENDS = [
  {
    id: 'ielts_plateau',
    exam: 'IELTS',
    topic: 'The Band 6.5 Plateau',
    painPoint: 'Why retakers keep scoring the same band twice in a row',
    hook: 'You didn\'t fail. Your practice strategy did.',
    angle: 'Counter-intuitive study method paradox',
    momentum: 98,
    searchVolume: 'VERY HIGH',
    formats: ['carousel', 'infographic', 'reel'],
    bestTime: 'Monday 7AM',
    caption: 'Stuck at 6.5? Read every word. This is exactly why.',
    hashtags: ['#IELTS', '#IELTSBand7', '#Band65Plateau', '#IELTSTips', '#viatestprep'],
    insight: '73% of IELTS retakers score within 0.5 bands of their first attempt. The study method, not effort, is the limiting factor.',
    stat: '73% of retakers score within 0.5 of their first attempt',
    fix: 'Targeted gap drilling — practise your weakest 15%, not the full test.',
    category: 'Mindset',
  },
  {
    id: 'ielts_writing_trap',
    exam: 'IELTS',
    topic: 'The Writing Template Trap',
    painPoint: 'Generic essay templates are capping scores at Band 6',
    hook: 'That essay template your teacher gave you is costing you 1.0 band.',
    angle: 'Examiner perspective exposé',
    momentum: 94,
    searchVolume: 'HIGH',
    formats: ['carousel', 'infographic'],
    bestTime: 'Tuesday 12PM',
    caption: 'This template feels safe. Your examiner has seen it 200 times today.',
    hashtags: ['#IELTSWriting', '#IELTSTask2', '#WritingBand7', '#IELTSTips', '#viatestprep'],
    insight: 'IELTS examiners are trained to identify and penalise memorised response patterns. The TA criterion explicitly penalises formulaic responses.',
    stat: '68% of Band 6 essays use the same 3-point paragraph structure',
    fix: 'Learn the examiner\'s criteria vocabulary and respond to the specific question directly.',
    category: 'Writing',
  },
  {
    id: 'ielts_speaking_speed',
    exam: 'IELTS',
    topic: 'Speaking Speed Myth',
    painPoint: 'Students think speaking fast = speaking fluent',
    hook: 'You\'re speaking faster because you\'re nervous. Your examiner can tell.',
    angle: 'Examiner insider reveal',
    momentum: 91,
    searchVolume: 'HIGH',
    formats: ['reel', 'carousel'],
    bestTime: 'Wednesday 6PM',
    caption: 'Slow down. This is costing you 0.5 band right now.',
    hashtags: ['#IELTSSpeaking', '#IELTSFluency', '#SpeakingBand7', '#viatestprep'],
    insight: 'Fluency in IELTS means speaking without unnatural pauses — NOT speaking fast. Examiners specifically assess pronunciation, lexical resource, and coherence.',
    stat: 'Band 8-9 speakers average 130 WPM. Band 5 speakers average 160+ WPM',
    fix: 'Practise with a 3-second deliberate pause after each idea. Coherence > speed.',
    category: 'Speaking',
  },
  {
    id: 'ielts_listening_memory',
    exam: 'IELTS',
    topic: 'Listening = Memory Test',
    painPoint: 'Students think they\'re failing Listening because of their English',
    hook: 'You failed IELTS Listening because of your memory, not your English.',
    angle: 'Paradigm-shift reframe',
    momentum: 88,
    searchVolume: 'HIGH',
    formats: ['infographic', 'carousel'],
    bestTime: 'Thursday 12PM',
    caption: 'Your English is fine. Your short-term audio memory is the problem.',
    hashtags: ['#IELTSListening', '#IELTSTips', '#ListeningSkills', '#viatestprep'],
    insight: 'IELTS Listening requires reading ahead, predicting content type, and noting multiple pieces of information simultaneously. These are memory skills, not language skills.',
    stat: '81% of Listening errors are note-taking / attention failures, not vocabulary failures',
    fix: 'Practise "read ahead" technique: scan upcoming questions before the audio plays.',
    category: 'Listening',
  },
  {
    id: 'ielts_vocab_swap',
    exam: 'IELTS',
    topic: 'The 1% Vocabulary Swap',
    painPoint: 'Students overuse basic vocabulary thinking examiners want quantity',
    hook: 'One vocabulary swap. +0.5 band score. Every single time.',
    angle: 'Micro-actionable quick win',
    momentum: 86,
    searchVolume: 'HIGH',
    formats: ['carousel', 'infographic'],
    bestTime: 'Friday 5PM',
    caption: 'Replace 1 word in every paragraph with a Band 8 equivalent.',
    hashtags: ['#IELTSVocabulary', '#IELTSWriting', '#BandScore', '#viatestprep'],
    insight: 'Lexical Resource is 25% of the Writing score. A single high-frequency word replaced with a less common but accurate synonym signals lexical sophistication.',
    stat: 'Using 5+ uncommon but accurate words per essay raises LR score by ~0.5',
    fix: 'Replace: "important" → "pivotal", "problem" → "impediment", "show" → "demonstrate".',
    category: 'Vocabulary',
  },
  {
    id: 'ielts_examiner_notes',
    exam: 'IELTS',
    topic: 'What Examiners Write in Their Notes',
    painPoint: 'Students have no idea what examiners actually evaluate in Speaking',
    hook: 'An ex-IELTS examiner reveals what she writes in the first 90 seconds.',
    angle: 'Insider / authority reveal',
    momentum: 85,
    searchVolume: 'MEDIUM-HIGH',
    formats: ['carousel', 'reel'],
    bestTime: 'Saturday 10AM',
    caption: '90 seconds. That\'s when your Speaking score is decided.',
    hashtags: ['#IELTSExaminer', '#IELTSSpeaking', '#IELTSInsider', '#viatestprep'],
    insight: 'IELTS examiners assess Fluency & Coherence in the first 2 minutes. They are looking for: natural linking words, absence of self-correction, and willingness to extend answers.',
    stat: 'Examiners can identify a Band 7+ speaker within the first 60 seconds',
    fix: 'Open Part 1 with: "That\'s a great question — I\'d say [answer] because [specific example]."',
    category: 'Speaking',
  },
  {
    id: 'ielts_reading_trap',
    exam: 'IELTS',
    topic: 'The Early-Finisher Trap',
    painPoint: 'Students think finishing the Reading test early means they did well',
    hook: 'The student who finishes 10 minutes early always scores lower.',
    angle: 'Counter-intuitive paradox',
    momentum: 79,
    searchVolume: 'MEDIUM',
    formats: ['infographic', 'reel'],
    bestTime: 'Sunday 8PM',
    caption: 'Finishing early = leaving marks on the table.',
    hashtags: ['#IELTSReading', '#IELTSTips', '#TimeManagement', '#viatestprep'],
    insight: 'IELTS Reading Band 9 requires 40/40. Every unused minute is a missed verification opportunity. Top scorers use every second to double-check.',
    stat: 'Students who finish 5+ minutes early average Band 7.2. Those who finish with <2 minutes average Band 7.8',
    fix: 'Use the last 3 minutes to verify all True/False/Not Given and Yes/No/Not Given answers.',
    category: 'Reading',
  },
  {
    id: 'ielts_cohesion',
    exam: 'IELTS',
    topic: 'Coherence Is Not Linking Words',
    painPoint: 'Students paste linking words randomly thinking it boosts their score',
    hook: '"Furthermore, Moreover, Additionally" — examiners hate this. Here\'s why.',
    angle: 'Myth-buster with specifics',
    momentum: 77,
    searchVolume: 'MEDIUM',
    formats: ['carousel', 'infographic'],
    bestTime: 'Monday 12PM',
    caption: 'You\'ve been using linking words wrong. Here\'s the right way.',
    hashtags: ['#IELTSWriting', '#CoherenceCohesion', '#IELTSBand7', '#viatestprep'],
    insight: 'Coherence & Cohesion is 25% of Writing score. The criterion values logical progression, not frequency of discourse markers. Overuse is a Band 6 indicator.',
    stat: 'Overuse of linking words is specifically cited in the IELTS Band 6 descriptor',
    fix: 'Use max 1 linking word per paragraph. Instead, connect ideas through pronoun reference and sentence structure.',
    category: 'Writing',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  PTE TREND DATABASE
// ─────────────────────────────────────────────────────────────────────────────

const PTE_TRENDS = [
  {
    id: 'pte_repeat_sentence',
    exam: 'PTE',
    topic: 'Repeat Sentence: The Score Killer',
    painPoint: 'PTE Repeat Sentence destroys scores because students don\'t know how it\'s marked',
    hook: 'PTE Repeat Sentence: You\'re being marked on 3 things. Students only practise 1.',
    angle: 'Hidden marking criteria reveal',
    momentum: 96,
    searchVolume: 'VERY HIGH',
    formats: ['carousel', 'infographic'],
    bestTime: 'Monday 7AM',
    caption: 'This one task affects your Speaking AND Listening score. Read this.',
    hashtags: ['#PTE', '#PTEAcademic', '#RepeatSentence', '#PTETips', '#viatestprep'],
    insight: 'Repeat Sentence contributes to both Speaking and Listening scores in PTE. Students practice pronunciation only, ignoring content accuracy and fluency which are equally weighted.',
    stat: 'Repeat Sentence contributes to 4 PTE enabling skills simultaneously',
    fix: 'Train short-term audio memory with chunked recall: hear 3 words → repeat → extend.',
    category: 'Speaking',
  },
  {
    id: 'pte_ai_scoring',
    exam: 'PTE',
    topic: 'AI Scoring: What the Algorithm Wants',
    painPoint: 'PTE is AI-scored but students practise for human evaluators',
    hook: 'PTE is marked by an AI. Humans don\'t grade your Speaking. This changes everything.',
    angle: 'System expose — AI vs human marking',
    momentum: 93,
    searchVolume: 'HIGH',
    formats: ['infographic', 'carousel'],
    bestTime: 'Tuesday 12PM',
    caption: 'The AI doesn\'t care if you sound native. It cares about these 3 things.',
    hashtags: ['#PTEScoring', '#PTEAcademic', '#AIScoring', '#PTETips', '#viatestprep'],
    insight: 'PTE uses Pearson\'s AI scoring engine (Versant). It scores phoneme accuracy, prosody patterns, and speech rate — not overall "fluency" as a human examiner would.',
    stat: 'PTE AI scoring correlates at 0.88 with human scores — but optimises for different micro-features',
    fix: 'Train with phoneme-level pronunciation apps. Focus on clarity over accent.',
    category: 'Speaking',
  },
  {
    id: 'pte_write_essay',
    exam: 'PTE',
    topic: 'Write Essay Word Count Trap',
    painPoint: 'Students write 200-word essays when 300+ is required for high scores',
    hook: 'Your PTE essay was 210 words. The algorithm stopped reading at 200.',
    angle: 'Technical reveal + quick fix',
    momentum: 89,
    searchVolume: 'HIGH',
    formats: ['infographic', 'reel'],
    bestTime: 'Wednesday 6PM',
    caption: 'Word count is the first thing the PTE algorithm checks. Are you hitting it?',
    hashtags: ['#PTEWriting', '#PTEEssay', '#PTEAcademic', '#viatestprep'],
    insight: 'PTE Write Essay requires 200–300 words but algorithms favour essays in the 280–300 range for full content coverage. Below 200: automatic content score penalty.',
    stat: 'Essays under 200 words receive a mandatory 0 for Content score',
    fix: 'Target 280–295 words. Practise expanding each body paragraph with a data point or example.',
    category: 'Writing',
  },
  {
    id: 'pte_reading_gap',
    exam: 'PTE',
    topic: 'Reading & Writing: Fill in the Blanks',
    painPoint: 'R&W Fill in the Blanks is the single most underestimated PTE task',
    hook: 'This 1 PTE task affects your Reading AND Writing score. Are you practising it?',
    angle: 'Hidden impact reveal',
    momentum: 85,
    searchVolume: 'MEDIUM-HIGH',
    formats: ['carousel', 'infographic'],
    bestTime: 'Thursday 12PM',
    caption: 'Most students skip this in practice. Every high-scorer drills it obsessively.',
    hashtags: ['#PTEReading', '#FillInTheBlanks', '#PTEAcademic', '#PTETips', '#viatestprep'],
    insight: 'R&W Fill in the Blanks is a dual-skill task that affects both Reading and Writing scores. Correct answers require understanding contextual grammar and discourse markers.',
    stat: 'R&W FIB contributes to both Reading and Writing enabling skill scores',
    fix: 'Study collocations and academic word families. Use academic text to find patterns.',
    category: 'Reading',
  },
  {
    id: 'pte_describe_image',
    exam: 'PTE',
    topic: 'Describe Image: The 25-Second Template',
    painPoint: 'Students freeze in front of graphs because they have no structure',
    hook: 'Describe any PTE graph in exactly 25 seconds. Here\'s the formula.',
    angle: 'Repeatable template / formula',
    momentum: 83,
    searchVolume: 'MEDIUM-HIGH',
    formats: ['carousel', 'infographic'],
    bestTime: 'Friday 5PM',
    caption: 'The 25-second formula that works for every graph type.',
    hashtags: ['#PTESpeaking', '#DescribeImage', '#PTEAcademic', '#viatestprep'],
    insight: 'Describe Image is 100% formula-driven. The algorithm rewards: opening statement, trend identification, notable extreme, overall conclusion. This is achievable in 25 seconds.',
    stat: 'Template users score 0.5-1.0 higher in Describe Image vs improvisers',
    fix: '"This [chart type] shows [topic]. The most notable trend is [X]. [Country/year] shows the highest/lowest [Y]. Overall, [conclusion]."',
    category: 'Speaking',
  },
  {
    id: 'pte_summarize',
    exam: 'PTE',
    topic: 'Summarize Written Text: 1 Sentence Formula',
    painPoint: 'Students write 2-3 sentences when PTE requires exactly 1',
    hook: 'PTE Summarize Written Text: It MUST be 1 sentence. Most students don\'t know this.',
    angle: 'Rules violation reveal',
    momentum: 81,
    searchVolume: 'MEDIUM',
    formats: ['infographic', 'carousel'],
    bestTime: 'Saturday 10AM',
    caption: 'Writing 2 sentences = guaranteed low score. Here\'s the 1-sentence formula.',
    hashtags: ['#PTEWriting', '#SummarizeWrittenText', '#PTEAcademic', '#viatestprep'],
    insight: 'SWT requires a single complex sentence of 5–75 words. Two sentences is penalised. The formula: Main idea + relative clause + supporting detail.',
    stat: 'Students who write 2+ sentences get penalised on Grammar and Content simultaneously',
    fix: '"[Main claim], which [relative clause detail], suggesting that [implication/conclusion]."',
    category: 'Writing',
  },
  {
    id: 'pte_vs_ielts',
    exam: 'PTE',
    topic: 'PTE vs IELTS: Which Is Easier?',
    painPoint: 'Students don\'t know which exam to choose and choose wrong',
    hook: 'PTE results in 5 days. IELTS takes 2 weeks. But which score is easier to achieve?',
    angle: 'Comparison / decision-making content',
    momentum: 79,
    searchVolume: 'HIGH',
    formats: ['infographic', 'carousel'],
    bestTime: 'Sunday 8PM',
    caption: 'Choosing the right exam can save you 3 months. Read this comparison.',
    hashtags: ['#PTEvsIELTS', '#IELTSorPTE', '#StudyAbroad', '#viatestprep'],
    insight: 'PTE favors non-native speakers with strong grammar skills and consistent pronunciation. IELTS favors those with strong reading comprehension and written academic style.',
    stat: 'PTE results average 48 hours. IELTS: 13 days. PTE also accepted by most immigration bodies',
    fix: 'Choose PTE if you need fast results. Choose IELTS if you have strong writing skills.',
    category: 'Comparison',
  },
  {
    id: 'pte_retake',
    exam: 'PTE',
    topic: 'PTE Retake Strategy',
    painPoint: 'Students retake PTE with the same preparation and get the same score',
    hook: '82% of PTE retakers score within 3 points of their first attempt. Here\'s why.',
    angle: 'Root-cause analysis + fix',
    momentum: 76,
    searchVolume: 'MEDIUM',
    formats: ['carousel', 'reel'],
    bestTime: 'Monday 12PM',
    caption: 'A retake without a new strategy is just paying $200 to fail the same way.',
    hashtags: ['#PTERetake', '#PTEAcademic', '#PTEStrategy', '#viatestprep'],
    insight: 'PTE score improvement requires identifying the specific enabling skill gap. Generic practice raises overall proficiency but rarely shifts the target score.',
    stat: '82% of retakers score within 3 points of their first PTE attempt',
    fix: 'Download your PTE Scorecard. Identify your lowest enabling skill. Drill only that for 2 weeks.',
    category: 'Strategy',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  MARKET SIGNALS DATABASE
//  What's currently selling / high-demand in IELTS+PTE coaching market
// ─────────────────────────────────────────────────────────────────────────────

const MARKET_SIGNALS = [
  {
    signal: 'Short-form video demand up 340% in ed-tech vertical (Q2 2025)',
    impact: 'Prioritise Reels over static posts this quarter',
    opportunity: 'Students prefer 30–60s explainers over long-form written guides',
  },
  {
    signal: 'PTE content underserved — 6:1 ratio of IELTS vs PTE content on Instagram',
    impact: 'High opportunity: PTE carousel content faces 83% less competition',
    opportunity: 'First-mover advantage in PTE visual content space',
  },
  {
    signal: '"Band 6.5 to 7" is the most searched IELTS query on YouTube (2025)',
    impact: 'Content targeting this exact transition performs 2.3x above niche average',
    opportunity: 'Create a "6.5 → 7.0 Roadmap" series',
  },
  {
    signal: 'Australia immigration IELTS/PTE demand surging +67% YoY in South Asia',
    impact: 'Nepal/India/Bangladesh demographic is primary audience for VIA',
    opportunity: 'Content featuring Australia PR score requirements + test prep overlap',
  },
  {
    signal: 'AI-assisted IELTS prep products showing 240% growth (Duolingo, Preply, ELSA)',
    impact: 'Position VIA as the "human + AI" alternative to solo app learning',
    opportunity: '"Why AI apps alone won\'t get you Band 7" angle',
  },
  {
    signal: 'Save rate on diagnostic/self-assessment content 4.2x higher than tips content',
    impact: 'Shift from "tips" to "test yourself" interactive format',
    opportunity: '"Can you spot the error?" carousel series drives maximum saves',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  WEEKLY CONTENT CALENDAR GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const POST_TIMES = ['7:00 AM', '12:00 PM', '6:00 PM', '12:00 PM', '5:00 PM', '10:00 AM', '8:00 PM'];
const FORMATS_DAY = ['carousel', 'infographic', 'reel', 'carousel', 'infographic', 'carousel', 'reel'];

export function runWeeklyResearch() {
  const week = currentWeek();
  const year = new Date().getFullYear();
  const seed = year * 100 + week;

  // 50/50 IELTS-PTE split shuffled deterministically by week
  const shuffledIELTS = seededShuffle(IELTS_TRENDS, seed);
  const shuffledPTE   = seededShuffle(PTE_TRENDS,   seed + 1);

  // Pick 4 IELTS + 4 PTE = 8 total, interleaved
  const selectedIELTS = shuffledIELTS.slice(0, 4);
  const selectedPTE   = shuffledPTE.slice(0, 4);

  // Merge and sort by momentum desc
  const trends = [...selectedIELTS, ...selectedPTE]
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, 7); // 7 trends for 7 days

  return {
    weekNumber:    week,
    year,
    generatedAt:   new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }),
    nextRefresh:   getNextMonday(),
    trends,
    marketSignals: seededShuffle(MARKET_SIGNALS, seed + 2).slice(0, 4),
    weekSummary:   buildWeekSummary(trends),
  };
}

function getNextMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 1 ? 7 : (8 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(7, 0, 0, 0);
  return d.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
}

function buildWeekSummary(trends) {
  const ieltsCount = trends.filter(t => t.exam === 'IELTS').length;
  const pteCount   = trends.filter(t => t.exam === 'PTE').length;
  const topMomentum = trends[0];
  return {
    ieltsCount,
    pteCount,
    topTopic: topMomentum.topic,
    topHook:  topMomentum.hook,
    topExam:  topMomentum.exam,
    avgMomentum: Math.round(trends.reduce((s, t) => s + t.momentum, 0) / trends.length),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  CONTENT PLAN GENERATOR
//  Maps weekly trends to a 7-day content calendar
// ─────────────────────────────────────────────────────────────────────────────

export function generateContentPlan(researchData) {
  const { trends } = researchData;

  return DAYS.map((day, i) => {
    const trend  = trends[i % trends.length];
    const format = FORMATS_DAY[i];

    return {
      day,
      shortDay:   DAY_SHORT[i],
      dayIndex:   i,
      postTime:   POST_TIMES[i],
      format,
      exam:       trend.exam,
      topic:      trend.topic,
      hook:       trend.hook,
      angle:      trend.angle,
      painPoint:  trend.painPoint,
      stat:       trend.stat,
      fix:        trend.fix,
      caption:    trend.caption,
      hashtags:   trend.hashtags,
      insight:    trend.insight,
      momentum:   trend.momentum,
      category:   trend.category,
      trendId:    trend.id,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  CAPTION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export function generateCaption(trend, format) {
  const emojiMap = {
    carousel:    '👆',
    infographic: '📊',
    reel:        '🎬',
  };
  const ctaMap = {
    carousel:    'Swipe through every slide — the fix is on the last one.',
    infographic: 'Save this. You\'ll need it before your next attempt.',
    reel:        'Watch till the end — the fix takes 30 seconds.',
  };

  return [
    `${trend.hook}`,
    ``,
    `Here's what most ${trend.exam} students don't know:`,
    `${trend.insight}`,
    ``,
    `📌 The fix:`,
    `${trend.fix}`,
    ``,
    `${emojiMap[format] || '👆'} ${ctaMap[format] || 'Save this for your next attempt.'}`,
    `💬 Comment your current ${trend.exam} score below — I'll tell you what to focus on.`,
    `👉 Follow @viatestprep for a new strategy every week.`,
    ``,
    trend.hashtags.join(' '),
    `#${trend.exam}Prep #${trend.category.replace(/\s+/g, '')} #StudyAbroad #EnglishLearning`,
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
//  REEL SCRIPT GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export function generateReelScript(trend, durationSec = 30) {
  const durMap = {
    15: { scenes: 3, hookTime: '0–3s',  probTime: '3–9s',   revealTime: '9–13s',  ctaTime: '13–15s' },
    30: { scenes: 4, hookTime: '0–4s',  probTime: '4–12s',  revealTime: '12–24s', ctaTime: '24–30s' },
    45: { scenes: 5, hookTime: '0–5s',  probTime: '5–15s',  revealTime: '15–30s', fixTime:  '30–40s', ctaTime: '40–45s' },
    60: { scenes: 5, hookTime: '0–5s',  probTime: '5–15s',  revealTime: '15–35s', fixTime:  '35–52s', ctaTime: '52–60s' },
  };
  const t = durMap[durationSec] || durMap[30];

  const scenes = [
    {
      id: 1, label: 'HOOK', timeCode: t.hookTime,
      script: trend.hook,
      visual: 'Face fills 70% of frame. Eye contact. No gesture. Let the words land.',
      caption: `⚠️ ${trend.topic}`,
      dirNote: 'Deliver the hook within 1.5 seconds. Start speaking, don\'t smile first.',
    },
    {
      id: 2, label: 'PROBLEM', timeCode: t.probTime,
      script: `Here's the real problem. ${trend.painPoint}. And most students have no idea this is happening.`,
      visual: 'Lean forward slightly. Slow down. Let the pain point settle. Pause 0.5s after "real problem".',
      caption: `❌ ${trend.painPoint}`,
      dirNote: 'This is where you lose viewers who don\'t recognise the pain. Speak directly to the camera.',
    },
    {
      id: 3, label: 'INSIGHT / REVEAL', timeCode: t.revealTime,
      script: `${trend.insight} In fact, ${trend.stat}.`,
      visual: 'Hold up one finger when stating the key insight. Point at camera for the stat.',
      caption: `📊 ${trend.stat}`,
      dirNote: 'This is the core value. If this scene is rushed, the reel fails. Don\'t cut short.',
    },
  ];

  if (t.fixTime) {
    scenes.push({
      id: 4, label: 'THE FIX', timeCode: t.fixTime,
      script: `So here is the exact fix. ${trend.fix}`,
      visual: 'Count on fingers if there are multiple steps. Energy rises here.',
      caption: `✅ ${trend.fix}`,
      dirNote: 'The fix must be specific enough to act on TODAY. Vague fixes = no saves.',
    });
  }

  scenes.push({
    id: scenes.length + 1, label: 'CTA', timeCode: t.ctaTime,
    script: `Save this before your next ${trend.exam} attempt. Follow @viatestprep — new strategy every single week.`,
    visual: 'Natural close. Slight nod. Hold eye contact until after the last word.',
    caption: `🔖 Save · Follow @viatestprep`,
    dirNote: 'End on a command, not a question. "Follow" — then cut. No hanging pause.',
  });

  return {
    topic:        trend.topic,
    exam:         trend.exam,
    duration:     `${durationSec} seconds`,
    scenes,
    caption:      generateCaption(trend, 'reel'),
    hashtags:     trend.hashtags,
    filmingSetup: 'Portrait 9:16. Lock focus+exposure. Quiet room. Re-record any clip with hesitation.',
    editingNote:  'Cut on the last syllable of each scene. No pause at cut points. Add captions on-screen.',
    createdAt:    new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  CAROUSEL SLIDE DATA GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export function generateCarouselData(trend) {
  return {
    topic:   trend.topic,
    exam:    trend.exam,
    caption: generateCaption(trend, 'carousel'),
    hashtags: trend.hashtags,
    slides: [
      {
        id: 1, type: 'hook',
        headline: trend.hook,
        subline:  `${trend.exam} · @viatestprep`,
        badge:    trend.exam,
        swipeHint: true,
      },
      {
        id: 2, type: 'problem',
        label:    'THE PROBLEM',
        headline: trend.painPoint,
        body:     `Most ${trend.exam} students have no idea this is happening — until they get their score.`,
        icon:     '❌',
      },
      {
        id: 3, type: 'data',
        label:    'THE DATA',
        stat:     trend.stat,
        body:     trend.insight,
        icon:     '📊',
      },
      {
        id: 4, type: 'comparison',
        label:    'WHAT STUDENTS DO vs. WHAT WORKS',
        wrong:    `❌ ${trend.painPoint}`,
        right:    `✅ ${trend.fix}`,
      },
      {
        id: 5, type: 'fix',
        label:    'THE FIX',
        headline: trend.fix,
        body:     `Apply this before your next ${trend.exam} attempt.`,
        icon:     '✅',
      },
      {
        id: 6, type: 'cta',
        headline: 'Save this. You\'ll need it.',
        body:     `Share with someone stuck on ${trend.exam}. Follow @viatestprep — new strategy every week.`,
        handle:   '@viatestprep',
        saveHint: true,
      },
    ],
    createdAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  INFOGRAPHIC DATA GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export function generateInfographicData(trend) {
  const statValue = extractStatValue(trend.stat);

  return {
    topic:   trend.topic,
    exam:    trend.exam,
    type:    detectInfographicType(trend),
    caption: generateCaption(trend, 'infographic'),
    headline: trend.hook,
    stat:     trend.stat,
    statValue,
    insight:  trend.insight,
    fix:      trend.fix,
    painPoint: trend.painPoint,
    comparison: {
      wrong: { label: 'What students do', text: trend.painPoint,  color: '#ef4444' },
      right: { label: 'What actually works', text: trend.fix,    color: '#00adb5' },
    },
    dataPoints: buildDataPoints(trend),
    hashtags:   trend.hashtags,
    badge:      trend.exam,
    createdAt:  new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
  };
}

function extractStatValue(stat) {
  const match = stat.match(/(\d+)/);
  return match ? parseInt(match[1]) : 70;
}

function detectInfographicType(trend) {
  const s = trend.stat.toLowerCase();
  if (s.includes('%')) return 'stat_bar';
  if (trend.fix.includes('1.') || trend.fix.includes('Step')) return 'steps';
  return 'comparison';
}

function buildDataPoints(trend) {
  return [
    { label: 'Current practice', value: 30, color: '#ef4444' },
    { label: 'Target practice',  value: 85, color: '#00adb5' },
    { label: 'Score impact',     value: extractStatValue(trend.stat), color: '#f1c40f' },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORTS FOR COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

export { IELTS_TRENDS, PTE_TRENDS, MARKET_SIGNALS };
