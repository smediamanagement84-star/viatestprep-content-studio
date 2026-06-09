// ─────────────────────────────────────────────────────────────────────────────
//  src/lib/brandTokens.js
//  VIA Testprep — Official Brand Design System
//  Derived from @viatestprep Instagram visual identity
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg:          '#08162b',   // deep navy — primary background
  bgCard:      '#0d1f3c',   // slightly lighter card background
  bgCard2:     '#091a35',   // secondary card variant
  bgGlass:     'rgba(255,255,255,0.03)',
  bgGoldGlow:  'rgba(241,196,15,0.06)',
  bgTealGlow:  'rgba(0,173,181,0.06)',

  // ── Brand Colors ─────────────────────────────────────────────────────────
  gold:        '#f1c40f',   // primary accent — hooks, stats, band scores
  goldBright:  '#ffd700',   // highlights
  goldDim:     'rgba(241,196,15,0.18)',
  goldBorder:  'rgba(241,196,15,0.25)',

  teal:        '#00adb5',   // secondary accent — borders, sub-headers
  tealBright:  '#00e5ff',   // highlights
  tealDim:     'rgba(0,173,181,0.18)',
  tealBorder:  'rgba(0,173,181,0.25)',

  orange:      '#FF6B00',   // existing brand orange (kept for compatibility)

  // ── Typography ───────────────────────────────────────────────────────────
  white:       '#ffffff',
  dim:         'rgba(255,255,255,0.55)',
  dimmer:      'rgba(255,255,255,0.3)',
  dimmest:     'rgba(255,255,255,0.12)',
  font:        "'Inter', 'Poppins', system-ui, sans-serif",

  // ── UI Elements ──────────────────────────────────────────────────────────
  border:      'rgba(255,255,255,0.07)',
  borderGold:  'rgba(241,196,15,0.25)',
  borderTeal:  'rgba(0,173,181,0.25)',
  radius:      '14px',
  radiusSm:    '8px',
  radiusLg:    '20px',

  // ── Gradients ────────────────────────────────────────────────────────────
  gradGold:    'linear-gradient(135deg, #f1c40f 0%, #ff9500 100%)',
  gradTeal:    'linear-gradient(135deg, #00adb5 0%, #0099cc 100%)',
  gradNavy:    'linear-gradient(160deg, #0d1f3c 0%, #08162b 100%)',
  gradCard:    'linear-gradient(135deg, rgba(13,31,60,0.9) 0%, rgba(8,22,43,0.95) 100%)',

  // ── Shadows ──────────────────────────────────────────────────────────────
  shadowGold:  '0 0 24px rgba(241,196,15,0.18)',
  shadowTeal:  '0 0 24px rgba(0,173,181,0.18)',
  shadowCard:  '0 4px 32px rgba(0,0,0,0.4)',
};

// ── Content dimension presets ────────────────────────────────────────────────
export const DIMENSIONS = {
  instagram_square: { w: 1080, h: 1080, label: 'Instagram Square (1:1)' },
  instagram_portrait: { w: 1080, h: 1350, label: 'Instagram Portrait (4:5)' },
  instagram_story: { w: 1080, h: 1920, label: 'Story / Reel (9:16)' },
};
