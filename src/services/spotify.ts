import type { MusicPlayData, SelectableAlbum, SelectablePlaylist, Track } from '@/types'
import type { Router } from 'vue-router'
import { fetchFromSpotify, getAllPaginatedItems } from '@/lib/spotify'
import { getAlbumSchema, simplePlaylistObjectSchema, simplifiedTrackObjectSchema, trackSchema } from '@/types'
import { z } from 'zod'

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
        items: (a.tracks.items = (a.tracks.items.filter(t => !!t.preview_url) as Track[]).map((t) => {
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
    'https://api.spotify.com/v1/me/tracks?fields=next,total,items(track(album(name,images),artists(name,id),duration_ms,name,uri,is_local,preview_url))&limit=50',
    access_token,
    router,
    z.union([
      z.object({ track: trackSchema.extend({ is_local: z.literal(false), preview_url: z.string().nullable() }) }),
      z.object({ track: z.object({ is_local: z.literal(true), preview_url: z.string().nullable() }) }),
    ]),
  ))
    .map(t => t.track)
    .filter(t => !t.is_local && t.preview_url !== null) as Track[]
}

export async function getTracksFromPlaylists(playlists: SelectablePlaylist[], access_token: string, router: Router): Promise<Track[]> {
  return (await Promise.all(playlists.map(async (p) => {
    return await getAllPaginatedItems(
      p.tracks.href,
      access_token,
      router,
      z.discriminatedUnion('is_local', [
        z.object({ is_local: z.literal(true), track: z.unknown() }),
        z.object({ is_local: z.literal(false), track: trackSchema.extend({ preview_url: z.string().nullable() }) }),
      ]),

    )
  })))
    .flat()
    .filter((t): t is { is_local: false, track: Track } => !t.is_local && t.track.preview_url !== null)
    .map(t => t.track)
}

export async function getTracksFromAlbums(albums: SelectableAlbum[]): Promise<Track[]> {
  return albums
    .flatMap(album => album.tracks.items)
    .filter(t => t.preview_url !== null) as Track[]
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

export async function playTrack(playData: MusicPlayData, device_id: string, access_token: string, router: Router) {
  await fetchFromSpotify(
    `/me/player/play?device_id=${device_id}`,
    access_token,
    router,
    false,
    'PUT',
    JSON.stringify({
      uris: [playData.uri],
      position_ms: playData.trackStart_ms,
    }),
  )
}
