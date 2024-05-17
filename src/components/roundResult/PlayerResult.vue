<script setup lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core'
import type { PlayerScoreDto } from '@/types'
import { useGameDataStore } from '@/stores'
import Player from '@/components/Player.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  animated?: boolean
  playerResult: PlayerScoreDto & { width: number }
}>()

const gameDataStore = useGameDataStore()
const width = useTransition(() => props.playerResult.width, {
  duration: 1000,
  transition: TransitionPresets.linear,
})
</script>

<template>
  <div class="flex items-center gap-2">
    <Player
      :player="playerResult"
      :is-host="playerResult.guid === gameDataStore.selfPlayer.guid"
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
