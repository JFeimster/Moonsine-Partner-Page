# Moonshine Partner Recruitment Page (Next.js + Tailwind)

## What's included
- `app/page.tsx` — full landing page (calculator, tiers, FAQ, application, modals)
- `app/api/apply/route.ts` — POST endpoint stub for form submissions
- `lib/tracking.ts` — lightweight event tracking helper
- `app/layout.tsx`, `app/globals.css`

## Run locally
1. Create a Next.js app with Tailwind (Next 13+ / 14+ App Router)
2. Copy these files into the generated project (or merge)
3. `npm install`
4. `npm run dev`

## Notes
- Replace `/hero-loop.mp4` and `/hero-poster.jpg` with your real assets (place in `public/`)
- Replace Calendly URL and video embed URL
- Wire `/api/apply` to your CRM webhook (env: `CRM_WEBHOOK_URL`)

## Deploy to Vercel
- Import this folder as a project.
- Framework preset: Next.js
- Build command: `next build` (default)
- Output: `.next` (default)

**Important:** Replace `public/hero-loop.mp4` and `public/hero-poster.jpg` with real assets.
