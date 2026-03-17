# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unearth is an Astro 5 SSR website deployed on Vercel that uses Notion as its database backend. Users can submit media recommendations via a form (Astro Actions + Zod validation → Notion). The site is in early development with a "coming soon" landing page.

## Commands

```bash
bun dev        # Dev server at localhost:4321
bun run build  # Production build to ./dist/
bun run preview # Preview production build
```

No test or lint commands are configured.

## Tech Stack

- **Framework**: Astro 5 (SSR mode, Vercel adapter) + Svelte 5 for interactive components
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Data**: Notion API (`@notionhq/client`) — env vars: `NOTION_TOKEN`, `NOTION_SUBMISSION_DB_ID`, `NOTION_MEDIA_DB_ID`
- **Forms**: Astro Actions with Zod schema validation (server-side, creates Notion pages)
- **Deployment**: Vercel with SSR, web analytics, speed insights
- **CI**: GitHub Actions weekly Sunday redeploy (`.github/workflows/weekly-rebuild.yml`)

## Architecture

- `src/pages/` — File-based routing (index, submit)
- `src/actions/index.ts` — Server-side form handlers via Astro Actions
- `src/lib/notion.ts` — Notion client, database query functions
- `src/layouts/BaseLayout.astro` — Root layout (header, analytics, background)
- `src/components/` — Reusable Astro components
- `src/styles/app.css` — Global CSS with Tailwind layers, custom fonts, shadow variables
- `src/types/index.ts` — Shared TypeScript types

## Conventions

- **Path aliases**: Use `@components/*`, `@lib/*`, `@layouts/*`, `@assets/*`, `@styles/*`, `@types/*` (defined in tsconfig.json)
- **Custom fonts**: UT Bekidos and Faculty Glyphic loaded from `public/`
- **Tailwind font families**: `font-bekidos`, `font-boldonse` (defined in tailwind.config.cjs)
