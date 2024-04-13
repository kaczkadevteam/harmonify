import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import { z } from 'zod'
import { type SelectableAlbum, type SelectablePlaylist, type Track, trackSchema } from '@/types'
import { getAllPaginatedItems } from '@/lib/spotify'

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
  return `${track.name} - ${track.artists
      .reduce((acc, artist) => {
          return `${acc}, ${artist.name}`
      }, '')
      .slice(2)} - ${track.album.name}`
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

    if (favouritesSelected.value) {
      favouriteTracks = (await getAllPaginatedItems(
        'https://api.spotify.com/v1/me/tracks?fields=next,items(track(album.images,artists(name,id),duration_ms,name,uri,is_local))&limit=50',
        access_token,
        router,
        z.object({ track: trackSchema.and(z.object({ is_local: z.boolean() })) }),
      ))
        .filter(t => !t.track.is_local)
        .map(t => t.track)
    }

    const playlistsTracks = (await Promise.all(playlists.value.filter(p => p.selected).map(async (p) => {
      return await getAllPaginatedItems(
        p.tracks.href,
        access_token,
        router,
        z.object({ track: trackSchema, is_local: z.boolean() }),
      )
    })))
      .flat()
      .filter(t => !t.is_local)
      .map(t => t.track)

    const albumTracks = albums.value
      .filter(a => a.selected)
      .reduce<Track[]>((acc, a) => [...acc, ...a.tracks.items], [])

    return [...favouriteTracks, ...playlistsTracks, ...albumTracks]
  }

  return { favouritesSelected, playlists, albums, getTracksFromSelectedSets }
})
