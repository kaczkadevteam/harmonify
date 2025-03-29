<script setup lang="ts">
import type { ConstructorOptions as AudioMotionOptions } from 'audiomotion-analyzer'
import { Breakpoint } from '@/consts'
import { cn } from '@/lib/utils'
import { useMusicPlayerStore, useSettingsStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const container = ref<HTMLDivElement | null>(null)
const musicPlayerStore = useMusicPlayerStore()
const settingsStore = useSettingsStore()
const audioVisualizer = ref<AudioMotionAnalyzer>()
const { width: screenWidth } = useWindowSize()

onMounted(() => {
  const options: AudioMotionOptions = {
    source: musicPlayerStore.audioSource ?? undefined,
    mode: getModeForWidth(screenWidth.value),
    gradient: 'classic',
    overlay: true,
    showBgColor: false,
    showPeaks: false,
    fftSize: 16384,
    smoothing: 0,
    minDecibels: -80,
    maxFreq: 16000,
    showScaleX: false,
    volume: 0,
    start: false,
    channelLayout: 'dual-horizontal',
    mirror: -1,
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
    if (!audioVisualizer.value)
      return

    audioVisualizer.value.start()
    audioVisualizer.value.volume = musicPlayerStore.volume
  }, 300)
})

watch(screenWidth, (newWidth) => {
  if (!audioVisualizer.value)
    return

  audioVisualizer.value.mode = getModeForWidth(newWidth)
})

musicPlayerStore.$subscribe((_, state) => {
  if (audioVisualizer.value)
    audioVisualizer.value.volume = state.volume
})

onUnmounted(async () => {
  audioVisualizer.value?.destroy()
})

function getModeForWidth(width: number) {
  if (width <= Breakpoint.SM)
    return 8
  else if (width <= Breakpoint.MD)
    return 7
  else if (width <= Breakpoint.XL2)
    return 6
  else
    return 5
}
</script>

<template>
  <div ref="container" :class="cn(!settingsStore.displayVisualizer && 'hidden')" />
</template>
