<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useConnectionStore } from '@/stores'
import { Button } from '@/components/ui/button'

const router = useRouter()
const connectionStore = useConnectionStore()

function handleClick() {
  if (connectionStore.ws)
    connectionStore.sendMessage({ $type: 'message', type: 'quitGame' })
  else
    router.push({ name: 'home' })
}
</script>

<template>
  <Button variant="outline" @click="handleClick">
    <span>Quit game</span>
  </Button>
</template>
