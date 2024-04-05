<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import { usePlayerStore } from '@/stores/player'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'

const settings = useSettingsStore()
const playerStore = usePlayerStore()
</script>

<template>
  <SpotifyPlayer v-if="settings.player === 'spotify'" />
  <div v-if="playerStore.player">
    Play
  </div>
  <div v-else>
    Connecting
  </div>
</template>
