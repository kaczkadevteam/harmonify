<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import type { PlayedTrack } from '@/types'

defineProps<{
  playedTrack: PlayedTrack
}>()
</script>

<template>
  <div
    class="grid h-52 grid-cols-[auto_1fr] grid-rows-[auto_auto]"
  >
    <img class="row-span-2" :src="playedTrack.track.album.images[0].url" alt="Album cover" width="200" height="200">
    <TrackDisplay class="mx-3" :track="playedTrack.track" />
    <div class="mx-3 flex items-center justify-between self-end">
      <div v-if="playedTrack.isGuessed">
        <span class="mr-2 font-semibold">Score: </span>
        <span>{{ playedTrack.score }}</span>
      </div>
      <div v-else-if="playedTrack.userGuess">
        <span class="mr-2 font-semibold">Your guess: </span>
        <span><GuessDisplay :guess="playedTrack.userGuess" /></span>
      </div>
      <div v-else>
        <span class="font-semibold">No guess</span>
      </div>
      <Check v-if="playedTrack.isGuessed" class="size-8 min-h-8 min-w-8 text-green-500" />
      <X v-else class="size-8 min-h-8 min-w-8 text-red-500" />
    </div>
  </div>
</template>
