import { defineStore } from 'pinia'
import type { GameResult, Track } from '@/types'

export const useGameResultStore = defineStore('gameResult', {
  state: (): GameResult => {
    return {
      score: 0,
      playedTracks: [],
    }
  },
  actions: {
    addPlayedTrack(track: Track, guess: string, isGuessed: boolean, playDuration: number) {
      this.playedTracks.push({
        track,
        userGuess: guess,
        isGuessed,
        playDuration,
      })
    },
    finishGame(score: number) {
      this.score = score
    },
  },
})
