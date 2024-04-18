import type { Router } from 'vue-router'
import { z } from 'zod'
import { fetchFromSpotify, getAllPaginatedItems } from '@/lib/spotify'
import { type SelectableAlbum, type SelectablePlaylist, type Track, getAlbumSchema, simplePlaylistObjectSchema, simplifiedTrackObjectSchema, trackSchema } from '@/types'

export async function getUserId(access_token: string, router: Router): Promise<string> {
  const userResponse = await fetchFromSpotify(`/me`, access_token, router)
  const { id } = z.object({ id: z.string() }).parse(await userResponse.json())
  return id
}

export async function getPlaylists(access_token: string, router: Router): Promise<SelectablePlaylist[]> {
  const userId = await getUserId(access_token, router)

  const playlistURL = `${import.meta.env.VITE_SPOTIFY_URL}/users/${userId}/playlists?limit=50`
  const playlists = (await getAllPaginatedItems(
    playlistURL,
    access_token,
    router,
    simplePlaylistObjectSchema,
  )).map<SelectablePlaylist>((playlist) => {
    return {
      ...playlist,
      selected: false,
    }
  })

  return playlists
}

export async function getAlbums(access_token: string, router: Router): Promise<SelectableAlbum[]> {
  const albumsURL = `${import.meta.env.VITE_SPOTIFY_URL}/me/albums?limit=50`
  const albums = (await getAllPaginatedItems(
    albumsURL,
    access_token,
    router,
    z.object({ album: getAlbumSchema(simplifiedTrackObjectSchema) }),
  )).map<SelectableAlbum>((i) => {
    const a = i.album
    return {
      ...a,
      tracks: {
        items: (a.tracks.items = a.tracks.items.map<Track>((t) => {
          return {
            ...t,
            album: { name: a.name, images: a.images },
          }
        })),
      },
      selected: false,
    }
  })

  return albums
}

export async function getTracksFromFavourites(access_token: string, router: Router): Promise<Track[]> {
  return (await getAllPaginatedItems(
    'https://api.spotify.com/v1/me/tracks?fields=next,items(track(album.images,artists(name,id),duration_ms,name,uri,is_local))&limit=50',
    access_token,
    router,
    z.object({ track: trackSchema.and(z.object({ is_local: z.boolean() })) }),
  ))
    .filter(t => !t.track.is_local)
    .map(t => t.track)
}

export async function getTracksFromPlaylists(playlists: SelectablePlaylist[], access_token: string, router: Router): Promise<Track[]> {
  return (await Promise.all(playlists.map(async (p) => {
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
}

export async function getTracksFromAlbums(albums: SelectableAlbum[]): Promise<Track[]> {
  return albums
    .reduce<Track[]>((acc, a) => [...acc, ...a.tracks.items], [])
}

export async function selectPlayer(device_id: string, access_token: string, router: Router) {
  await fetchFromSpotify(
    '/me/player',
    access_token,
    router,
    false,
    'PUT',
    JSON.stringify({ device_ids: [device_id] }),
  )
}

export async function playTrack(track: Track, device_id: string, access_token: string, router: Router) {
  await fetchFromSpotify(
    `/me/player/play?device_id=${device_id}`,
    access_token,
    router,
    false,
    'PUT',
    JSON.stringify({
      uris: [track.uri],
      position_ms: track.trackStart_ms,
    }),
  )
}
