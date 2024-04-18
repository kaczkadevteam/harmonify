import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import type { SelectableAlbum, SelectablePlaylist, Track } from '@/types'
import { SpotifyService } from '@/services'
import { addGuessToTracks, removeDuplicatedTracks } from '@/lib/track'

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
