import { defineStore } from 'pinia'
import type { CreatedGameDto, GameData, GameStartedDto, PlayerDto, Track } from '@/types'

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
        trackDuration: 5,
        roundDuration: 5,
        roundCount: 5,
        trackStartLowerBound: 0.1,
        trackStartUpperBound: 0.9,
      },
      possibleGuesses: [],
      musicPlayData: {
        uri: '',
        trackStart_ms: 0,
      },
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
    },
  },
})
