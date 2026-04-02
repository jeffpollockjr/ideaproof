# IdeaProof 💡

A full-stack-style React app for **validating and selling business ideas**. Built with React + Vite + Tailwind CSS. Ready to deploy to Vercel.

## What It Does

IdeaProof is a platform that helps idea sellers:
1. **Create & pitch ideas** with structured problem/solution/business model templates
2. **Run surveys** — build custom questions, collect responses, view charts
3. **Test landing pages** — write headline/CTA copy, simulate traffic, track CTR
4. **Run pre-order tests** — set pricing tiers, collect willingness-to-pay signals
5. **Manage email leads** — captured automatically across all validation tools
6. **List ideas on marketplace** — buyers can browse, view validation data, and book discovery calls

---

## Tech Stack

- **React 18** + **React Router v6**
- **Vite** (dev server + build)
- **Tailwind CSS v3**
- **Recharts** (survey & analytics charts)
- **Lucide React** (icons)
- **State**: In-memory React context (resets on refresh — by design for demo)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production

```bash
npm run build
```

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Framework preset will be auto-detected as **Vite**.

### Option B — GitHub + Vercel UI

1. Push this repo to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: IdeaProof"
git remote add origin https://github.com/YOUR_USERNAME/ideaproof.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Framework: **Vite** (auto-detected)
4. Click **Deploy** ✅

The `vercel.json` file handles SPA routing automatically.

---

## Demo Walkthrough

When you click **"Continue as Demo User"** on the login screen, you'll be logged in as **Jordan Rivera** with two pre-loaded ideas:

| Idea | Status | Validation Score |
|------|--------|-----------------|
| 🐾 PetPulse | Validating | 72 |
| 💼 DeskMesh | Listed | 88 |
| ⚖️ LegalDraft AI | Draft | 0 |

### Things to try:

- **Dashboard** — Overview of all stats and upcoming calls
- **Ideas → DeskMesh** — Explore a fully validated idea with rich data across all tabs
- **Survey tab** — View 112 responses with live charts; add a question; simulate a new response
- **Landing Page tab** — Click "Run Traffic Simulation" to generate new traffic metrics
- **Pre-Order tab** — View tier distribution and revenue signal charts
- **Email List tab** — Browse contacts, update statuses, compose a follow-up
- **Marketplace tab** — Toggle listing on/off, preview the public page
- **Marketplace** (top nav) — Browse the buyer marketplace; click DeskMesh → Book a Call
- **Book a Call flow** — Full 4-step: date picker → details → mock payment → confirmation
- **Create a new idea** — 4-step wizard with category, pitch, validation setup, and pricing

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx       # All state management + actions
├── data/
│   └── seedData.js          # Demo data (ideas, responses, users)
├── components/
│   ├── Layout.jsx           # Sidebar + main content wrapper
│   ├── Sidebar.jsx          # Navigation
│   ├── IdeaCard.jsx         # Idea list card
│   ├── Modal.jsx            # Reusable modal overlay
│   └── ValidationBadge.jsx  # Score + status badges
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── MyIdeas.jsx
│   ├── CreateIdea.jsx       # 4-step idea wizard
│   ├── IdeaDetail.jsx       # Main idea workspace (6 tabs)
│   ├── Marketplace.jsx      # Public buyer marketplace
│   ├── IdeaPublicPage.jsx   # Buyer's view of a single idea (gated)
│   ├── BookCall.jsx         # 4-step call booking + mock payment
│   ├── Notifications.jsx
│   ├── Settings.jsx
│   └── tabs/
│       ├── OverviewTab.jsx
│       ├── SurveyTab.jsx
│       ├── LandingPageTab.jsx
│       ├── PreOrderTab.jsx
│       ├── EmailListTab.jsx
│       └── MarketplacePreviewTab.jsx
└── index.css               # Tailwind + custom design system
```

---

## Next Steps (if you want to extend this)

- **Add a real backend** — Supabase or Firebase for persistent data
- **Real auth** — Supabase Auth or Clerk
- **Real payments** — Stripe Checkout for call bookings
- **Email** — Resend or Postmark for follow-up campaigns
- **Shareable survey links** — Public URL that routes to a standalone survey page
- **File uploads** — Let sellers attach PDFs, pitch decks, and financials

---

## Notes

- All data is **in-memory only** — refreshing the browser resets to the seed data. This is intentional for demo purposes.
- No API keys or environment variables are needed.
- The `vercel.json` rewrites ensure React Router works correctly on Vercel.
