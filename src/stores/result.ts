import { defineStore } from 'pinia'
import type { EndGameResultsDto, PlayerDto, RoundFinishedDto } from '@/types'

export interface ResultStore {
  round: RoundFinishedDto & { previousPlayerScores: PlayerDto[] }
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
})
