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
const gameDataStore = useGameDataStore()
const playButtonAnimation = ref<Animation>()

function togglePlay() {
  if (props.isPlaying)
    stopPlaying()

  else
    startPlaying()
}

function startPlaying() {
  if (!isPlayingStarted.value) {
    isPlayingStarted.value = true

    playerStore.play(props.selectedTrack)
    emit('playStart')
  }
  else {
    playerStore.resume()
  }
  playButtonAnimation.value!.play()
  emit('playChange', true)
}

function stopPlaying() {
  playerStore.pause()
  playButtonAnimation.value!.pause()
  emit('playChange', false)
}

function getPlayButtonAnimation() {
  const animation = document.getElementById('playbackButton')!.animate(
    [
      { backgroundPositionX: '100%' },
      { backgroundPositionX: '0%' },
    ],
    { duration: gameDataStore.trackDuration * 1000, iterations: 1 },
  )

  if (animation)
    animation.pause()
    // TODO: animation.onfinish = restartTrackTimer

  return animation
}

onMounted(() => {
  playButtonAnimation.value = getPlayButtonAnimation()
})

watch(() => props.isPlaying, (value) => {
  if (value)
    startPlaying()

  else
    stopPlaying()
})

/**
 * If selected track changes reset playback
 */
watch(() => props.selectedTrack, () => {
  isPlayingStarted.value = false
  playButtonAnimation.value!.currentTime = 0
})

/**
 * If trackPlayRepeats increases loop the song
 */
watch(() => props.trackPlayRepeats, (newValue, oldValue) => {
  if (newValue > oldValue) {
    playerStore.seek(props.selectedTrack.trackStart_ms)
    playButtonAnimation.value!.currentTime = 0
  }
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
