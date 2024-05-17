<script setup lang="ts">
import { computed } from 'vue'
import { useTimeout } from '@vueuse/core'
import PlayerResult from './PlayerResult.vue'
import { useResultStore } from '@/stores'
import type { PlayerScoreDto } from '@/types'

const props = defineProps<{
  /**
   * Value in px
   */
  pointsBarMaxWidth: number
}>()

const resultStore = useResultStore()

const showCurrentScore = useTimeout(1000)
const playerResults = computed(() => {
  let results: PlayerScoreDto[] = []
  if (showCurrentScore.value)
    results = resultStore.round.players
  else
    results = resultStore.round.previousPlayerScores

  results.sort((a, b) => b.score - a.score)

  const bestScore: number = results[0]?.score ?? 0

  return results.map(r => ({ ...r, width: (r.score / bestScore) * props.pointsBarMaxWidth }))
})
</script>

<template>
  <TransitionGroup name="results" tag="div" class="grid gap-4">
    <PlayerResult v-for="playerResult in playerResults" :key="playerResult.guid" :player-result />
  </TransitionGroup>
</template>

<style scoped>
.results-move,
.results-enter-active,
.results-leave-active {
  transition: all 1s ease;
}

.results-enter-from,
.results-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.results-leave-active {
  position: absolute;
}
</style>
