# Architectural Patterns

## Schema-First Type Safety with Zod

All external data (Spotify API, WebSocket messages) is validated at runtime using Zod schemas. TypeScript types are inferred from these schemas via `z.infer<>`, ensuring runtime and compile-time types stay in sync.

- Schemas defined in `src/types.ts` (Spotify + game DTOs) and `src/types/coverCreator.types.ts` (Cover Creator)
- Pattern: define `const fooSchema = z.object({...})` then `export type Foo = z.infer<typeof fooSchema>`
- Schemas compose via `.extend()` (e.g., `trackSchema` extends `simplifiedTrackObjectSchema` — `src/types.ts:63`) and generics (`getAlbumSchema<T>` — `src/types.ts:15`)
- WebSocket messages use `z.discriminatedUnion` on the `$type` field — `src/types.ts:180`
- API serverless functions also validate with inline Zod schemas — `api/token/callback.ts:32`, `api/token/refresh.ts:17`

## Namespace-Style Service Exports

Services are exported as namespaces via barrel files, then consumed as `SpotifyService.methodName()`. This provides a clean calling convention without classes.

- `src/services/spotify.ts` — stateless functions (each receives `access_token` + `router`)
- `src/services/index.ts` — re-exports as `export * as SpotifyService from './spotify'`
- Consumed in stores: `SpotifyService.getTracksFromPlaylists(...)` — `src/stores/spotifyLibrary.ts:45`

## Centralized HTTP Layer with Auth Redirect

All Spotify API calls go through `fetchFromSpotify()` (`src/lib/spotify.ts:4`), which:

- Prepends `VITE_SPOTIFY_URL` base for relative paths
- Attaches `Authorization: Bearer` header
- Redirects to `/api/token/expired` on 400/401 (triggers token refresh flow)
- Redirects to disclaimer page on 403

Paginated endpoints use `getAllPaginatedItems()` (`src/lib/spotify.ts:33`) — a generic cursor-following loop that validates each page with a Zod schema.

## MusicPlayer Interface Abstraction

Audio playback is abstracted behind a `MusicPlayer` interface (`src/types.ts:267`) with two implementations:

- **SpotifyPlayer** (`src/components/SpotifyPlayer.vue`) — wraps the Spotify Web Playback SDK, injects via `onSpotifyWebPlaybackSDKReady` global callback
- **PreviewPlayer** (`src/components/PreviewPlayer.vue`) — uses a plain `<audio>` element with `@vueuse/core` `useMediaControls`

Both implementations assign to `musicPlayerStore.player`, so the rest of the app is player-agnostic. The store (`src/stores/musicPlayer.ts`) wraps each method (play, pause, seek, setVolume) and delegates to the current `player`.

## Pinia Store Organization

Stores are domain-scoped in `src/stores/`, re-exported via barrel (`src/stores/index.ts`):

| Store | Concern |
|-------|---------|
| `connection` | WebSocket lifecycle, message dispatch |
| `gameData` | Current game state (room, players, round, settings) |
| `musicPlayer` | Audio playback abstraction |
| `result` | Round + game scoring, sorted leaderboards |
| `settings` | User preferences (autoplay, animations, visualizer) |
| `spotifyLibrary` | Playlist/album selection, track fetching |
| `covers` | Saved cover art (Cover Creator feature) |

Two store definition styles are used:
- **Options API** (`defineStore('name', { state, getters, actions })`) — used by most stores
- **Setup function** (`defineStore('name', () => {...})`) — used by `spotifyLibrary` (`src/stores/spotifyLibrary.ts:8`) when computed refs are preferred

## LocalStorage Persistence via VueUse

User preferences are persisted to `localStorage` using `useStorage()` from `@vueuse/core`. Keys are centralized in `src/consts.ts:1` as `LOCAL_STORAGE` const object.

Used in: `settings` store (autoplay, animations, visualizer), `musicPlayer` store (volume), `covers` store (saved covers).

## WebSocket Message Handling Pattern

The connection store (`src/stores/connection.ts`) manages a single WebSocket:

1. Views register a `handleMessage` callback via `connectionStore.openConnection()` or by reassigning `connectionStore.handleMessage` in `onBeforeMount`
2. The store's internal `handleMessageWrapper` first parses+validates the raw message with `messageSchema.parse()`, then handles cross-cutting concerns (player list updates, pause/resume, end-game navigation), and finally delegates to the view-specific handler
3. Each game view (Setup, Round, RoundResult) swaps in its own handler via `onBeforeMount` — `src/views/game/SetupView.vue:26`, `src/views/game/RoundView.vue:32`, `src/views/game/RoundResultView.vue:19`

## Route Guards for Connection Management

`src/router/index.ts:54` — `beforeGameEnter` guard on the `/game` parent route:

- Skips if WebSocket already exists
- Opens a connection and waits for a `playerInfoDto` message (wrapped in a Promise)
- On success: joins the game and redirects to setup
- On failure: redirects to home

## shadcn-vue UI Components

UI primitives in `src/components/ui/` follow the shadcn-vue pattern:

- Built on `reka-ui` headless primitives
- Styled with TailwindCSS + `class-variance-authority` (CVA) for variants
- Each component folder has an `index.ts` barrel exporting the component + variant definitions
- `cn()` utility (`src/lib/utils.ts:6`) merges Tailwind classes via `clsx` + `tailwind-merge`

## Responsive Layout Strategy

Responsive behavior is handled programmatically via `useWindowSize()` from VueUse, compared against breakpoint enums from `src/consts.ts:52`:

```
const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)
```

This pattern appears in: `GameLayout.vue:18`, `SetupView.vue:41`, `RoundResultView.vue:35`, `ResultView.vue:23`. Desktop vs mobile views are conditionally rendered (e.g., `DesktopResultView` / `MobileResultView`).

## Serverless API (Vercel Functions)

OAuth token management lives in `api/token/` as Vercel Functions:

| Endpoint | Purpose |
|----------|---------|
| `request` | Redirects to Spotify OAuth authorize URL |
| `callback` | Exchanges auth code for tokens, sets cookies |
| `refresh` | Uses refresh_token cookie to get new access_token |
| `expired` | Clears cookies, redirects to request |

Tokens are stored as HTTP cookies. `access_token` is client-readable; `refresh_token` is `HttpOnly`. Shared helpers in `api/token/common.ts`.
