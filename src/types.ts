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
  images: z.array(imageObjectSchema).nullable(),
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
  }),
)
export type Track = z.infer<typeof trackSchema>

export const playedTrackSchema = z.object({
  track: trackSchema,
  userGuess: z.string(),
  isGuessed: z.boolean(),
  score: z.number(),
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
 * Harmonify API
 */

export const createdGameDtoSchema = z.object({
  gameId: z.string().length(4),
  hostGuid: z.string().uuid(),
  nickname: z.string(),
})
export type CreatedGameDto = z.infer<typeof createdGameDtoSchema>

export const gameSettingsDtoSchema = z.object({
  breakDurationBetweenTrackPlays: z.number(),
  breakDurationBetweenRounds: z.number(),
  trackDuration: z.number(),
  roundDuration: z.number(),
  roundCount: z.number(),
  trackStartLowerBound: z.number(),
  trackStartUpperBound: z.number(),
})
export type GameSettingsDto = z.infer<typeof gameSettingsDtoSchema>

export const displayedGuessDtoSchema = z.object({
  guess: z.string(),
  id: z.string(),
})
export type DisplayedGuessDto = z.infer<typeof displayedGuessDtoSchema>

export const gameStartedDtoSchema = z.object({
  possibleGuesses: z.array(displayedGuessDtoSchema),
  gameSettings: gameSettingsDtoSchema,
  roundStartTimestamp: z.number(),
  trackStart_ms: z.number(),
  uri: z.string(),
})
export type GameStartedDto = z.infer<typeof gameStartedDtoSchema>

export const roundResultDtoSchema = z.object({
  score: z.number(),
  guess: z.string(),
})
export type RoundResultDto = z.infer<typeof roundResultDtoSchema>

export const roundStartedDto = z.object({
  roundNumber: z.number(),
  roundStartTimestamp: z.number(),
  trackStart_ms: z.number(),
  uri: z.string(),
})
export type RoundStartedDto = z.infer<typeof roundStartedDto>

export const playerDtoSchema = z.object({
  guid: z.string(),
  nickname: z.string().min(2, { message: 'Username must contain at least 2 characters' })
    .max(50, { message: 'Username must contain at most 50 characters' }),
})
export type PlayerDto = z.infer<typeof playerDtoSchema>

export const playerScoreDtoSchema = playerDtoSchema.and(z.object({
  score: z.number(),
}))
export type PlayerScoreDto = z.infer<typeof playerScoreDtoSchema>

export const roundFinishedDto = z.object({
  track: trackSchema,
  roundResult: roundResultDtoSchema,
  score: z.number(),
  players: z.array(playerScoreDtoSchema),
})
export type RoundFinishedDto = z.infer<typeof roundFinishedDto>

export const endGameResultsDtoSchema = z.object({
  tracks: z.array(trackSchema),
  roundResults: z.array(roundResultDtoSchema),
  score: z.number(),
  players: z.array(playerScoreDtoSchema),
})
export type EndGameResultsDto = z.infer<typeof endGameResultsDtoSchema>

const messageTypeString = 'message'
const errorTypeString = 'messageError'

export const messageSchema = z.discriminatedUnion('$type', [
  z.object({
    $type: z.literal(`${messageTypeString}`),
    type: z.string(),
  }),
  z.object({
    $type: z.literal(`${errorTypeString}`),
    type: z.string(),
    errorMessage: z.string(),
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/createdGameDto`),
    type: z.literal('createdGame'),
    data: createdGameDtoSchema,
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/startGameDto`),
    type: z.literal('startGame'),
    data: z.object({
      tracks: z.array(trackSchema),
      gameSettings: gameSettingsDtoSchema,
    }),
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/gameStartedDto`),
    type: z.literal('gameStarted'),
    data: gameStartedDtoSchema,
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/playerInfoDto`),
    type: z.literal('newPlayer'),
    data: playerDtoSchema,
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/playerList`),
    type: z.literal('playerList'),
    data: z.array(playerDtoSchema),
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/roundStartedDto`),
    type: z.literal('nextRound'),
    data: roundStartedDto,
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/roundFinishedDto`),
    type: z.literal('nextRound'),
    data: roundFinishedDto,
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/endGameResultsDto`),
    type: z.literal('endGameResults'),
    data: endGameResultsDtoSchema,
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/string`),
    type: z.string(),
    data: z.string(),
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/int`),
    type: z.string(),
    data: z.number(),
  }),
  z.object({
    $type: z.literal(`${messageTypeString}/long`),
    type: z.string(),
    data: z.number(),
  }),
])

export type Message = z.infer<typeof messageSchema>

/**
 * Game types
 */

export const musicPlayDataSchema = z.object({
  uri: z.string(),
  trackStart_ms: z.number(),
})
export type MusicPlayData = z.infer<typeof musicPlayDataSchema>

export const guessLevelSchema = z.union([
  z.literal('full'),
  z.literal('author'),
  z.literal('none'),
])
export type GuessLevel = z.infer<typeof guessLevelSchema>

export const playerSchema = playerDtoSchema.and(z.object({
  isHost: z.boolean(),
}))
export type Player = z.infer<typeof playerSchema>

export const gameDataSchema = z.object({
  id: z.string().length(4),
  selfPlayer: playerSchema,
  round: z.number(),
  gameSettings: gameSettingsDtoSchema,
  possibleGuesses: z.array(displayedGuessDtoSchema),
  musicPlayData: musicPlayDataSchema,
})
export type GameData = z.infer<typeof gameDataSchema>

export interface MusicPlayer {
  _turnOn: () => Promise<void>
  _play: (track: MusicPlayData) => Promise<void>
  _seek: (time_ms: number) => Promise<void>
  _resume: () => Promise<void>
  _pause: () => Promise<void>
  /**
   * @param volume in range 0 to 1
   * @returns
   */
  _setVolume: (volume: number) => Promise<void>
}
