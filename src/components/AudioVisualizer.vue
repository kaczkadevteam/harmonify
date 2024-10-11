<script setup lang="ts">
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { onMounted, onUnmounted, ref } from 'vue'
import { useMusicPlayerStore } from '@/stores'

const container = ref<HTMLDivElement | null>(null)
const musicPlayerStore = useMusicPlayerStore()
const audioVisualizer = ref<AudioMotionAnalyzer>()

onMounted(() => {
  audioVisualizer.value = new AudioMotionAnalyzer(container.value!, { source: musicPlayerStore.audioSource ?? undefined })
})

onUnmounted(() => {
  audioVisualizer.value?.destroy()
})
</script>

<template>
  <div ref="container" />
</template>
