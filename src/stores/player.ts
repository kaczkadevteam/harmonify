import { defineStore } from 'pinia'
import { type RemovableRef, useStorage } from '@vueuse/core'
import type { Player, Track } from '@/types'
import { VOLUME_KEY } from '@/consts'

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
