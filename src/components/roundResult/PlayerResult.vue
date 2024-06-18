<script setup lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core'
import { computed } from 'vue'
import { CircleUserRound } from 'lucide-vue-next'
import type { PlayerScoreDto } from '@/types'
import { useGameDataStore } from '@/stores'
import { cn } from '@/lib/utils'
import GuessLevelIcon from '@/components/GuessLevelIcon.vue'
import { AnimationDuration } from '@/consts'
import { GuessDisplay } from '@/components/trackDisplay'

const props = defineProps<{
  animation?: false | { duration: string }
  playerResult: PlayerScoreDto & { width: number }
  displayGuessLevel?: boolean
}>()

const gameDataStore = useGameDataStore()
const width = useTransition(() => props.playerResult.width, {
  duration: AnimationDuration.D1000,
  transition: TransitionPresets.linear,
})
const guess = computed(() => props.playerResult.roundResults.at(-1)!.guess)
const guessLevel = computed(() => props.playerResult.roundResults.at(-1)!.guessLevel)
const isSelf = computed(() => props.playerResult.guid === gameDataStore.selfPlayer.guid)
</script>

<template>
  <div class="grid">
    <div class="relative flex items-center gap-2">
      <GuessLevelIcon v-if="displayGuessLevel" :guess-level="guessLevel" class="relative -bottom-2 -mr-2 self-end" />
      <div v-else class="relative -bottom-2 -mr-2 min-h-4 min-w-4 self-end" />
      <CircleUserRound :class="cn('min-w-8 min-h-8', isSelf && 'text-primary')" />
      <div class="grid grid-rows-2">
        <div class="mr-3 text-sm">
          {{ props.playerResult.nickname }}
        </div>
        <div :class="cn('h-3/4 origin-left rounded-md bg-primary text-right text-primary-foreground', animation && 'animated')" :style="{ width: `${width}px` }" />
      </div>
      <div>{{ playerResult.score }}</div>
    </div>
    <div v-if="displayGuessLevel && guessLevel !== 'full' && guess !== ''" class="text-nowrap text-sm">
      <span>Guess: </span>
      <GuessDisplay :guess="guess" />
    </div>
  </div>
</template>

<style scoped>
.animated {
  transform: scaleX(0);
  animation: grow-x v-bind('animation && animation.duration') ease-in-out 0.2s;
  animation-fill-mode: forwards;
}
</style>
