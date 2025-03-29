<script setup lang="ts">
import type { Track } from '@/types'
import { getArtistsAsString } from '@/lib/track'
import BaseDisplay from './BaseDisplay.vue'

defineProps<{
  track: Track
}>()
</script>

<template>
  <BaseDisplay
    :title="track.name"
    :author="getArtistsAsString(track)"
    :album="track.album.name"
  />
</template>
