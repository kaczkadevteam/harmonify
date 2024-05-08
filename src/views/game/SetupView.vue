<script setup lang="ts">
import { CircleUserRound } from 'lucide-vue-next'
import HostView from '@/components/setup/HostView.vue'
import { useGameDataStore } from '@/stores'

const gameDataStore = useGameDataStore()
</script>

<template>
  <main class="grid grid-cols-[200px_1fr] items-start gap-4">
    <div class="flex items-center gap-2">
      <CircleUserRound class="size-14" />
      <div>{{ gameDataStore.selfPlayer.guid }}</div>
    </div>
    <HostView v-if="gameDataStore.selfPlayer.isHost" />
  </main>
</template>
