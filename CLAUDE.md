# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Type-check + production build
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm type-check       # Vue/TypeScript type checking
pnpm test:unit        # Run unit tests with Vitest
pnpm test:e2e:dev     # Run e2e tests (Cypress) against dev server
```

Run a single unit test file:
```bash
pnpm vitest src/lib/__tests__/track.spec.ts
```

Run a single e2e test:
```bash
pnpm cypress run --spec "cypress/e2e/[test-file].cy.ts"
```

## Architecture

Harmonify is a multiplayer "Name that tune" game. Players join a room, listen to Spotify track previews, and race to guess the track/artist/album. Points are awarded by speed and accuracy.

**Tech stack:** Vue 3 (Composition API) + Pinia + Vue Router + TailwindCSS + shadcn-vue + Vite + TypeScript + Zod. Deployed on Vercel with Vercel Functions for API routes.

**Key patterns:**

- `src/types.ts` — All Zod schemas for runtime validation of Spotify API responses and WebSocket messages. TypeScript types are inferred from these schemas.
- `src/stores/` — Pinia stores organized by domain: `connection` (WebSocket state), `gameData` (round/game logic), `musicPlayer` (audio playback), `result` (scoring), `settings` (user prefs), `spotifyLibrary` (playlists/albums), `covers` (cover creator).
- `src/services/spotify.ts` — Spotify Web API wrapper. OAuth flow handled here.
- `src/router/index.ts` — Route guards (`beforeGameEnter`) establish the WebSocket connection before entering game routes.
- `src/consts.ts` — LocalStorage keys, animation durations, responsive breakpoints.

**Real-time multiplayer** uses WebSockets via the `connection` store. Messages are typed and validated with Zod schemas defined in `types.ts`.

**Cover Creator** (`src/views/CoverCreator.vue` + `src/components/coverCreator/`) is a standalone canvas-based feature for generating playlist cover art, independent from the game logic.

**Environment variables:** `VITE_SPOTIFY_URL` — Spotify API base URL.
