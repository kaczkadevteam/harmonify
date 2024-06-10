<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import PauseGameButton from '@/components/PauseGameButton.vue'
import PreviewPlayer from '@/components/PreviewPlayer.vue'
import { useGameDataStore } from '@/stores'
import QuitGameButton from '@/components/QuitGameButton.vue'

const gameDataStore = useGameDataStore()
const route = useRoute()

const displayPauseButton = computed(() => gameDataStore.selfPlayer.isHost && (route.name === 'round' || route.name === 'roundResult'))
</script>

<template>
  <div class="grid min-h-screen place-content-stretch">
    <div class="fixed right-2 top-2 z-20 flex items-center">
      <PauseGameButton v-if="displayPauseButton" />
      <QuitGameButton />
    </div>

    <RouterView />
    <PreviewPlayer />
  </div>
</template>
