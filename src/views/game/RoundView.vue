<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useGameResultStore } from '@/stores/gameResult'
import { useGameDataStore } from '@/stores/gameData'
import SearchInput from '@/components/round/SearchInput.vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import CircularTimer from '@/components/round/CircularTimer.vue'
import PlaybackControls from '@/components/round/PlaybackControls.vue'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import { useSimpleTimer } from '@/composables/useSimpleTimer'

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

const roundCounter = ref(gameDataStore.roundDuration)
const roundTimer = useIntervalFn(() => {
  roundCounter.value--
  if (roundCounter.value <= 0)
    finishRound()
}, 1000, { immediate: false })
const trackTimer = useSimpleTimer(gameDataStore.trackDuration, restartTrackTimer)

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

onBeforeMount(() => {
  if (!gameDataStore.selectedTracks || gameDataStore.selectedTracks.length === 0)
    router.push({ name: 'setup' })
})

function getTrackPlayDuration() {
  const trackPlayDuration = trackTimer.getTime()
  return trackPlayDuration + trackPlayRepeats.value * gameDataStore.trackDuration
}

function getPointsForRound() {
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
}

function advanceRound() {
  gameResultStore.addPlayedTrack(selectedTrack.value, guess.value, isFullyGuessed.value, getTrackPlayDuration())
  points.value += getPointsForRound()

  if (round.value === gameDataStore.roundCount) {
    finishGame()
    return
  }

  round.value++
  selectedTrack.value = gameDataStore.getTrackForRound(round.value)

  trackPlayRepeats.value = 0
  guess.value = ''
  isPlaying.value = false
}

function finishRound() {
  isRoundFinished.value = true
  roundCounter.value = gameDataStore.roundDuration
  roundTimer.pause()
  isPlaying.value = false
}

function finishGame() {
  gameResultStore.finishGame(points.value)

  router.push({ name: 'result', params: route.params })
}

function restartTrackTimer() {
  trackPlayRepeats.value++
  isPlaying.value = false
}

function onPlayingStart() {
  roundTimer.resume()
}

function onPlayingChange(newValue: boolean) {
  isPlaying.value = newValue
}

function onGuessKeyDown(e: KeyboardEvent) {
  if (guess.value === '' && e.key === ' ') {
    e.preventDefault()
    isPlaying.value = !isPlaying.value
  }
}

function onGuessSubmit(e: Event) {
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

watch(isRoundFinished, (newValue) => {
  if (!newValue)
    advanceRound()
})

const roundFinishedTitle = computed(() => isFullyGuessed.value ? 'Correct :)' : 'Incorrect :(')
</script>

<template>
  <span>Round: {{ round }}</span>

  <div>
    <CircularTimer :x="roundCounter" :x-max="gameDataStore.roundDuration" />
    <Button @click="quitGame">
      End <ArrowRight />
    </Button>
  </div>
  <PlaybackControls :is-playing :selected-track :track-play-repeats @play-change="onPlayingChange" @play-start="onPlayingStart" />
  <form @keydown="onGuessKeyDown" @submit="onGuessSubmit">
    <SearchInput v-model="guess" :tracks="gameDataStore.tracks" />
    <Button type="submit" value="submit">
      Submit
    </Button>
    <Button type="submit" value="skip">
      Skip
    </Button>
  </form>
  <Dialog v-model:open="isRoundFinished">
    <DialogContent v-if="isRoundFinished">
      <DialogHeader>
        <DialogTitle :class="cn(isFullyGuessed ? 'text-green-600' : 'text-red-600')">
          {{ roundFinishedTitle }}
        </DialogTitle>
      </DialogHeader>
      <div>
        <img :src="selectedTrack.album.images[0].url" alt="Album cover" width="200" height="200">
        <TrackDisplay :track="selectedTrack" />
        <span v-if="!isFullyGuessed">
          <span>Your guess: </span>
          <GuessDisplay :guess="guess" />

        </span>
        <span>
          <span>Points </span>
          <span>{{ `${points} + ${getPointsForRound()}` }}</span>
        </span>
      </div>
      <DialogFooter>
        <Button autofocus @click="isRoundFinished = false">
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
