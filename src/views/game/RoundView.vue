<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue'
import { computedWithControl, useAnimate, useIntervalFn, watchOnce } from '@vueuse/core'
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useConnectionStore, useGameDataStore } from '@/stores'
import SearchInput from '@/components/round/SearchInput.vue'
import { cssNumberishToInt } from '@/lib/utils'
import CircularTimer from '@/components/round/CircularTimer.vue'
import PlaybackControls from '@/components/round/PlaybackControls.vue'
import FinishedRoundDialog from '@/components/round/FinishedRoundDialog.vue'
import type { RoundFinishedDto, RoundStartedDto } from '@/types'

// const router = useRouter()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()

const guess = ref('')
const round = ref(1)

const isPlaying = ref(false)
const isGuessSubmitted = ref(false)
const isRoundFinished = ref(false)
const lastRoundResults = ref<RoundFinishedDto | undefined>()

const roundTimeLeft = ref(gameDataStore.gameSettings.roundDuration)
const roundTimer = useIntervalFn(() => {
  roundTimeLeft.value--
  if (roundTimeLeft.value <= 0)
    roundTimer.pause()
}, 1000, { immediate: true })

const searchInput = ref<HTMLInputElement | null>(null)
const playButton = ref<HTMLButtonElement | null>(null)
const trackTimer = useAnimate(
  playButton,
  [{ backgroundPositionX: '100%' }, { backgroundPositionX: '0%' }],
  { duration: gameDataStore.gameSettings.breakDurationBetweenTrackPlays * 1000, iterations: 1, immediate: true, direction: 'reverse' },
)

onBeforeMount(() => {
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/roundFinishedDto')
      finishRound(message.data)

    else if (message.$type === 'message/roundStartedDto')
      startRound(message.data)
  }
})

function handleTrackTimerFinish() {
  if (isRoundFinished.value)
    return

  isPlaying.value = !isPlaying.value
}

function finishRound(data: RoundFinishedDto) {
  roundTimer.pause()
  roundTimeLeft.value = 0
  lastRoundResults.value = data

  isRoundFinished.value = true
  isPlaying.value = false

  guess.value = ''
  trackTimer.currentTime.value = 0
}

function startRound(data: RoundStartedDto) {
  gameDataStore.musicPlayData = {
    uri: data.uri,
    trackStart_ms: data.trackStart_ms,
  }
  round.value = data.roundNumber

  isRoundFinished.value = false
  roundTimeLeft.value = gameDataStore.gameSettings.roundDuration

  trackTimer.currentTime.value = 0
  roundTimer.resume()
}

// TODO: Add end game message
/*
function finishGame() {
  router.push({ name: 'result', params: route.params })
}
*/
function handleGuessSubmit(e: Event) {
  const submittionType = ((e as SubmitEvent).submitter as HTMLButtonElement).value
  e.preventDefault()

  if (guess.value === '' && submittionType === 'submit') {
    isPlaying.value = !isPlaying.value
    return
  }

  connectionStore.sendMessage({
    $type: 'message/string',
    type: 'guess',
    data: guess.value,
  })
  isGuessSubmitted.value = true
}

onMounted(() => {
  playButton.value = document.getElementById('playbackButton')! as HTMLButtonElement
  searchInput.value = document.getElementById('searchInput')! as HTMLInputElement
})

watchOnce(() => trackTimer.animate.value, (value) => {
  if (value)
    value.onfinish = handleTrackTimerFinish
})

watch(isRoundFinished, async (newValue) => {
  if (!newValue) {
    await nextTick()
    searchInput.value?.focus()
  }
})

watch(isPlaying, (isPlaying) => {
  trackTimer.reverse()

  if (isPlaying)
    trackTimer.playbackRate.value = -(gameDataStore.gameSettings.breakDurationBetweenTrackPlays / gameDataStore.gameSettings.roundDuration)

  else
    trackTimer.playbackRate.value = 1
})
</script>

<template>
  <div v-if="!isGuessSubmitted" class="mb-32 grid grid-cols-2 place-items-center gap-x-40 gap-y-10">
    <span class=" justify-self-start text-xl">Round: {{ round }}</span>

    <div class=" flex items-center gap-6 justify-self-end">
      <CircularTimer :x="roundTimeLeft" :x-max="gameDataStore.gameSettings.roundDuration" />
    </div>
    <PlaybackControls
      class="col-span-2 mt-20"
      :is-playing
      :music-play-data="gameDataStore.musicPlayData"
    />
    <form class="col-span-2 grid grid-cols-2 place-items-center gap-y-4" @submit="handleGuessSubmit">
      <SearchInput v-model="guess" :guesses="gameDataStore.possibleGuesses" class=" col-span-2" />
      <Button type="submit" value="submit">
        Submit
      </Button>
      <Button type="submit" value="skip" variant="destructive" class="col-start-1 row-start-2">
        Skip
      </Button>
    </form>
  </div>
  <div v-else>
    Waiting for other players to submit guesses
  </div>
  <FinishedRoundDialog
    v-model="isRoundFinished"
    :guess
    :round-result="lastRoundResults!"
  />
</template>
