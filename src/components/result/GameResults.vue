<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntervalFn, useSorted } from '@vueuse/core'
import PlayerResult from '@/components/roundResult/PlayerResult.vue'
import { useResultStore } from '@/stores'
import type { PlayerScoreDto } from '@/types'

// const resultStore = useResultStore()
const results = computed(() => {
  const results = [
    {
      guid: '820b35e9-cf01-472f-8b53-6033f71bb03a',
      nickname: 'BrightIndigoPanther17',
      score: 321,
    },
    {
      guid: '820b35e9-cf01-472f-8b53-6033f71bb03a',
      nickname: 'BrightIndigoPanther17',
      score: 256,
    },
    {
      guid: '820b35e9-cf01-472f-8b53-6033f71bb03a',
      nickname: 'BrightIndigoPanther17',
      score: 156,
    },
    {
      guid: '72fb5e0f-d6d9-497d-87aa-504ed80db0e1',
      nickname: 'CunningCeruleanCoyote97',
      score: 320,
    },
  ]

  results.sort((a, b) => b.score - a.score)

  const bestScore: number = results[0]?.score ?? 0

  return results.map(r => ({ ...r, width: (r.score / bestScore) * 20 }))
})

const displayedResults = ref<(PlayerScoreDto & { width: number })[]>([])
const resultsLeft = ref(results.value.length)
const interval = ref(500)
const { pause } = useIntervalFn(() => {
  resultsLeft.value--

  if (resultsLeft.value <= 0)
    pause()

  displayedResults.value.push(results.value[resultsLeft.value])
}, interval)
</script>

<template>
  <TransitionGroup name="results" tag="div" class="flex h-60 flex-col-reverse gap-4">
    <PlayerResult v-for="playerResult in displayedResults" :key="playerResult.guid" :player-result class="h-8" />
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
  transform: translateX(30px);
}

.results-leave-active {
  position: absolute;
}
</style>
