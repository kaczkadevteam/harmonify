<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { Pause, Play } from 'lucide-vue-next'
import VolumeInput from './VolumeInput.vue'
import { useGameDataStore, useMusicPlayerStore } from '@/stores'
import type { MusicPlayData, Track } from '@/types'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  isPlaying: boolean
  musicPlayData: MusicPlayData
}>()

const isPlayingStarted = ref(false)
const musicPlayerStore = useMusicPlayerStore()
const gameDataStore = useGameDataStore()

async function startPlaying() {
  if (!gameDataStore.selfPlayer.isHost)
    return
  if (!isPlayingStarted.value) {
    isPlayingStarted.value = true

    await musicPlayerStore.play(props.musicPlayData)
  }
  else {
    await musicPlayerStore.resume()
  }
}

async function stopPlaying() {
  if (!gameDataStore.selfPlayer.isHost)
    return
  await musicPlayerStore.pause()
}

watch(() => props.isPlaying, (isPlaying) => {
  if (isPlaying) {
    musicPlayerStore.seek(props.musicPlayData.trackStart_ms)
    startPlaying()
  }

  else {
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
    <Button id="playbackButton" class="h-20 w-32 rounded-xl bg-[linear-gradient(0.25turn,#1b3162_49%,50%,transparent)] bg-[length:200%_200%] bg-[position:100%_0]">
      <Pause v-if="isPlaying" class="size-12" />
      <Play v-else class="size-12" />
    </Button>
    <VolumeInput class="absolute inset-y-0 left-full p-4" />
  </div>
</template>
