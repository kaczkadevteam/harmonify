<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useResultStore } from '@/stores'
import PlayedTrack from '@/components/result/PlayedTrack.vue'
import type { PlayedTrack as TPlayedTrack } from '@/types'

const router = useRouter()
const resultStore = useResultStore()

function handlePlayAgain() {
  router.push({ name: 'home' })
}

const playedTracks = computed<TPlayedTrack[]>(() => {
  return resultStore.game.roundResults.map((roundResult, i) => {
    const track = resultStore.game.tracks[i]
    return {
      track,
      userGuess: roundResult.guess,
      isGuessed: roundResult.guess === track.guess,
      score: roundResult.score,
    }
  })
})
</script>

<template>
  <div class="grid h-screen grid-cols-[auto_auto] place-items-center gap-5">
    <ScrollArea class="h-4/5 w-[650px] rounded-lg border p-4">
      <div class="space-y-4">
        <PlayedTrack
          v-for="playedTrack, idx of playedTracks"
          :key="`${playedTrack.track.uri}-${idx}`"
          :played-track="playedTrack"
        />
      </div>
    </ScrollArea>
    <div class="grid place-items-center gap-5">
      <div class="text-4xl">
        <span>Score: </span>
        <span>{{ resultStore.game.score }}</span>
      </div>
      <Button class="text-xl" size="lg" @click="handlePlayAgain">
        Play again?
      </Button>
    </div>
  </div>
</template>
