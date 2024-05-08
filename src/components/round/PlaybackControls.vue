<script setup lang="ts">
import { ref, watch } from 'vue'
import { Pause, Play } from 'lucide-vue-next'
import VolumeInput from './VolumeInput.vue'
import { useMusicPlayerStore } from '@/stores'
import type { Track } from '@/types'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  isPlaying: boolean
  selectedTrack: Track & { trackStart_ms: number }
  trackPlayRepeats: number
}>()

const emit = defineEmits<{
  playStart: []
  playChange: [value: boolean]
}>()

const isPlayingStarted = ref(false)
const musicPlayerStore = useMusicPlayerStore()

function togglePlay() {
  emit('playChange', !props.isPlaying)
}

async function startPlaying() {
  if (!isPlayingStarted.value) {
    isPlayingStarted.value = true

    await musicPlayerStore.play(props.selectedTrack)
    emit('playStart')
  }
  else {
    await musicPlayerStore.resume()
  }
}

async function stopPlaying() {
  await musicPlayerStore.pause()
}

watch(() => props.isPlaying, (isPlaying) => {
  if (isPlaying)
    startPlaying()

  else stopPlaying()
})

/**
 * If selected track changes reset playback
 */
watch(() => props.selectedTrack, () => {
  isPlayingStarted.value = false
})

/**
 * If trackPlayRepeats increases loop the song
 */
watch(() => props.trackPlayRepeats, (newValue, oldValue) => {
  if (newValue > oldValue)
    musicPlayerStore.seek(props.selectedTrack.trackStart_ms)
})
</script>

<template>
  <div class="relative">
    <!-- eslint-disable-next-line tailwindcss/no-contradicting-classname -->
    <Button id="playbackButton" class="h-20 w-32 rounded-xl bg-[linear-gradient(0.25turn,#1b3162_49%,50%,transparent)] bg-[length:200%_200%] bg-[position:100%_0]" @click="togglePlay">
      <Pause v-if="isPlaying" class="size-12" />
      <Play v-else class="size-12" />
    </Button>
    <VolumeInput class="absolute inset-y-0 left-full p-4" />
  </div>
</template>
