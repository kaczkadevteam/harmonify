<script setup lang="ts">
import { CircleUserRound } from 'lucide-vue-next'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import HostView from '@/components/setup/HostView.vue'
import { useConnectionStore, useGameDataStore } from '@/stores'
import LoadingCircle from '@/components/LoadingCircle.vue'

const router = useRouter()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()

onBeforeMount(() => {
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/gameStartedDto') {
      gameDataStore.startGame(message.data)
      router.push({ name: 'round', params: router.currentRoute.value.params })
    }
  }
})
</script>

<template>
  <main class="grid grid-cols-[200px_1fr] items-start gap-4">
    <div class="flex items-center gap-2">
      <CircleUserRound class="size-14" />
      <div>{{ gameDataStore.selfPlayer.nickname }}</div>
    </div>
    <HostView v-if="gameDataStore.selfPlayer.isHost" />
    <div v-else class="flex items-center gap-5 self-center text-2xl">
      <span>Waiting for host to start game</span><LoadingCircle size="60px" />
    </div>
  </main>
</template>
