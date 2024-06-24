import { defineStore } from 'pinia'
import { type RemovableRef, useStorage } from '@vueuse/core'
import { LOCAL_STORAGE } from '@/consts'

export type Autoplay = 'always' | 'once' | 'never'

export const useSettingsStore = defineStore('settings', {
  state: (): {
    autoplay: RemovableRef<Autoplay>
    playAnimations: RemovableRef<boolean>
  } => {
    return {
      autoplay: useStorage<Autoplay>(LOCAL_STORAGE.AUTOPLAY, 'always'),
      playAnimations: useStorage<boolean>(LOCAL_STORAGE.PLAY_ANIMATIONS, true),
    }
  },
})
