<script setup lang="ts">
import { computed } from 'vue'
import { useConnectionStore, useGameDataStore } from '@/stores'
import { Button } from '@/components/ui/button'

const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()
const text = computed(() => gameDataStore.isPaused ? 'Resume game' : 'Pause game')

function handleClick() {
  const message: { $type: 'message', type: string } = { $type: 'message', type: gameDataStore.isPaused ? 'resumeGame' : 'pauseGame' }

  connectionStore.sendMessage(message)
}
</script>

<template>
  <Button variant="outline" @click="handleClick">
    <span>{{ text }}</span>
  </Button>
</template>
