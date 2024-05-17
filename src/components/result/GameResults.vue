<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import PlayerResult from '@/components/roundResult/PlayerResult.vue'
import { useResultStore } from '@/stores'
import type { PlayerScoreDto } from '@/types'

// const resultStore = useResultStore()
const scoreBarMaxWidth = 320
const resultsGap = 16
const resultHeight = 32
const resultsWidth = scoreBarMaxWidth + 240
const maxVisibleResults = 6
const intervalBeforeFirstPlace = 1000

function getIntervalForIndex(index: number) {
  switch (index) {
    case 1:
      return intervalBeforeFirstPlace
    case 2:
      return 800
    case 3:
      return 500
    default:
      return 300
  }
}

const results = computed(() => {
  const results = [
    {
      guid: '820b35e9-cf01-472f-8b53-60d3f71bb03a',
      nickname: 'BrightIndigoPanther17',
      score: 321,
    },
    {
      guid: '72fb5e0f-d6d9-497d-87aa-5021d80db0e1',
      nickname: 'CunningCeruleanCoyote97',
      score: 320,
    },
    {
      guid: '820b35e9-cf01-472f-8b53-6033f71bb03a',
      nickname: 'BrightIndigoPanther17',
      score: 256,
    },
    {
      guid: '820b35e9-cf01-472f-8b53-6da3f71bb03a',
      nickname: 'BrightIndigoPanther17',
      score: 156,
    },
  ]

  const bestScore: number = results[0]?.score ?? 0

  return results.map(r => ({ ...r, width: (r.score / bestScore) * scoreBarMaxWidth }))
})

const displayedResults = ref<(PlayerScoreDto & { width: number })[]>([])

const resultsLeft = ref(results.value.length)
const containerHeight = computed(() => {
  let resultsToShow = 0
  if (results.value.length > maxVisibleResults)
    resultsToShow = maxVisibleResults

  else
    resultsToShow = results.value.length

  return resultsToShow * (resultHeight + resultsGap) - resultsGap
})

const interval = ref(getIntervalForIndex(resultsLeft.value - 1))
const { pause } = useIntervalFn(() => {
  resultsLeft.value--

  if (resultsLeft.value <= 0)
    pause()
  else
    interval.value = getIntervalForIndex(resultsLeft.value)

  displayedResults.value.push(results.value[resultsLeft.value])
}, interval)
</script>

<template>
  <TransitionGroup name="results" tag="div" class="flex flex-col-reverse gap-4 overflow-hidden" :style="{ height: `${containerHeight}px`, width: `${resultsWidth}px`, gap: `${resultsGap}px` }">
    <PlayerResult
      v-for="playerResult in displayedResults"
      :key="playerResult.guid"
      :style="{ height: `${resultHeight}px` }"
      :player-result
      animated
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
  transform: translateX(30px);
}

.results-leave-active {
  position: absolute;
}
</style>
