<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import LoadingCircle from '@/components/LoadingCircle.vue'
import { type SelectableAlbum, type SelectablePlaylist, type Track, getAlbumSchema, simplePlaylistObjectSchema, simplifiedTrackObjectSchema } from '@/types'
import { fetchFromSpotify, getAllPaginatedItems } from '@/lib/spotify'

const emit = defineEmits<{
  loaded: [
    playlists: SelectablePlaylist[],
    albums: SelectableAlbum[],
  ]
}>()

const cookies = useCookies()
const router = useRouter()

async function loadData() {
  const access_token = z.string().parse(cookies.get('access_token'))
  const userResponse = await fetchFromSpotify(`/me`, access_token, router)
  const { id } = z.object({ id: z.string() }).parse(await userResponse.json())

  const playlistURL = `${import.meta.env.VITE_SPOTIFY_URL}/users/${id}/playlists?limit=50`
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

  emit('loaded', playlists, albums)
}

loadData()
</script>

<template>
  <div class="text-4 flex items-center gap-5">
    <span>Loading your playlists and albums</span>
    <LoadingCircle size="60px" />
  </div>
</template>
