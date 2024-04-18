<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue'
import { computedWithControl, useAnimate, useIntervalFn, watchOnce } from '@vueuse/core'
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useGameDataStore, useGameResultStore } from '@/stores'
import SearchInput from '@/components/round/SearchInput.vue'
import { cssNumberishToInt } from '@/lib/utils'
import CircularTimer from '@/components/round/CircularTimer.vue'
import PlaybackControls from '@/components/round/PlaybackControls.vue'
import FinishedRoundDialog from '@/components/round/FinishedRoundDialog.vue'

const route = useRoute()
const router = useRouter()
const gameDataStore = useGameDataStore()
const gameResultStore = useGameResultStore()

const guess = ref('')
const round = ref(1)
const selectedTrack = ref(gameDataStore.getTrackForRound(round.value))
const points = ref(0)

const trackPlayRepeats = ref(0)
const isPlaying = ref(false)
const isRoundFinished = ref(false)

const roundTimeLeft = ref(gameDataStore.roundDuration)
const roundTimer = useIntervalFn(() => {
  roundTimeLeft.value--
  if (roundTimeLeft.value <= 0)
    finishRound()
}, 1000, { immediate: false })

const searchInput = ref<HTMLInputElement | null>(null)
const playButton = ref<HTMLButtonElement | null>(null)
const trackTimer = useAnimate(
  playButton,
  [{ backgroundPositionX: '100%' }, { backgroundPositionX: '0%' }],
  { duration: gameDataStore.trackDuration * 1000, iterations: 1, immediate: false },
)

const guessLevel = computed(() => {
  const trackGuess = selectedTrack.value.guess ?? ''
  const userGuess = guess.value

  if (trackGuess === userGuess)
    return 'full'
  else if (
    trackGuess.split(' - ')?.[1] === userGuess.split(' - ')?.[1] // compare if the same artist
  )
    return 'author'
  else
    return 'none'
})
const isFullyGuessed = computed(() => guessLevel.value === 'full')

const pointsForRound = computedWithControl(isRoundFinished, () => {
  const seconds = getTrackPlayDuration()

  let points
  if (seconds === 0)
    points = 295
  else if (seconds < 3)
    points = Math.floor(-15 * seconds ** 2 + 295)
  else
    points = Math.floor(100 / (seconds - 2) ** 1.1 + 60)

  switch (guessLevel.value) {
    case 'full':
      return points
    case 'author':
      return Math.floor(points / 5)
    case 'none':
      return 0
  }
})

onBeforeMount(() => {
  gameResultStore.$reset()
  if (!gameDataStore.selectedTracks || gameDataStore.selectedTracks.length === 0)
    router.push({ name: 'setup' })
})

function getTrackPlayDuration() {
  const trackPlayDuration = cssNumberishToInt(trackTimer.currentTime.value) / 1000
  return trackPlayDuration + trackPlayRepeats.value * gameDataStore.trackDuration
}

function restartTrackTimer() {
  trackPlayRepeats.value++
  isPlaying.value = false
}

function finishRound() {
  roundTimer.pause()
  isRoundFinished.value = true
  isPlaying.value = false
}

function advanceRound() {
  gameResultStore.addPlayedTrack(selectedTrack.value, guess.value, isFullyGuessed.value, getTrackPlayDuration())
  points.value += pointsForRound.value

  if (round.value === gameDataStore.roundCount) {
    finishGame()
    return
  }

  round.value++
  selectedTrack.value = gameDataStore.getTrackForRound(round.value)

  trackPlayRepeats.value = 0
  guess.value = ''
  isPlaying.value = false
  trackTimer.currentTime.value = 0
  roundTimeLeft.value = gameDataStore.roundDuration
}

function finishGame() {
  gameResultStore.finishGame(points.value)

  router.push({ name: 'result', params: route.params })
}

function handlePlayingStart() {
  roundTimer.resume()
}

function handlePlayingChange(newValue: boolean) {
  isPlaying.value = newValue
}

function handleGuessKeyDown(e: KeyboardEvent) {
  if (guess.value === '' && e.key === ' ') {
    e.preventDefault()
    isPlaying.value = !isPlaying.value
  }
}

function handleGuessSubmit(e: Event) {
  const submittionType = ((e as SubmitEvent).submitter as HTMLButtonElement).value
  e.preventDefault()

  if (guess.value === '' && submittionType === 'submit') {
    isPlaying.value = !isPlaying.value
    return
  }

  finishRound()
}

function quitGame() {
  finishRound()
  finishGame()
}

onMounted(() => {
  playButton.value = document.getElementById('playbackButton')! as HTMLButtonElement
  searchInput.value = document.getElementById('searchInput')! as HTMLInputElement
})

watchOnce(() => trackTimer.animate.value, (value) => {
  if (value)
    value.onfinish = restartTrackTimer
})

watch(isPlaying, (newValue) => {
  if (newValue)
    trackTimer.play()
  else
    trackTimer.pause()
})

watch(isRoundFinished, async (newValue) => {
  if (!newValue) {
    advanceRound()

    await nextTick()
    searchInput.value?.focus()
  }
})
</script>

<template>
  <div class="mb-32 grid grid-cols-2 place-items-center gap-x-40 gap-y-10">
    <span class=" justify-self-start text-xl">Round: {{ round }}</span>

    <div class=" flex items-center gap-6 justify-self-end">
      <CircularTimer :x="roundTimeLeft" :x-max="gameDataStore.roundDuration" />
      <Button @click="quitGame">
        Quit<ArrowRight class="ml-1 size-4" />
      </Button>
    </div>
    <PlaybackControls
      class="col-span-2 mt-20"
      :is-playing
      :selected-track
      :track-play-repeats
      @play-change="handlePlayingChange"
      @play-start="handlePlayingStart"
    />
    <form class="col-span-2 grid grid-cols-2 place-items-center gap-y-4" @keydown="handleGuessKeyDown" @submit="handleGuessSubmit">
      <SearchInput v-model="guess" :tracks="gameDataStore.tracks" class=" col-span-2" />
      <Button type="submit" value="submit">
        Submit
      </Button>
      <Button type="submit" value="skip" variant="destructive" class="col-start-1 row-start-2">
        Skip
      </Button>
    </form>
  </div>
  <FinishedRoundDialog
    v-model="isRoundFinished"
    :selected-track
    :guess
    :is-fully-guessed
    :points
    :points-for-round
  />
</template>
