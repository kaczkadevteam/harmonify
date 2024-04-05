<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import LoadingCircle from '@/components/LoadingCircle.vue'
import type { Album, SimplePlaylistObject, Track } from '@/types'

const emit = defineEmits<{
  loaded: [
    playlists: {
      total: number
      items: SimplePlaylistObject[]
    },
  albums: {
    total: number
    items: Album<Track>[]
  },
  ]
}>()

// const cookies = useCookies()

async function loadData() {
  // const access_token = cookies.get('access_token')
  emit('loaded', { total: 0, items: [] }, { total: 0, items: [] })
}

loadData()
</script>

<template>
  <div class=" text-4 flex items-center gap-5">
    <span>Loading your playlists and albums</span>
    <LoadingCircle size="60px" />
  </div>
</template>
