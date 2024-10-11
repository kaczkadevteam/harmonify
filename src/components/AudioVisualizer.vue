<script setup lang="ts">
import AudioMotionAnalyzer, { type ConstructorOptions as AudioMotionOptions } from 'audiomotion-analyzer'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
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
    volume: 0,
    start: false,
  }

  audioVisualizer.value = new AudioMotionAnalyzer(container.value!, options)
  audioVisualizer.value.registerGradient('classic', {
    bgColor: '#111',
    colorStops: [
      'hsla(38, 92%, 50%, 100%)',
    ],
  })

  /* Let broken sound from previous round play silently before turning on visualizer */
  setTimeout(() => {
    audioVisualizer.value!.start()
    audioVisualizer.value!.volume = musicPlayerStore.volume
  }, 300)
})

musicPlayerStore.$subscribe((_, state) => {
  if (audioVisualizer.value)
    audioVisualizer.value.volume = state.volume
})

onUnmounted(async () => {
  audioVisualizer.value?.destroy()
})
</script>

<template>
  <div ref="container" />
</template>
