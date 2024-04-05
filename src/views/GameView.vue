<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'

const settings = useSettingsStore()
</script>

<template>
  <SpotifyPlayer v-if="settings.player === 'spotify'" />
  <RouterView />
</template>
