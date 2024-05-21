<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useElementBounding, useWindowSize } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGameDataStore, useResultStore } from '@/stores'
import PlayedTrack from '@/components/result/PlayedTrack.vue'
import type { PlayedTrack as TPlayedTrack } from '@/types'
import GameResults from '@/components/result/GameResults.vue'

const resultStore = useResultStore()

const router = useRouter()
const gameResultsEl = ref<HTMLDivElement | null>(null)
const windowDimensions = useWindowSize()
const gameResultsDimensions = useElementBounding(gameResultsEl)
const startingTransform = ref('')
const displayTracks = ref(false)
const displayButton = ref(false)

function handlePlayAgain() {
  router.push({ name: 'home' })
}

const playedTracks = computed<TPlayedTrack[]>(() => {
  return resultStore
    .gameSelfPlayer
    .roundResults
    .map((roundResult, i) => {
      const track = resultStore.game.tracks[i]
      return {
        track,
        userGuess: roundResult.guess,
        guessLevel: roundResult.guessLevel,
        score: roundResult.score,
      }
    })
})

onMounted(() => {
  const windowMiddleX = windowDimensions.width.value / 2
  const windowMiddleY = windowDimensions.height.value / 2

  const elementMiddleX = gameResultsDimensions.x.value + (gameResultsDimensions.width.value / 2)
  const elementMiddleY = gameResultsDimensions.y.value + (gameResultsDimensions.height.value / 2)

  const deltaX = windowMiddleX - elementMiddleX
  const deltaY = windowMiddleY - elementMiddleY

  startingTransform.value = `translate( ${deltaX}px, ${deltaY}px)`

  setTimeout(() => {
    displayTracks.value = true
  }, 5000 + 2000)

  setTimeout(() => {
    displayButton.value = true
  }, 5000 + 2000 + 2000)
})
</script>

<template>
  <div class="grid h-screen grid-cols-[650px_auto] grid-rows-2 place-items-center gap-5">
    <Transition name="fade-left">
      <ScrollArea v-if="displayTracks" class="row-span-2 h-4/5 w-full rounded-lg border p-4">
        <div class="space-y-4">
          <PlayedTrack
            v-for="playedTrack, idx of playedTracks"
            :key="`${playedTrack.track.uri}-${idx}`"
            :played-track="playedTrack"
          />
        </div>
      </ScrollArea>
    </Transition>
    <div ref="gameResultsEl" class="game-results col-start-2">
      <GameResults :points-bar-max-width="20" />
    </div>

    <Transition name="fade-bottom">
      <div v-if="displayButton" class="grid place-items-center gap-5">
        <div class="text-4xl">
          <span>Score: </span>
          <span>{{ resultStore.gameSelfPlayer.score }}</span>
        </div>
        <Button class="text-xl" size="lg" @click="handlePlayAgain">
          Play again?
        </Button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game-results {
  transform: v-bind(startingTransform);
  animation: comeback 2s ease-in-out 5000ms;
  animation-fill-mode: forwards;
}

.fade-left-leave-active,
.fade-left-enter-active,
.fade-bottom-leave-active,
.fade-bottom-enter-active {
  transition: all 1s ease-out;
}

.fade-bottom-enter-from,
.fade-bottom-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

.fade-left-enter-from,
.fade-left-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

@keyframes comeback {
  to {
    transform: translate(0, 0);
  }
}
</style>
