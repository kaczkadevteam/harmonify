<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Pause, Play } from 'lucide-vue-next'
import { useGameDataStore } from '@/stores/gameData'
import { usePlayerStore } from '@/stores/player'
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
const playerStore = usePlayerStore()

function togglePlay() {
  if (props.isPlaying)
    emit('playChange', false)

  else
    emit('playChange', true)
}

async function startPlaying() {
  if (!isPlayingStarted.value) {
    isPlayingStarted.value = true

    await playerStore.play(props.selectedTrack)
    emit('playStart')
  }
  else {
    await playerStore.resume()
  }
}

async function stopPlaying() {
  await playerStore.pause()
}

/**
 *
 */
watch(() => props.isPlaying, (value) => {
  if (value)
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
    playerStore.seek(props.selectedTrack.trackStart_ms)
})
</script>

<template>
  <div>
    <!-- eslint-disable-next-line tailwindcss/no-contradicting-classname -->
    <Button id="playbackButton" class="bg-[linear-gradient(0.25turn,#1b3162_49%,50%,transparent)] bg-[length:200%_200%] bg-[position:100%_0]" @click="togglePlay">
      <Play v-if="isPlaying" />
      <Pause v-else />
    </Button>
    <!-- volume input here -->
  </div>
</template>
