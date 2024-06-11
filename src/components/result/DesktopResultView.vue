<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useElementBounding, useWindowSize } from '@vueuse/core'
import GameResults from '@/components/result/GameResults.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import PlayedTrack from '@/components/result/PlayedTrack.vue'
import { Button } from '@/components/ui/button'
import type { PlayedTrack as TPlayedTrack } from '@/types'
import { cn } from '@/lib/utils'

defineProps<{
  playedTracks: TPlayedTrack[]
  score: number
  isDesktop: boolean
  displayTracks: boolean
  displayButton: boolean
  resultsAnimationPending: boolean
}>()

const emit = defineEmits<{
  animationFinished: []
  playAgain: []
}>()

const gameResultsEl = ref<HTMLDivElement | null>(null)
const gameResultsDimensions = useElementBounding(gameResultsEl)
const windowDimensions = useWindowSize()
const startingTransform = ref('')

onMounted(() => {
  const windowMiddleX = windowDimensions.width.value / 2
  const windowMiddleY = windowDimensions.height.value / 2

  const elementMiddleX = gameResultsDimensions.x.value + (gameResultsDimensions.width.value / 2)
  const elementMiddleY = gameResultsDimensions.y.value + (gameResultsDimensions.height.value / 2)

  const deltaX = windowMiddleX - elementMiddleX
  const deltaY = windowMiddleY - elementMiddleY

  startingTransform.value = `translate( ${deltaX}px, ${deltaY}px)`
})
</script>

<template>
  <div class="box-border grid h-screen w-screen grid-cols-[650px_auto] grid-rows-[minmax(0,100%)_150px] place-content-center place-items-center gap-5 p-8">
    <Transition name="fade-left">
      <ScrollArea v-if="displayTracks" class="row-span-2 size-full rounded-lg border p-4">
        <div class="space-y-4">
          <PlayedTrack
            v-for="playedTrack, idx of playedTracks"
            :key="`${playedTrack.track.uri}-${idx}`"
            :played-track="playedTrack"
          />
        </div>
      </ScrollArea>
    </Transition>
    <div class="col-start-2 h-full max-h-full self-start">
      <GameResults
        ref="gameResultsEl"
        :class="cn('max-h-full', true && 'game-results', !resultsAnimationPending && 'game-results-animation')"
        :is-desktop
        animate
        @animation-finished="emit('animationFinished')"
      />
    </div>

    <Transition name="fade-bottom">
      <div v-if="displayButton" class="grid place-items-center gap-5">
        <div class="text-4xl">
          <span>Score: </span>
          <span>{{ score }}</span>
        </div>
        <Button class="text-xl" size="lg" @click="emit('playAgain')">
          Play again?
        </Button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game-results {
  transform: v-bind(startingTransform);
}

.game-results-animation {
  animation: comeback 1.5s ease-in-out;
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
