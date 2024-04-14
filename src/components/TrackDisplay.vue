<script setup lang="ts">
import { computed } from 'vue'
import type { Track } from '@/types'
import { getArtistsAsString } from '@/stores/spotifyLibrary'

const props = defineProps<{
  track: Track
  guess?: never
} | {
  track?: never
  guess: string
}>()

const title = computed(() => {
  if (props.track)
    return props.track.name
  else
    return props.guess.split(' - ')[0]
})

const author = computed(() => {
  if (props.track)
    return getArtistsAsString(props.track)
  else
    return props.guess.split(' - ')[1]
})

const album = computed(() => {
  if (props.track)
    return props.track.album.name
  else
    return props.guess.split(' - ')[2]
})
</script>

<template>
  <span>
    <span class="font-semibold" v-text="title" />
    <span class="ml-3 text-muted-foreground" v-text="author" />
    <span class="ml-3 text-muted-foreground" v-text="album" />
  </span>
</template>
