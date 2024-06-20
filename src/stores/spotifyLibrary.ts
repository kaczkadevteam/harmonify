import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import type { SelectableAlbum, SelectablePlaylist, Track } from '@/types'
import { SpotifyService } from '@/services'
import { removeDuplicatedTracks } from '@/lib/track'

export const useSpotifyLibraryStore = defineStore('spotifyLibrary', () => {
  const favouritesSelected = ref(false)
  const favourites = ref<Track[]>()
  const playlists = ref<SelectablePlaylist[]>()
  const albums = ref<SelectableAlbum[]>()
  const totalSelectedTracks = computed(() => {
    if (!favourites.value || !playlists.value || !albums.value)
      return 'loading...'

    let count = 0

    if (favouritesSelected.value)
      count += favourites.value.length

    count += playlists.value
      .filter((p => p.selected))
      .reduce((acc, p) => acc + p.tracks.total, 0)
    count += albums.value
      .filter((p => p.selected))
      .reduce((acc, p) => acc + p.tracks.items.length, 0)

    return `${count} tracks`
  })

  async function getTracksFromSelectedSets(access_token: string, router: Router) {
    let tracks = await fetchTracksFromSelectedSets(access_token, router)
    tracks = removeDuplicatedTracks(tracks)
    return tracks
  }

  async function fetchTracksFromSelectedSets(access_token: string, router: Router): Promise<Track[]> {
    if (!favourites.value || !playlists.value || !albums.value)
      throw new Error('Tried to fetch tracks before loading playlists and albums')

    let favouriteTracks: Track[] = []

    if (favouritesSelected.value)
      favouriteTracks = favourites.value

    const playlistsTracks = await SpotifyService.getTracksFromPlaylists(playlists.value.filter(p => p.selected), access_token, router)
    const albumTracks = await SpotifyService.getTracksFromAlbums(albums.value.filter(p => p.selected))

    return [...favouriteTracks, ...playlistsTracks, ...albumTracks]
  }

  return { favourites, favouritesSelected, playlists, albums, totalSelectedTracks, getTracksFromSelectedSets }
})
