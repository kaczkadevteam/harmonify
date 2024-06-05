<script setup lang="ts">
import { computed } from 'vue'
import { useTimeout } from '@vueuse/core'
import PlayerResult from './PlayerResult.vue'
import { useResultStore } from '@/stores'

const props = defineProps<{
  /**
   * Value in px
   */
  pointsBarMaxWidth: number
}>()

const resultStore = useResultStore()

const showCurrentScore = useTimeout(1000)
const playerResults = computed(() => {
  const results = showCurrentScore.value
    ? resultStore.round.players
    : resultStore.round.previousPlayerScores

  const bestScore: number = results[0]?.score ?? 0

  return results.map((r) => {
    const width = bestScore === 0 ? 0 : (r.score / bestScore) * props.pointsBarMaxWidth

    return { ...r, width }
  })
})
const isFirstRound = computed(() => resultStore.round.previousPlayerScores.length === 0)
</script>

<template>
  <TransitionGroup name="results" tag="div" class="grid gap-4">
    <PlayerResult
      v-for="playerResult in playerResults"
      :key="playerResult.guid"
      :animation="isFirstRound && { duration: `1s` }"
      :player-result
      :display-guess-level="showCurrentScore"
    />
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
