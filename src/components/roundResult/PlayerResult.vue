<script setup lang="ts">
import { TransitionPresets, toRefs, useTransition } from '@vueuse/core'
import { CircleCheck, CircleMinus, CircleX } from 'lucide-vue-next'
import { computed } from 'vue'
import type { PlayerScoreDto } from '@/types'
import { useGameDataStore } from '@/stores'
import Player from '@/components/Player.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  animated?: boolean
  playerResult: PlayerScoreDto & { width: number }
  guessLevel?: 'full' | 'partial' | 'none'
}>()

const gameDataStore = useGameDataStore()
const width = useTransition(() => props.playerResult.width, {
  duration: 1000,
  transition: TransitionPresets.linear,
})
const [icon, color] = toRefs(computed(() => {
  switch (props.guessLevel) {
    case 'full':
      return [CircleCheck, 'text-green-500']
    case 'partial':
      return [CircleMinus, 'text-yellow-500']
    default:
      return [CircleX, 'text-red-500']
  }
}))
</script>

<template>
  <div class="relative flex items-center gap-2">
    <component :is="icon" v-if="guessLevel" :class="cn(' min-w-4 min-h-4 w-4 h-4 self-end -mr-2 relative -bottom-2', color)" />
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
