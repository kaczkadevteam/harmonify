<script setup lang="ts">
import GuessLevelIcon from '../GuessLevelIcon.vue'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import type { PlayedTrack } from '@/types'

defineProps<{
  playedTrack: PlayedTrack
}>()
</script>

<template>
  <div
    class="grid max-w-full grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] px-4 pt-4 lg:h-52 lg:px-0"
  >
    <img class="col-span-1 row-span-2 row-start-1 size-28 min-h-28 min-w-28 lg:row-span-3 lg:size-48 lg:min-h-48 lg:min-w-48" :src="playedTrack.track.album.images[0].url" alt="Album cover">
    <TrackDisplay class="mx-3" :track="playedTrack.track" />
    <div v-if="playedTrack.userGuess && playedTrack.guessLevel !== 'full'" class="mx-3">
      <span class="mr-2 font-semibold">Your guess: </span>
      <span><GuessDisplay :guess="playedTrack.userGuess" /></span>
    </div>
    <div v-else-if="playedTrack.guessLevel !== 'full'" class="mx-3">
      <span class="mr-2 font-semibold">No guess</span>
    </div>
    <div class="col-span-2 row-start-3 mx-3 mt-3 flex items-center justify-between self-end lg:col-span-1 lg:col-start-2 lg:mt-0">
      <div v-if="playedTrack.score !== 0">
        <span class="mr-2 font-semibold">Score: </span>
        <span>{{ playedTrack.score }}</span>
      </div>
      <div class="ml-auto">
        <GuessLevelIcon :guess-level="playedTrack.guessLevel" class="min-h-6 min-w-6" />
      </div>
    </div>
  </div>
</template>
