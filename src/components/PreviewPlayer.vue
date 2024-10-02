<script setup lang="ts">
import { useMediaControls } from '@vueuse/core'
import { nextTick, onMounted, ref } from 'vue'
import { useMusicPlayerStore } from '@/stores'

const audioEl = ref<HTMLAudioElement | null>(null)
const src = ref<string | undefined>()
const musicPlayerStore = useMusicPlayerStore()

const { playing, currentTime, volume } = useMediaControls(audioEl)

onMounted(() => {
  volume.value = musicPlayerStore.volume
  musicPlayerStore.audioElement = audioEl.value
})

musicPlayerStore.player = {
  async _turnOn() {},
  async _play(playData) {
    src.value = playData.uri
    await nextTick()
    currentTime.value = playData.trackStart_ms / 1000
    playing.value = true
  },
  async _seek(time_ms) {
    currentTime.value = time_ms / 1000
  },
  async _pause() {
    playing.value = false
  },
  async _resume() {
    playing.value = true
  },
  async _setVolume(newVolume) {
    volume.value = newVolume
  },
}
</script>

<template>
  <audio ref="audioEl" :src crossorigin="anonymous" />
</template>
