<script setup lang="ts">
import { useMusicPlayerStore } from '@/stores'
import { useMediaControls } from '@vueuse/core'
import { nextTick, onMounted, ref } from 'vue'

const audioEl = ref<HTMLAudioElement | null>(null)
const src = ref<string | undefined>()
const musicPlayerStore = useMusicPlayerStore()
const audioContext = ref(new AudioContext())

const { playing, currentTime, volume } = useMediaControls(audioEl)

onMounted(() => {
  // Volume is controlled by AudioVisualizer
  volume.value = 1
  musicPlayerStore.audioSource = audioContext.value.createMediaElementSource(audioEl.value!)
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
  async _setVolume(_newVolume) {
    // Volume is controlled by AudioVisualizer
    volume.value = 1
  },
}
</script>

<template>
  <audio ref="audioEl" :src crossorigin="anonymous" />
</template>
