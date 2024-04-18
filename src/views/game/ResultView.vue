<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGameResultStore } from '@/stores'
import PlayedTrack from '@/components/result/PlayedTrack.vue'

const router = useRouter()
const gameResultStore = useGameResultStore()

function handlePlayAgain() {
  router.push({ name: 'setup' })
}
</script>

<template>
  <div class="grid h-screen grid-cols-[auto_auto] place-items-center gap-5">
    <ScrollArea class="h-4/5 w-[650px] rounded-lg border p-4">
      <div class="space-y-4">
        <PlayedTrack
          v-for="playedTrack of gameResultStore.playedTracks"
          :key="`${playedTrack.track.uri}-${playedTrack.playDuration}`"
          :played-track
        />
      </div>
    </ScrollArea>
    <div class="grid place-items-center gap-5">
      <div class="text-4xl">
        <span>Score: </span>
        <span>{{ gameResultStore.score }}</span>
      </div>
      <Button class="text-xl" size="lg" @click="handlePlayAgain">
        Play again?
      </Button>
    </div>
  </div>
</template>
