<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useGameResultStore } from '@/stores/gameResult'

const route = useRoute()
const router = useRouter()
const gameResultStore = useGameResultStore()

function onQuit() {
  gameResultStore.playedTracks = []
  gameResultStore.score = 0

  router.push({ name: 'result', params: route.params })
}
</script>

<template>
  <Button @click="onQuit">
    Quit
  </Button>
</template>
