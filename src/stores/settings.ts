import { ref } from 'vue'
import { defineStore } from 'pinia'

type PlayerType = 'spotify'

export const useSettingsStore = defineStore('settings', () => {
  const player = ref<PlayerType>('spotify')

  return { player }
})
