import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameData } from '@/types'

export const useGameDataStore = defineStore('gameData', {
  state: (): GameData => {
    return {
      roundCount: 20,
      roundDuration: 30,
      trackDuration: 10,
      trackLowerLimit_perc: 0.2,
      trackUpperLimit_perc: 0.8,
      tracks: [],
      selectedTracks: [],
    }
  },
})
