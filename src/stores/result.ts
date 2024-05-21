import { defineStore } from 'pinia'
import { useGameDataStore } from '.'
import type { EndGameResultsDto, PlayerScoreDto, RoundFinishedDto } from '@/types'

export interface ResultStore {
  round: RoundFinishedDto & { previousPlayerScores: PlayerScoreDto[] }
  game: EndGameResultsDto
}

export const useResultStore = defineStore('result', {
  state: (): ResultStore => {
    return {
      round: {
        previousPlayerScores: [],
        players: [],
        track: {
          name: '',
          album: {
            name: '',
            images: [],
          },
          artists: [],
          uri: '',
          duration_ms: 0,
          preview_url: '',
        },
      },
      game: {
        players: [],
        tracks: [],
      },
    }
  },
  getters: {
    roundSelfPlayer: (state) => {
      const gameDataStore = useGameDataStore()

      return state.round.players.find(p => p.guid === gameDataStore.selfPlayer.guid)!
    },
    gameSelfPlayer: (state) => {
      const gameDataStore = useGameDataStore()

      return state.game.players.find(p => p.guid === gameDataStore.selfPlayer.guid)!
    },
  },
  actions: {
    setRoundResult(data: RoundFinishedDto) {
      this.round = {
        ...data,
        players: [...data.players].sort((a, b) => b.score - a.score),
        previousPlayerScores: [...this.round.players].sort((a, b) => b.score - a.score),
      }
    },
    setGameResult(data: EndGameResultsDto) {
      this.game = {
        ...data,
        players: [...data.players].sort((a, b) => b.score - a.score),
      }
    },
  },
})
