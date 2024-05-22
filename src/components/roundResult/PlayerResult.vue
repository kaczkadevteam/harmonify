<script setup lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core'
import { computed } from 'vue'
import type { PlayerScoreDto } from '@/types'
import { useGameDataStore } from '@/stores'
import Player from '@/components/Player.vue'
import { cn } from '@/lib/utils'
import GuessLevelIcon from '@/components/GuessLevelIcon.vue'

const props = defineProps<{
  animated?: boolean
  playerResult: PlayerScoreDto & { width: number }
  displayGuessLevel?: boolean
}>()

const gameDataStore = useGameDataStore()
const width = useTransition(() => props.playerResult.width, {
  duration: 1000,
  transition: TransitionPresets.linear,
})
const guessLevel = computed(() => props.playerResult.roundResults.at(-1)!.guessLevel)
</script>

<template>
  <div class="relative flex items-center gap-2">
    <GuessLevelIcon v-if="displayGuessLevel" :guess-level="guessLevel" class="relative -bottom-2 -mr-2 self-end" />
    <Player
      :player="playerResult"
      :is-self="playerResult.guid === gameDataStore.selfPlayer.guid"
    />
    <div :class="cn('h-full origin-left rounded-md bg-primary text-right text-primary-foreground', animated && 'animated')" :style="{ width: `${width}px` }" />
    <div>{{ playerResult.score }}</div>
  </div>
</template>

<style scoped>
.animated {
  transform: scaleX(0);
  animation: grow-x 1s ease-in-out 0.2s;
  animation-fill-mode: forwards;
}
</style>
