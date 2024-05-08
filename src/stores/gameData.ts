import { defineStore } from 'pinia'
import type { CreatedGameDto, GameData, Track } from '@/types'
import { selectRandomlyTracks } from '@/lib/track'

export const useGameDataStore = defineStore('gameData', {
  state: (): GameData => {
    return {
      id: 'nope',
      selfPlayer: {
        isHost: false,
        username: '',
        guid: '',
      },
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
    createGame(createdGameDto: CreatedGameDto) {
      this.id = createdGameDto.gameId
      this.selfPlayer.isHost = true
      this.selfPlayer.guid = createdGameDto.hostGuid
    },
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
      const trackStart_ms = Math.min(
        Math.floor(Math.random() * durationRange) + lowerLimit,
        duration_ms - this.trackDuration * 1000,
      )

      return {
        ...track,
        trackStart_ms,
      }
    },
  },
})
