<script setup lang="ts">
import { useGameDataStore } from '@/stores'
import { computed } from 'vue'

const gameDataStore = useGameDataStore()
const waitTime = computed(() => `${gameDataStore.gameSettings.breakDurationBetweenRounds}s`)
</script>

<template>
  <div class="loading-indicator absolute left-0 top-0 h-1.5 w-screen origin-left bg-primary md:h-3" />
</template>

<style scoped>
.loading-indicator {
  animation: grow-x v-bind(waitTime) linear;
}
</style>
