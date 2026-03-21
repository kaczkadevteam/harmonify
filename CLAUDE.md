# CLAUDE.md

## Project Overview

Harmonify is a multiplayer "Name that tune" game. Players join a room, listen to Spotify track previews, and race to guess the track/artist/album. Points are awarded by speed and accuracy. Also includes a standalone Cover Creator for generating playlist cover art.

## Tech Stack

Vue 3 (Composition API, `<script setup>`) + TypeScript + Pinia + Vue Router + TailwindCSS + Zod
UI: shadcn-vue (built on reka-ui) + class-variance-authority + lucide-vue-next
Build: Vite + Vercel (hosting + serverless functions)
Testing: Vitest (unit) + Cypress (e2e)
Linting: @antfu/eslint-config + eslint-plugin-tailwindcss

## Commands

```bash
pnpm dev                # Dev server
pnpm build              # Type-check + production build
pnpm lint               # ESLint
pnpm lint:fix           # ESLint with auto-fix
pnpm type-check         # vue-tsc type checking

pnpm test:unit          # Unit tests (Vitest, watch mode)
pnpm vitest run         # Unit tests (single run)
pnpm vitest src/lib/__tests__/track.spec.ts  # Single test file

pnpm test:e2e:dev       # E2E tests against dev server
pnpm cypress run --spec "cypress/e2e/[file].cy.ts"  # Single e2e test
```

## Project Structure

```
src/
├── types.ts              # Zod schemas + inferred TS types (Spotify API, WebSocket messages, game DTOs)
├── types/                # Additional types (coverCreator.types.ts)
├── consts.ts             # LocalStorage keys, animation durations, responsive breakpoints
├── stores/               # Pinia stores by domain (connection, gameData, musicPlayer, result, settings, spotifyLibrary, covers)
├── services/spotify.ts   # Spotify Web API service functions (stateless, namespace-exported)
├── lib/spotify.ts        # Low-level fetch wrapper (auth headers, token refresh, pagination)
├── lib/track.ts          # Track utility functions
├── lib/utils.ts          # cn() Tailwind class merge utility
├── router/index.ts       # Routes + beforeGameEnter guard (WebSocket connection setup)
├── views/                # Page-level components (Home, GameLayout, CoverCreator, game/*)
├── components/           # Reusable components organized by feature
│   ├── ui/               # shadcn-vue primitives (button, dialog, toast, etc.)
│   ├── round/            # In-game round UI (timer, search, playback)
│   ├── roundResult/      # Round result display
│   ├── result/           # Final game result (Desktop/Mobile variants)
│   ├── setup/            # Game setup UI (host view, nickname, library)
│   ├── coverCreator/     # Cover Creator components
│   └── trackDisplay/     # Track/guess display components
api/
└── token/                # Vercel serverless functions for Spotify OAuth (request, callback, refresh, expired)
```

## Environment Variables

- `VITE_SPOTIFY_URL` — Spotify API base URL (client-side)
- `VITE_WEB_SOCKET_URL` — WebSocket server URL (client-side)
- `CLIENT_ID`, `CLIENT_SECRET`, `SCOPE`, `STATE` — Spotify OAuth (server-side, in Vercel Functions)

## Key Conventions

- **Schema-first types**: define Zod schema, infer TS type with `z.infer<>` — never define types separately from their runtime validation
- **Store access**: import from `@/stores` barrel, not individual store files
- **Service access**: use `SpotifyService.method()` namespace pattern via `@/services` barrel
- **Path alias**: `@/` maps to `src/`
- **WebSocket messages**: validated with `messageSchema` discriminated union on `$type` field (`src/types.ts:180`)
- **Audio playback**: abstracted via `MusicPlayer` interface — two implementations (Spotify SDK, HTML audio)

## Additional Documentation

Check these files for deeper context when working in related areas:

| File | When to check |
|------|---------------|
| [.claude/docs/architectural_patterns.md](.claude/docs/architectural_patterns.md) | Modifying stores, services, WebSocket handling, auth flow, UI components, or adding new features |
