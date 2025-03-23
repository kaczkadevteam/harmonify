<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useConnectionStore, useGameDataStore } from '@/stores'
import { Pause, Play } from 'lucide-vue-next'
import { computed } from 'vue'

const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()
const icon = computed(() => gameDataStore.isPaused ? Play : Pause)

function handleClick() {
  const message: { $type: 'message', type: string } = { $type: 'message', type: gameDataStore.isPaused ? 'resumeGame' : 'pauseGame' }

  connectionStore.sendMessage(message)
}
</script>

<template>
  <Button variant="ghost" size="icon" @click="handleClick">
    <component :is="icon" />
  </Button>
</template>
