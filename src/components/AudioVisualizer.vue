<script setup lang="ts">
import AudioMotionAnalyzer, { type ConstructorOptions as AudioMotionOptions } from 'audiomotion-analyzer'
import { onMounted, onUnmounted, ref } from 'vue'
import { useMusicPlayerStore } from '@/stores'

const container = ref<HTMLDivElement | null>(null)
const musicPlayerStore = useMusicPlayerStore()
const audioVisualizer = ref<AudioMotionAnalyzer>()

onMounted(() => {
  const options: AudioMotionOptions = {
    source: musicPlayerStore.audioSource ?? undefined,
    mode: 6,
    gradient: 'classic',
    overlay: true,
    showBgColor: false,
    showPeaks: false,
    fftSize: 16384,
    smoothing: 0,
    minDecibels: -75,
    maxFreq: 16000,
    showScaleX: false,
    volume: musicPlayerStore.volume,
  }

  audioVisualizer.value = new AudioMotionAnalyzer(container.value!, options)
  audioVisualizer.value.registerGradient('classic', {
    bgColor: '#111',
    colorStops: [
      'hsla(38, 92%, 50%, 100%)',
    ],
  })
})

musicPlayerStore.$subscribe((_, state) => {
  if (audioVisualizer.value)
    audioVisualizer.value.volume = state.volume
})

onUnmounted(() => {
  audioVisualizer.value?.destroy()
})
</script>

<template>
  <div ref="container" />
</template>
