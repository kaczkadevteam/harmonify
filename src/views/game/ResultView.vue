<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

function handlePlayAgain() {
  router.push({ name: 'setup' })
}
</script>

<template>
  <Button @click="handlePlayAgain">
    Play again?
  </Button>
</template>
