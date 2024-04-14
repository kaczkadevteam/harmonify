import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import type { SelectableAlbum, SelectablePlaylist, Track } from '@/types'
import * as SpotifyService from '@/services/spotify'

export function removeDuplicatedTracks(tracks: Track[]) {
  return tracks.reduce<Track[]>((filteredTracks, track) => {
    if (!filteredTracks.some(someTrack => someTrack.uri === track.uri))
      filteredTracks.push(track)

    return filteredTracks
  }, [])
}

export function addGuessToTracks(tracks: Track[]) {
  return tracks.map(track => ({
    ...track,
    guess: trackIntoGuessString(track),
  }))
}

export function trackIntoGuessString(track: Track) {
  return `${track.name} - ${getArtistsAsString(track)} - ${track.album.name}`
}

export function getArtistsAsString(track: Track) {
  return track.artists
    .reduce((acc, artist) => {
      return `${acc}, ${artist.name}`
    }, '')
    .slice(2)
}

export const useSpotifyLibraryStore = defineStore('spotifyLibrary', () => {
  const favouritesSelected = ref(false)
  const playlists = ref<SelectablePlaylist[]>()
  const albums = ref<SelectableAlbum[]>()

  async function getTracksFromSelectedSets(access_token: string, router: Router) {
    let tracks = await fetchTracksFromSelectedSets(access_token, router)
    tracks = removeDuplicatedTracks(tracks)
    tracks = addGuessToTracks(tracks)
    return tracks
  }

  async function fetchTracksFromSelectedSets(access_token: string, router: Router) {
    if (!playlists.value || !albums.value)
      throw new Error('Tried to fetch tracks before loading playlists and albums')

    let favouriteTracks: Track[] = []

    if (favouritesSelected.value)
      favouriteTracks = await SpotifyService.getTracksFromFavourites(access_token, router)

    const playlistsTracks = await SpotifyService.getTracksFromPlaylists(playlists.value.filter(p => p.selected), access_token, router)
    const albumTracks = await SpotifyService.getTracksFromAlbums(albums.value.filter(p => p.selected))

    return [...favouriteTracks, ...playlistsTracks, ...albumTracks]
  }

  return { favouritesSelected, playlists, albums, getTracksFromSelectedSets }
})
