import { defineStore } from 'pinia'
import type { EndGameResultsDto, PlayerScoreDto, RoundFinishedDto } from '@/types'

export interface ResultStore {
  round: RoundFinishedDto & { previousPlayerScores: PlayerScoreDto[] }
  game: EndGameResultsDto
}

export const useResultStore = defineStore('result', {
  state: (): ResultStore => {
    return {
      round: {
        roundResult: {
          score: 0,
          guess: '',
        },
        score: 0,
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
        },
      },
      game: {
        roundResults: [],
        players: [],
        score: 0,
        tracks: [],
      },
    }
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
