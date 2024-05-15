<script setup lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core'
import type { PlayerScoreDto } from '@/types'
import { useGameDataStore } from '@/stores'
import Player from '@/components/Player.vue'

const props = defineProps<{
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
    <div class="h-full rounded-md bg-primary text-right text-primary-foreground" :style="{ width: `${width}rem` }" />
    <div>{{ playerResult.score }}</div>
  </div>
</template>
