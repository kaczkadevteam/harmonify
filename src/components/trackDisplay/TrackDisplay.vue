<script setup lang="ts">
import BaseDisplay from './BaseDisplay.vue'
import type { Track } from '@/types'
import { getArtistsAsString } from '@/lib/track'

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
