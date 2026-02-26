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

## Deploy to Vercel

```bash
vercel
```

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
