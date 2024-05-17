<script setup lang="ts">
import { computed } from 'vue'
import { useGameDataStore } from '@/stores'

const gameDataStore = useGameDataStore()
const waitTime = computed(() => `${gameDataStore.gameSettings.breakDurationBetweenRounds}s`)
</script>

<template>
  <div class="loading-indicator fixed left-0 top-0 h-3 w-screen origin-left bg-primary" />
</template>

<style scoped>
.loading-indicator {
  animation: grow-x v-bind(waitTime) linear;
}
</style>
