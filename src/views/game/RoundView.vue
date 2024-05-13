<script setup lang="ts">
import { useRouter } from 'vue-router'
import { nextTick, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAnimate, useIntervalFn, watchOnce } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'
import SearchInput from '@/components/round/SearchInput.vue'
import CircularTimer from '@/components/round/CircularTimer.vue'
import PlaybackControls from '@/components/round/PlaybackControls.vue'

const router = useRouter()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()
const resultStore = useResultStore()

const guess = ref('')

const isPlaying = ref(false)
const isGuessSubmitted = ref(false)

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
    if (message.$type === 'message/roundFinishedDto') {
      resultStore.round = message.data
      router.push({ name: 'roundResult', params: router.currentRoute.value.params })
    }

    else if (message.$type === 'message/endGameResultsDto') {
      resultStore.game = message.data
      router.push({ name: 'result', params: router.currentRoute.value.params })
    }
  }
})

function handleTrackTimerFinish() {
  isPlaying.value = !isPlaying.value
}

async function handleGuessSubmit(e: Event) {
  const submittionType = ((e as SubmitEvent).submitter as HTMLButtonElement).value
  e.preventDefault()

  connectionStore.sendMessage({
    $type: 'message/string',
    type: 'guess',
    data: submittionType === 'submit' ? guess.value : '',
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

watch(isPlaying, (isPlaying) => {
  trackTimer.reverse()

  if (isPlaying)
    trackTimer.playbackRate.value = -(gameDataStore.gameSettings.breakDurationBetweenTrackPlays / gameDataStore.gameSettings.trackDuration)

  else
    trackTimer.playbackRate.value = 1
})
</script>

<template>
  <div v-if="!isGuessSubmitted" class="mb-32 grid grid-cols-2 place-items-center gap-x-40 gap-y-10">
    <span class=" justify-self-start text-xl">Round: {{ gameDataStore.round }}</span>

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
</template>
