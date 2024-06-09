<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import PauseGameButton from '@/components/PauseGameButton.vue'
import PreviewPlayer from '@/components/PreviewPlayer.vue'
import { useGameDataStore } from '@/stores'

const gameDataStore = useGameDataStore()
const route = useRoute()

const displayPauseButton = computed(() => gameDataStore.selfPlayer.isHost && (route.name === 'round' || route.name === 'roundResult'))
</script>

<template>
  <div class="grid min-h-screen place-content-stretch">
    <PauseGameButton v-if="displayPauseButton" class="fixed right-2 top-2 z-20" />
    <RouterView />
    <PreviewPlayer />
  </div>
</template>
