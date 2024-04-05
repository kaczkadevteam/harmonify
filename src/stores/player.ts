import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Track } from '@/types'

export interface Player {
  play: (track: Track) => Promise<void>
  resume: () => Promise<void>
  pause: () => Promise<void>
  /**
   *
   * @param volume in range 0 to 1
   * @returns
   */
  setVolume: (volume: number) => Promise<void>
}

export const usePlayerStore = defineStore('player', () => {
  const player = ref<Player>()

  return { player }
})
