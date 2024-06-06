<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import confetti from 'canvas-confetti'
import PlayerResult from '@/components/roundResult/PlayerResult.vue'
import { useResultStore } from '@/stores'
import type { PlayerScoreDto } from '@/types'

defineProps<{
  isMobileSize: boolean
}>()

const emit = defineEmits<{
  animationFinished: []
}>()

const resultStore = useResultStore()
const scoreBarMaxWidth = 220
const resultsGap = 16
const resultHeight = 40
const resultsWidth = scoreBarMaxWidth + 100
const intervalBeforeFirstPlace = 1000
const playerAnimationDuration = 1000

function getIntervalForIndex(index: number) {
  switch (index) {
    case 1:
      return intervalBeforeFirstPlace
    case 2:
      return 800
    default:
      return 500
  }
}

const animationPending = ref(true)
const results = computed(() => {
  const results = resultStore.game.players

  const bestScore: number = results[0]?.score ?? 0

  return results.map(r => ({ ...r, width: (r.score / bestScore) * scoreBarMaxWidth }))
})

const displayedResults = ref<(PlayerScoreDto & { width: number })[]>([])

const resultsLeft = ref(results.value.length)

const interval = ref(getIntervalForIndex(resultsLeft.value - 1))
const { pause } = useIntervalFn(() => {
  resultsLeft.value--

  if (resultsLeft.value <= 0) {
    const velocities: number[] = Array.from({ length: 5 }).map(() => Math.random() * 50 + 65)

    pause()
    setTimeout(() => {
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
    }, intervalBeforeFirstPlace / 2)

    setTimeout(() => {
      animationPending.value = false
      emit('animationFinished')
    }, intervalBeforeFirstPlace + playerAnimationDuration)
  }

  else { interval.value = getIntervalForIndex(resultsLeft.value) }

  displayedResults.value.push(results.value[resultsLeft.value])
}, interval)
</script>

<template>
  <TransitionGroup name="results" tag="div" class=" flex flex-col-reverse gap-4 rounded-lg" :style="{ width: `${resultsWidth}px`, gap: `${resultsGap}px` }">
    <PlayerResult
      v-for="playerResult in displayedResults"
      :key="playerResult.guid"
      class="ml-2"
      :style="{ height: `${resultHeight}px` }"
      :player-result
      :animation="animationPending && { duration: `${playerAnimationDuration / 1000}s` }"
    />
  </TransitionGroup>
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
