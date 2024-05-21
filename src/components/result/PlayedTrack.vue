<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import GuessLevelIcon from '../GuessLevelIcon.vue'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import type { PlayedTrack } from '@/types'

defineProps<{
  playedTrack: PlayedTrack
}>()
</script>

<template>
  <div
    class="grid h-52 grid-cols-[auto_1fr] grid-rows-[auto_auto_auto]"
  >
    <img class="col-span-1 row-span-3 row-start-1" :src="playedTrack.track.album.images[0].url" alt="Album cover" width="200" height="200">
    <TrackDisplay class="mx-3" :track="playedTrack.track" />
    <div v-if="playedTrack.userGuess && playedTrack.guessLevel !== 'full'" class="mx-3">
      <span class="mr-2 font-semibold">Your guess: </span>
      <span><GuessDisplay :guess="playedTrack.userGuess" /></span>
    </div>
    <div v-else-if="playedTrack.guessLevel !== 'full'" class="mx-3">
      <span class="mr-2 font-semibold">No guess</span>
    </div>
    <div class="row-start-3 mx-3 flex items-center justify-between self-end">
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
