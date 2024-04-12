import { z } from 'zod'

/**
 * Spotify API types
 */

export const imageObjectSchema = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
})

export type ImageObject = z.infer<typeof imageObjectSchema>

export function getAlbumSchema<T>(schema: z.ZodType<T>) {
  return z.object({
    id: z.string(),
    images: z.array(imageObjectSchema),
    name: z.string(),
    tracks: z.object({
      items: z.array(schema),
    }),
  })
}
export interface Album<T> {
  id: string
  images: ImageObject[]
  name: string
  tracks: {
    items: T[]
  }
}

export const simplePlaylistObjectSchema = z.object({
  id: z.string(),
  images: z.array(imageObjectSchema),
  name: z.string(),
  tracks: z.object({
    href: z.string(),
    total: z.number(),
  }),
})
export type SimplePlaylistObject = z.infer<typeof simplePlaylistObjectSchema>

export const simplifiedTrackObjectSchema = z.object({
  artists: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
    }),
  ),
  duration_ms: z.number(),
  name: z.string(),
  uri: z.string(),
})
export type SimplifiedTrackObject = z.infer<typeof simplifiedTrackObjectSchema>

/**
 * Spotify types extended with game logic
 */

export const trackSchema = simplifiedTrackObjectSchema.and(
  z.object({
    album: z.object({
      name: z.string(),
      images: z.array(imageObjectSchema),
    }),
    guess: z.string().optional(),
    trackStart_ms: z.number().optional(),
  }),
)
export type Track = z.infer<typeof trackSchema>

export const playedTrackSchema = z.object({
  track: trackSchema,
  userGuess: z.string(),
  isGuessed: z.boolean(),
  playDuration: z.number(),
})
export type PlayedTrack = z.infer<typeof playedTrackSchema>

export const selectablePlaylistSchema = simplePlaylistObjectSchema.and(z.object({
  selected: z.boolean(),
}))
export type SelectablePlaylist = z.infer<typeof selectablePlaylistSchema>

export const selectableAlbumSchema = getAlbumSchema(trackSchema).and(z.object({
  selected: z.boolean(),
}))
export type SelectableAlbum = z.infer<typeof selectableAlbumSchema>

/**
 * Game types
 */

export const guessLevelSchema = z.union([
  z.literal('full'),
  z.literal('author'),
  z.literal('none'),
])
export type GuessLevel = z.infer<typeof guessLevelSchema>

export const gameDataSchema = z.object({
  roundCount: z.number(),
  roundDuration: z.number(),
  trackDuration: z.number(),
  trackLowerLimit_perc: z.number(),
  trackUpperLimit_perc: z.number(),
  tracks: z.array(trackSchema),
  selectedTracks: z.array(trackSchema),
})
export type GameData = z.infer<typeof gameDataSchema>

export const gameResultSchema = z.object({
  score: z.number(),
  playedTracks: z.array(playedTrackSchema),
})
export type GameResult = z.infer<typeof gameResultSchema>
