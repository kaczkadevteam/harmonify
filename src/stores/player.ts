import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type RemovableRef, useStorage } from '@vueuse/core'
import type { Track } from '@/types'

export const VOLUME_KEY = 'volume'

export interface Player {
  _turnOn: () => Promise<void>
  _play: (track: Track) => Promise<void>
  _resume: () => Promise<void>
  _pause: () => Promise<void>
  /**
   * @param volume in range 0 to 1
   * @returns
   */
  _setVolume: (volume: number) => Promise<void>
}

export const usePlayerStore = defineStore('player', {
  state: (): {
    /**
     * DO NOT USE IT DIRECTLY! Use store wrapper functions to interact with player
     */
    player?: Player
    volume: RemovableRef<number>
  } => {
    return {
      volume: useStorage(VOLUME_KEY, 0.05),
    }
  },
  getters: {
    ready: state => !!state.player,
  },
  actions: {
    async turnOn() {
      await this.player?._turnOn()
    },
    async play(track: Track) {
      await this.player?._play(track)
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
