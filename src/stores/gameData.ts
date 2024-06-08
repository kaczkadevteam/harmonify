import { defineStore } from 'pinia'
import { z } from 'zod'
import { type CreatedGameDto, type GameStartedDto, type PlayerDto, displayedGuessDtoSchema, gameSettingsDtoSchema, musicPlayDataSchema, playerDtoSchema, playerSchema } from '@/types'

export const gameDataSchema = z.object({
  id: z.string().length(4),
  selfPlayer: playerSchema,
  players: z.array(playerDtoSchema),
  round: z.number(),
  gameSettings: gameSettingsDtoSchema,
  possibleGuesses: z.array(displayedGuessDtoSchema),
  musicPlayData: musicPlayDataSchema,
  isPaused: z.boolean(),
})
export type GameData = z.infer<typeof gameDataSchema>

export const useGameDataStore = defineStore('gameData', {
  state: (): GameData => {
    return {
      id: 'nope',
      selfPlayer: {
        isHost: false,
        guid: '',
        nickname: '',
      },
      players: [],
      round: 1,
      gameSettings: {
        breakDurationBetweenTrackPlays: 2,
        breakDurationBetweenRounds: 5,
        trackDuration: 8,
        roundDuration: 20,
        roundCount: 10,
        trackStartLowerBound: 0.1,
        trackStartUpperBound: 0.9,
      },
      possibleGuesses: [],
      musicPlayData: {
        uri: '',
        trackStart_ms: 0,
      },
      isPaused: false,
    }
  },
  actions: {
    createGame(createdGameDto: CreatedGameDto) {
      this.id = createdGameDto.gameId
      this.selfPlayer.isHost = true
      this.selfPlayer.guid = createdGameDto.hostGuid
      this.selfPlayer.nickname = createdGameDto.nickname
    },
    joinGame(id: string, player: PlayerDto) {
      this.id = id
      this.selfPlayer = { ...player, isHost: false }
    },
    startGame(gameStartedDto: GameStartedDto) {
      this.round = 1
      this.gameSettings = gameStartedDto.gameSettings
      this.possibleGuesses = gameStartedDto.possibleGuesses
      this.musicPlayData = {
        uri: gameStartedDto.preview_url,
        trackStart_ms: gameStartedDto.trackStart_ms,
      }
    },
    updatePlayersList(playersList: PlayerDto[]) {
      this.players = playersList
      this.selfPlayer.nickname = playersList.find(p => p.guid === this.selfPlayer.guid)!.nickname
    },
  },
})
