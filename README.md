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
- Mapbox GL (optional — fallback state grid when no token)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Mapbox (Optional)

For the interactive India choropleth map, add a Mapbox access token:

1. Create a free account at [mapbox.com](https://account.mapbox.com/)
2. Copy your public token
3. Create `.env.local`:

```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

Without the token, the map shows a state grid fallback.

## Deploy to Vercel

```bash
vercel
```

Set `NEXT_PUBLIC_MAPBOX_TOKEN` in Vercel environment variables if using the map.

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
