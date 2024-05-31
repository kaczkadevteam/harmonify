<script setup lang="ts">
import { CircleUserRound } from 'lucide-vue-next'
import NicknameForm from './NicknameForm.vue'
import type { PlayerDto } from '@/types'
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  isSelf: boolean
  player: PlayerDto
  editable?: boolean
}>(), {
  editable: false,
})
</script>

<template>
  <div class="flex w-fit items-center gap-2">
    <CircleUserRound :class="cn('min-w-8 min-h-8', isSelf && 'text-primary')" />
    <NicknameForm v-if="editable" :nickname="player.nickname" />
    <div v-else class="ml-3 truncate text-sm md:text-base">
      {{ player.nickname }}
    </div>
  </div>
</template>
