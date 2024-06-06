<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
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

const isGuessSubmitted = ref(false)

const roundTimeLeft = ref(gameDataStore.gameSettings.roundDuration)
const roundTimer = useIntervalFn(() => {
  roundTimeLeft.value--
  if (roundTimeLeft.value <= 0)
    roundTimer.pause()
}, 1000, { immediate: true })

const searchInput = ref<HTMLInputElement | null>(null)

onBeforeMount(() => {
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/roundFinishedDto') {
      resultStore.setRoundResult(message.data)
      router.push({ name: 'roundResult', params: router.currentRoute.value.params })
    }

    else if (message.$type === 'message/endGameResultsDto') {
      resultStore.setGameResult(message.data)
      router.push({ name: 'result', params: router.currentRoute.value.params })
    }
  }
})

async function handleGuessSubmit(e: Event) {
  const submittionType = ((e as SubmitEvent).submitter as HTMLButtonElement).value

  connectionStore.sendMessage({
    $type: 'message/string',
    type: 'guess',
    data: submittionType === 'submit' ? guess.value : '',
  })

  isGuessSubmitted.value = true
}

onMounted(() => {
  searchInput.value = document.getElementById('searchInput')! as HTMLInputElement
})
</script>

<template>
  <div v-if="!isGuessSubmitted" class="grid grid-cols-2 place-content-center place-items-center gap-x-40 gap-y-10 self-start p-4 md:mb-60 md:self-center md:justify-self-center md:p-0">
    <span class=" justify-self-start text-xl">Round: {{ gameDataStore.round }}</span>

    <div class=" flex items-center gap-6 justify-self-end">
      <CircularTimer :x="roundTimeLeft" :x-max="gameDataStore.gameSettings.roundDuration" />
    </div>
    <PlaybackControls
      class="col-span-2 mt-20"
      :music-play-data="gameDataStore.musicPlayData"
    />
    <form class="col-span-2 grid grid-cols-2 place-items-center gap-y-4" @submit.prevent="handleGuessSubmit">
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
