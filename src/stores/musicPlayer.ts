import type { MusicPlayData, MusicPlayer } from '@/types'
import type { RemovableRef } from '@vueuse/core'
import { LOCAL_STORAGE } from '@/consts'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useMusicPlayerStore = defineStore('musicPlayer', {
  state: (): {
    /**
     * DO NOT USE IT DIRECTLY! Use store wrapper functions to interact with player
     */
    player?: MusicPlayer
    volume: RemovableRef<number>
    audioSource?: AudioNode | null
  } => {
    return {
      volume: useStorage(LOCAL_STORAGE.VOLUME, 0.05),
    }
  },
  getters: {
    ready: state => !!state.player,
  },
  actions: {
    async turnOn() {
      await this.player?._turnOn()
    },
    async play(track: MusicPlayData) {
      await this.player?._play(track)
    },
    async seek(time_ms: number) {
      await this.player?._seek(time_ms)
    },
    async resume() {
      await this.player?._resume()
    },
    async pause() {
      await this.player?._pause()
    },
    async setVolume(volume: number) {
      this.volume = volume
      try {
        await this.player?._setVolume(volume)
      }
      catch (e) {
        console.error('Couldn\'t set volume: ', e)
      }
    },
  },
})
