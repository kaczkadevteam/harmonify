import { defineStore } from 'pinia'
import type { GameData, Track } from '@/types'

export function selectRandomlyTracks(tracks: Track[], count: number) {
  const selectedTracks: Track[] = []
  let leftTracks = [...tracks]

  for (let i = 0; i < count; i++) {
    if (leftTracks.length === 0)
      leftTracks = [...tracks]

    const drawnIndex = Math.floor(Math.random() * leftTracks.length)
    const drawnTrack = leftTracks.splice(drawnIndex, 1)[0]

    selectedTracks.push(drawnTrack)
  }

  return selectedTracks
}

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
  actions: {
    prepareGame(selectedTracks: Track[]) {
      this.tracks = selectedTracks
      this.selectedTracks = selectRandomlyTracks(selectedTracks, this.roundCount)
    },
    getTrackForRound(round: number): Track & { trackStart_ms: number } {
      const track = this.selectedTracks[round - 1]
      const { duration_ms } = track
      const lowerLimit = duration_ms * this.trackLowerLimit_perc
      const upperLimit = duration_ms * this.trackUpperLimit_perc
      const durationRange = upperLimit - lowerLimit

      return {
        ...track,
        trackStart_ms: Math.min(
          Math.floor(Math.random() * durationRange) + lowerLimit,
          duration_ms - this.trackDuration * 1000,
        ),
      }
    },
  },
})
