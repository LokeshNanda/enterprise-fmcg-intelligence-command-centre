# Enterprise FMCG Intelligence Command Centre

A cinematic, futuristic enterprise dashboard for a large FMCG conglomerate — inspired by Bloomberg Terminal × Palantir Gotham × Tesla UI.

## Features

- **6 Animated KPIs**: Global Revenue, Sales Growth, Distribution Reach, Production Efficiency, Working Capital Days, Enterprise Risk Index
- **India Heatmap**: Revenue/risk toggle with state-level drill-down and floating drawer
- **Manufacturing Intelligence**: OEE, Production vs Demand, Downtime, Raw Material Volatility, Energy Efficiency
- **Sales & Distribution**: Dealer leaderboard, SKU momentum, Promotion ROI
- **Finance & Liquidity**: Cash conversion cycle, inventory days, credit risk, working capital trend
- **AI Executive Insights**: Auto-generated 3–4 bullet observations from mock data
- **20-second data refresh** with smooth animated transitions
- **Dark theme** with neon blue accents, glassmorphism panels, animated background grid

## Tech Stack

- Next.js 14 (App Router)
- TailwindCSS
- Framer Motion
- Recharts
- react-simple-maps (India choropleth, no API key required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

### Build and run

```bash
docker build -t fmcg-command-centre .
docker run -p 3000:3000 fmcg-command-centre
```

Or with Docker Compose:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Pass env vars when running:

```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... fmcg-command-centre
```

With Docker Compose, create a `.env` file (copy from `.env.example`) in the project root—Compose will pass `OPENAI_API_KEY` to the container automatically.

## Deploy to Vercel

The easiest way to deploy is with [Vercel](https://vercel.com).

### Option 1: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts to link your project or create a new one.

### Option 2: Deploy from Git

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel will auto-detect Next.js and configure the build.

### Environment Variables

For AI-powered features (Ask Your Data, LLM insights), add in Vercel:

| Variable        | Description                          | Required |
|----------------|--------------------------------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-powered insights | Optional (falls back to rule-based) |

**Settings → Environment Variables** in your Vercel project dashboard.

## Project Structure

```
/app
  api/metrics/route.ts   # Mock data API
  page.tsx               # Main dashboard
  layout.tsx
  globals.css

/components
  KPIBar.tsx
  IndiaHeatMap.tsx
  ManufacturingPanel.tsx
  SalesPanel.tsx
  FinancePanel.tsx
  AIInsights.tsx
  BackgroundGrid.tsx
  AnimatedCounter.tsx

/lib
  mockData.ts    # Realistic enterprise mock data
  aiSummary.ts   # AI-derived insights
  types.ts       # TypeScript interfaces
```
