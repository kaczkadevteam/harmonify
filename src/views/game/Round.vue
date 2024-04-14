<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useGameResultStore } from '@/stores/gameResult'
import { useGameDataStore } from '@/stores/gameData'
import SearchInput from '@/components/round/SearchInput.vue'

const route = useRoute()
const router = useRouter()
const gameDataStore = useGameDataStore()
const gameResultStore = useGameResultStore()

const guess = ref('')

if (!gameDataStore.selectedTracks || gameDataStore.selectedTracks.length === 0)
  router.push({ name: 'setup' })

function onQuit() {
  gameResultStore.playedTracks = []
  gameResultStore.score = 0

  router.push({ name: 'result', params: route.params })
}
</script>

<template>
  <SearchInput v-model="guess" :tracks="gameDataStore.tracks" />
  <Button @click="onQuit">
    Quit
  </Button>
</template>
