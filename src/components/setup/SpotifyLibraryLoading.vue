<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import LoadingCircle from '@/components/LoadingCircle.vue'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'
import { SpotifyService } from '@/services'

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

  const playlists = await SpotifyService.getPlaylists(access_token, router)
  const albums = await SpotifyService.getAlbums(access_token, router)

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
