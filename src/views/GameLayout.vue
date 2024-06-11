<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import PauseGameButton from '@/components/PauseGameButton.vue'
import PreviewPlayer from '@/components/PreviewPlayer.vue'
import { useGameDataStore } from '@/stores'
import QuitGameButton from '@/components/QuitGameButton.vue'
import Settings from '@/components/Settings.vue'

const gameDataStore = useGameDataStore()
const route = useRoute()

const displayPauseButton = computed(() => gameDataStore.selfPlayer.isHost && (route.name === 'round' || route.name === 'roundResult'))
</script>

<template>
  <div class="grid min-h-screen grid-rows-[minmax(0,auto)_1fr] place-content-stretch">
    <div class="z-20 grid grid-cols-[minmax(auto,1300px)] justify-center border-b">
      <div class="flex items-center justify-end p-1">
        <Settings />
        <PauseGameButton v-if="displayPauseButton" />
        <QuitGameButton />
      </div>
    </div>
    <RouterView class="relative" />
    <PreviewPlayer />
  </div>
</template>
