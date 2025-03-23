<script setup lang="ts">
import type { PlayerDto } from '@/types'
import { cn } from '@/lib/utils'
import { CircleUserRound } from 'lucide-vue-next'
import NicknameForm from './NicknameForm.vue'

withDefaults(defineProps<{
  isSelf: boolean
  player: PlayerDto
  editable?: boolean
}>(), {
  editable: false,
})
</script>

<template>
  <div :class="cn('flex w-fit max-w-60 items-center gap-2', !player.connected && 'text-gray-500')">
    <CircleUserRound :class="cn('min-w-8 min-h-8', isSelf && 'text-primary')" />
    <NicknameForm v-if="editable" :nickname="player.nickname" />
    <div v-else class="ml-3 truncate text-sm md:text-base">
      {{ player.nickname }}
    </div>
  </div>
</template>
