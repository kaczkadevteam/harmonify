import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Track } from '@/types'

interface Player {
  play: (track: Track) => Promise<void>
  resume: () => Promise<void>
  pause: () => Promise<void>
}

export const usePlayerStore = defineStore('player', () => {
  const player = ref<Player>()

  return { player }
})
