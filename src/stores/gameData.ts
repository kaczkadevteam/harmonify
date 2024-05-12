import { defineStore } from 'pinia'
import type { CreatedGameDto, GameData, GameStartedDto, Track } from '@/types'

export const useGameDataStore = defineStore('gameData', {
  state: (): GameData => {
    return {
      id: 'nope',
      selfPlayer: {
        isHost: false,
        guid: '',
      },
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
    }
  },
  actions: {
    createGame(createdGameDto: CreatedGameDto) {
      this.id = createdGameDto.gameId
      this.selfPlayer.isHost = true
      this.selfPlayer.guid = createdGameDto.hostGuid
    },
    joinGame(id: string, playerGuid: string) {
      this.id = id
      this.selfPlayer.isHost = false
      this.selfPlayer.guid = playerGuid
    },
    startGame(gameStartedDto: GameStartedDto) {
      this.gameSettings = gameStartedDto.gameSettings
      this.possibleGuesses = gameStartedDto.possibleGuesses
    },
  },
})
