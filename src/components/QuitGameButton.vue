<script setup lang="ts">
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
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
  <Button variant="ghost" size="icon" @click="handleClick">
    <X />
  </Button>
</template>
