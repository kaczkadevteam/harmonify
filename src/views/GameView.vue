<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'

const settings = useSettingsStore()
</script>

<template>
  <div class="grid min-h-screen place-content-center">
    <RouterView />
    <SpotifyPlayer v-if="settings.player === 'spotify'" />
  </div>
</template>
