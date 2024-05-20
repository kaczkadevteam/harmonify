<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import { onUnmounted, ref, watch } from 'vue'
import { useAnimate, watchOnce } from '@vueuse/core'
import VolumeInput from './VolumeInput.vue'
import { Button } from '@/components/ui/button'
import { useGameDataStore, useMusicPlayerStore } from '@/stores'

const gameDataStore = useGameDataStore()
const musicPlayerStore = useMusicPlayerStore()

const isPlayingStarted = ref(false)
const isPlaying = ref(false)

const playButton = ref<HTMLButtonElement | null>(null)
const trackTimer = useAnimate(
  playButton,
  [{ backgroundPositionX: '100%' }, { backgroundPositionX: '0%' }],
  { duration: gameDataStore.gameSettings.breakDurationBetweenTrackPlays * 1000, iterations: 1, immediate: true, direction: 'reverse' },
)

function handleTrackTimerFinish() {
  isPlaying.value = !isPlaying.value
}

watchOnce(() => trackTimer.animate.value, (value) => {
  if (value)
    value.onfinish = handleTrackTimerFinish
})

async function startPlaying() {
  if (!isPlayingStarted.value) {
    isPlayingStarted.value = true

    await musicPlayerStore.play(gameDataStore.musicPlayData)
  }
  else {
    await musicPlayerStore.resume()
  }
}

async function stopPlaying() {
  await musicPlayerStore.pause()
}

watch(isPlaying, (isPlaying) => {
  trackTimer.reverse()

  if (isPlaying) {
    trackTimer.playbackRate.value = -(gameDataStore.gameSettings.breakDurationBetweenTrackPlays / gameDataStore.gameSettings.trackDuration)
    musicPlayerStore.seek(gameDataStore.musicPlayData.trackStart_ms)
    startPlaying()
  }

  else {
    trackTimer.playbackRate.value = 1
    stopPlaying()
  }
})

onUnmounted(() => {
  stopPlaying()
})
</script>

<template>
  <div class="relative">
    <!-- eslint-disable-next-line tailwindcss/no-contradicting-classname -->
    <Button id="playbackButton" ref="playButton" class="h-20 w-32 rounded-xl bg-[linear-gradient(0.25turn,#1b3162_49%,50%,transparent)] bg-[length:200%_200%] bg-[position:100%_0]">
      <Pause v-if="isPlaying" class="size-12" />
      <Play v-else class="size-12" />
    </Button>
    <VolumeInput class="absolute inset-y-0 left-full p-4" />
  </div>
</template>
