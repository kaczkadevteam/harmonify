<script setup lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core'
import type { PlayerScoreDto } from '@/types'

const props = defineProps<{
  playerResult: PlayerScoreDto & { width: number }
}>()

const width = useTransition(() => props.playerResult.width, {
  duration: 1000,
  transition: TransitionPresets.linear,
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 truncate">
      {{ playerResult.nickname }}
    </div>
    <div class="h-full rounded-md bg-primary text-right text-primary-foreground" :style="{ width: `${width}rem` }" />
    <div>{{ playerResult.score }}</div>
  </div>
</template>