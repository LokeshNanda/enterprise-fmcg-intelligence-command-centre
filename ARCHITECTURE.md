# Application Architecture

## Folder Structure

/app
  /api
    metrics/route.ts
  page.tsx

/components
  KPIBar.tsx
  IndiaHeatMap.tsx
  ManufacturingPanel.tsx
  SalesPanel.tsx
  FinancePanel.tsx
  AIInsights.tsx
  BackgroundGrid.tsx

/lib
  mockData.ts
  aiSummary.ts

/styles
  globals.css

---

## Data Flow

Client:
- Calls /api/metrics
- Receives full dashboard JSON

Server:
- Generates realistic mock enterprise data
- Runs summary generator
- Returns combined response

---

## State Management

Use:
- React hooks
- setInterval for refresh
- Framer Motion for animation