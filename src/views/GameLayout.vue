<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import { useGameDataStore } from '@/stores'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'

const settings = useSettingsStore()
const gameDataStore = useGameDataStore()
</script>

<template>
  <div class="grid min-h-screen place-content-center">
    <RouterView />
    <SpotifyPlayer v-if="settings.player === 'spotify' && gameDataStore.selfPlayer.isHost" />
  </div>
</template>
