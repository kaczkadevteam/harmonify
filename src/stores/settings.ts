import { defineStore } from 'pinia'
import { type RemovableRef, usePreferredReducedMotion, useStorage } from '@vueuse/core'
import { LOCAL_STORAGE } from '@/consts'

export type Autoplay = 'always' | 'once' | 'never'

export const useSettingsStore = defineStore('settings', {
  state: (): {
    autoplay: RemovableRef<Autoplay>
    playAnimations: RemovableRef<boolean>
    displayVisualizer: RemovableRef<boolean>
  } => {
    const prefferedMotion = usePreferredReducedMotion()

    return {
      autoplay: useStorage<Autoplay>(LOCAL_STORAGE.AUTOPLAY, 'always'),
      playAnimations: useStorage<boolean>(LOCAL_STORAGE.PLAY_ANIMATIONS, prefferedMotion.value === 'no-preference'),
      displayVisualizer: useStorage<boolean>(LOCAL_STORAGE.DISPLAY_VISUALIZER, true),
    }
  },
})
