<script setup lang="ts">
import type { PlayerScoreDto } from '@/types'
import PlayerResult from '@/components/roundResult/PlayerResult.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnimationDuration } from '@/consts'
import { useResultStore } from '@/stores'
import { useIntervalFn } from '@vueuse/core'
import confetti from 'canvas-confetti'
import { computed, ref } from 'vue'

const props = defineProps<{
  isDesktop: boolean
  animate?: boolean
}>()

const emit = defineEmits<{
  animationFinished: []
}>()

const SCORE_BAR_MAX_WIDTH = 220
const RESULTS_WIDTH = SCORE_BAR_MAX_WIDTH + 100
const INTERVAL_BEFORE_FIRST_PLACE = AnimationDuration.D1000
const PLAYER_ANIMATION_DURATION = AnimationDuration.D1000
const RESULTS_GAP = 16
const RESULTS_HEIGHT = 40
const MOBILE_PADDING = 8

function getIntervalForIndex(index: number) {
  switch (index) {
    case 1:
      return INTERVAL_BEFORE_FIRST_PLACE
    case 2:
      return AnimationDuration.D800
    default:
      return AnimationDuration.D500
  }
}

function launchConfetti() {
  const velocities: number[] = Array.from({ length: 5 }).map(() => Math.random() * 50 + 65)

  for (let i = 0; i < 5; i++) {
    confetti({
      particleCount: 40,
      angle: 40,
      spread: 45,
      startVelocity: velocities[i],
      origin: { x: -0.15 },
      drift: -0.1,
    })
  }

  for (let i = 0; i < 5; i++) {
    confetti({
      particleCount: 40,
      angle: 140,
      spread: 45,
      startVelocity: velocities[i],
      origin: { x: 1.15 },
      drift: 0.1,
    })
  }
}

const resultStore = useResultStore()
const animationPending = ref(props.animate)

const results = computed(() => {
  const results = resultStore.game.players

  const bestScore: number = results[0]?.score ?? 0

  return results.map(r => ({ ...r, width: (r.score / bestScore) * SCORE_BAR_MAX_WIDTH }))
})
const displayedResults = ref<(PlayerScoreDto & { width: number })[]>(props.animate ? [] : [...results.value].reverse())
const resultsLeft = ref(results.value.length - displayedResults.value.length)

const resultsHeight = computed(() => {
  return `min(100%,${(RESULTS_HEIGHT + RESULTS_GAP) * results.value.length - RESULTS_GAP + MOBILE_PADDING * 2}px)`
})

const interval = ref(getIntervalForIndex(resultsLeft.value - 1))
const { pause } = useIntervalFn(() => {
  if (!props.animate) {
    pause()
    return
  }

  resultsLeft.value--

  if (resultsLeft.value <= 0) {
    pause()
    setTimeout(() => {
      launchConfetti()
    }, INTERVAL_BEFORE_FIRST_PLACE / 2)

    setTimeout(() => {
      animationPending.value = false
      emit('animationFinished')
    }, INTERVAL_BEFORE_FIRST_PLACE + PLAYER_ANIMATION_DURATION)
  }
  else { interval.value = getIntervalForIndex(resultsLeft.value) }

  displayedResults.value.push(results.value[resultsLeft.value])
}, interval)
</script>

<template>
  <ScrollArea class="max-h-full" :style="{ width: `${RESULTS_WIDTH}px`, height: resultsHeight, padding: isDesktop ? '0' : `${MOBILE_PADDING}px 0` }">
    <TransitionGroup name="results" tag="div" class="flex h-full flex-col-reverse rounded-lg" :style="{ gap: `${RESULTS_GAP}px` }">
      <PlayerResult
        v-for="playerResult in displayedResults"
        :key="playerResult.guid"
        class="ml-2"
        :style="{ height: `${RESULTS_HEIGHT}px` }"
        :player-result
        :animation="animationPending && { duration: `${PLAYER_ANIMATION_DURATION / 1000}s` }"
      />
    </TransitionGroup>
  </ScrollArea>
</template>

<style scoped>
.results-move,
.results-enter-active,
.results-leave-active {
  transition: all 0.5s ease;
}

.results-enter-from,
.results-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.results-leave-active {
  position: absolute;
}
</style>
