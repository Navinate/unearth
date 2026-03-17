# Unearth

A weekly media discovery platform built with Astro 5. Unearth curates and displays media recommendations each week — text, video, audio, images, and more — powered by a Notion backend.

## Features

- **Weekly media feed** — Browse curated recommendations refreshed every Sunday
- **Rich embeds** — YouTube, Vimeo, Spotify, SoundCloud, and direct image previews
- **Community submissions** — Anyone can recommend media via the submit form
- **Server-side rendering** — Fast, SEO-friendly pages via Astro SSR on Vercel

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | [Astro 5](https://astro.build/) (SSR) |
| Styling | Tailwind CSS 4 + DaisyUI 5 + `@tailwindcss/typography` |
| Data | [Notion API](https://developers.notion.com/) (DataSources API) |
| Forms | Astro Actions + Zod validation |
| Testing | Vitest |
| Deployment | Vercel |
| CI | GitHub Actions (weekly Sunday redeploy) |

## Project Structure

```text
src/
├── actions/          # Server-side form handlers (Astro Actions)
├── components/       # Astro components (MediaCard, MediaModal, SubmitForm, etc.)
│   ├── __tests__/    # Component tests
│   └── media/        # Embed sub-components (VideoEmbed, AudioEmbed, etc.)
├── layouts/          # BaseLayout with nav, analytics, background
├── lib/              # Core logic
│   ├── __tests__/    # Library tests
│   ├── dateHelpers.ts
│   ├── embedHelpers.ts
│   ├── imageDownloader.ts
│   ├── notion.ts
│   └── notionMapper.ts
├── pages/            # File-based routing (index, submit)
├── styles/           # Global CSS with Tailwind layers
└── types/            # Shared TypeScript types
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- A [Notion integration](https://developers.notion.com/docs/create-a-notion-integration) with access to your databases

### Environment Variables

```env
NOTION_TOKEN=
NOTION_SUBMISSION_DB_ID=
NOTION_MEDIA_DB_ID=
NOTION_MEDIA_DATASOURCE_ID=
```

### Commands

| Command | Action |
| :--- | :--- |
| `bun install` | Install dependencies |
| `bun dev` | Start dev server at `localhost:4321` |
| `bun run build` | Production build to `./dist/` |
| `bun run preview` | Preview production build |
| `bun run test` | Run tests (Vitest) |
| `bun run test:watch` | Run tests in watch mode |
