<script setup lang="ts">
import { CircleUserRound } from 'lucide-vue-next'
import type { PlayerDto } from '@/types'
import { cn } from '@/lib/utils'

defineProps<{
  isHost: boolean
  player: PlayerDto
}>()
</script>

<template>
  <div class="flex w-40 items-center gap-2">
    <CircleUserRound :class="cn('min-w-8 min-h-8', isHost && 'text-primary')" />
    <div class="truncate">
      {{ player.nickname }}
    </div>
  </div>
</template>
