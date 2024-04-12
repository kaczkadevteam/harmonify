<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

function onPlayAgain() {
  router.push({ name: 'setup' })
}
</script>

<template>
  <Button @click="onPlayAgain">
    Play again?
  </Button>
</template>
