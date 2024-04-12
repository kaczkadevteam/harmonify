import { defineStore } from 'pinia'
import type { GameResult } from '@/types'

export const useGameResultStore = defineStore('gameResult', {
  state: (): GameResult => {
    return {
      score: 0,
      playedTracks: [],
    }
  },
})
