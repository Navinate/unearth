# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unearth is an Astro 5 SSR website deployed on Vercel that uses Notion as its database backend. The home page displays weekly media recommendations, and users can submit new recommendations via a form (Astro Actions + Zod validation → Notion).

## Commands

```bash
bun dev          # Dev server at localhost:4321
bun run build    # Production build to ./dist/
bun run preview  # Preview production build
bun run test     # Run tests (Vitest)
bun run test:watch # Run tests in watch mode
```

## Tech Stack

- **Framework**: Astro 5 (SSR mode, Vercel adapter)
- **Styling**: Tailwind CSS 4 + DaisyUI 5 + `@tailwindcss/typography`
- **Data**: Notion API (`@notionhq/client`) — env vars: `NOTION_TOKEN`, `NOTION_SUBMISSION_DB_ID`, `NOTION_MEDIA_DB_ID`, `NOTION_MEDIA_DATASOURCE_ID`
- **Forms**: Astro Actions with Zod schema validation (server-side, creates Notion pages)
- **Testing**: Vitest
- **Deployment**: Vercel with SSR, web analytics, speed insights
- **CI**: GitHub Actions weekly Sunday redeploy (`.github/workflows/weekly-rebuild.yml`)

## Architecture

- `src/pages/` — File-based routing (index, submit)
- `src/actions/index.ts` — Server-side form handlers via Astro Actions
- `src/lib/notion.ts` — Notion client, database query functions (uses DataSources API)
- `src/lib/notionMapper.ts` — Maps Notion page properties to app types
- `src/lib/dateHelpers.ts` — Date formatting and week boundary calculations
- `src/lib/imageDownloader.ts` — Image download and caching for cover images
- `src/lib/embedHelpers.ts` — Video/audio/image embed detection and URL parsing
- `src/layouts/BaseLayout.astro` — Root layout (header, nav, analytics, background)
- `src/components/` — Reusable Astro components (MediaCard, MediaModal, SubmitForm, WeekIndicator, etc.)
- `src/components/media/` — Embed sub-components (VideoEmbed, AudioEmbed, ImagePreview, LinkCard)
- `src/styles/app.css` — Global CSS with Tailwind layers, custom fonts, shadow variables
- `src/types/index.ts` — Shared TypeScript types

## Conventions

- **Path aliases**: Use `@components/*`, `@lib/*`, `@layouts/*`, `@assets/*`, `@styles/*`, `@types/*` (defined in tsconfig.json)
- **Custom fonts**: UT Bekidos and Faculty Glyphic loaded from `public/`
- **Tailwind font families**: `font-bekidos` (defined in tailwind.config.cjs)
