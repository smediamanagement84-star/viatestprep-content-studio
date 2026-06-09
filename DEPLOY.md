# ViAtestprep Content Studio — Deployment Guide

## Prerequisites
- Node.js 18+ installed (`node --version`)
- Git installed (`git --version`)
- A Vercel or Netlify account (free tier works)

---

## Step 1 — Install Dependencies

Open your terminal, navigate into the project folder, and run:

```bash
cd viatestprep-studio
npm install
```

This installs React, Framer Motion, Lucide React, html2canvas, Tailwind CSS, and Vite.

---

## Step 2 — Run Locally (verify it works)

```bash
npm run dev
```

Open http://localhost:5173 in your browser. You should see the dark studio interface.

**Quick smoke test:**
1. Dashboard tab → Enter a niche → click "Generate" → 7-day calendar populates
2. Generator tab → Asset Generator → Mode A → enter a topic → "Generate 6-Slide Blueprint" → slides appear
3. Generator tab → Mode B → enter a topic → "Compile Animation" → auto-redirects to Preview tab
4. Preview tab → animation plays → click "Download PNG" → file saves

---

## Step 3 — Build for Production

```bash
npm run build
```

This creates a `dist/` folder containing the optimised static site.
Preview it locally with:

```bash
npm run preview
```

---

## Step 4 — Push to GitHub

```bash
# Initialise git (if not already a repo)
git init
git add .
git commit -m "feat: initial ViAtestprep Content Studio build"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/viatestprep-studio.git
git branch -M main
git push -u origin main
```

---

## Step 5A — Deploy to Vercel (recommended)

**Option 1: Vercel CLI**
```bash
npm install -g vercel
vercel          # follow the prompts — select "Vite" as framework
vercel --prod   # promote to production
```

**Option 2: Vercel Dashboard**
1. Go to https://vercel.com → "Add New Project"
2. Import your GitHub repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

Your studio is live at `https://viatestprep-studio.vercel.app` (or your custom domain).

---

## Step 5B — Deploy to Netlify (alternative)

**Option 1: Netlify CLI**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --dir=dist --prod
```

**Option 2: Netlify Dashboard**
1. Go to https://app.netlify.com → "Add new site" → "Import from Git"
2. Connect your GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy site**

---

## Environment Notes

No environment variables are required. The app is fully client-side with no API keys.

If you add an AI API (OpenAI/Anthropic) later for dynamic script generation, add a `.env` file:

```
VITE_OPENAI_KEY=sk-...
```

Access it in code as `import.meta.env.VITE_OPENAI_KEY`.

---

## Project Structure Reference

```
viatestprep-studio/
├── index.html                  ← App entry point
├── package.json                ← Dependencies & scripts
├── vite.config.js              ← Vite config (React plugin)
├── tailwind.config.js          ← Custom colours: obsidian, orange
├── postcss.config.js           ← Tailwind + Autoprefixer
└── src/
    ├── main.jsx                ← React root render
    ├── App.jsx                 ← SPA shell, global state, tab routing
    ├── index.css               ← Tailwind + custom: glass, viewport-916, safe-text
    ├── lib/
    │   └── contentLogic.js     ← All intelligence: CONTENT_LIBRARY, generators
    └── components/
        ├── Dashboard.jsx       ← Module 1: Strategy Command Center
        ├── Generator.jsx       ← Module 2: Script Writer + Animation Compiler
        └── Previewer.jsx       ← Module 3: 9:16 viewport + html2canvas export
```

---

## Extending the Studio

**Add more niches:** Edit `CONTENT_LIBRARY` in `src/lib/contentLogic.js` — add a new key with `label`, `emoji`, `painPoints`, `paradox`, `paradoxExplainer`, `quickTip`.

**Change animation timing:** Edit `timing.sceneDuration` in `generateAnimationData()` (default: 3000ms).

**Add real AI generation:** Replace the template functions in `contentLogic.js` with `fetch()` calls to OpenAI/Anthropic — the component interfaces don't change.

**Custom domain on Vercel:** Settings → Domains → Add your domain → update DNS CNAME to `cname.vercel-dns.com`.
