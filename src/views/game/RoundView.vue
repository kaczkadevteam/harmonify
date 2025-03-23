<script setup lang="ts">
import AudioVisualizer from '@/components/AudioVisualizer.vue'
import CircularTimer from '@/components/round/CircularTimer.vue'
import PlaybackControls from '@/components/round/PlaybackControls.vue'
import SearchInput from '@/components/round/SearchInput.vue'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'
import { useIntervalFn } from '@vueuse/core'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()
const resultStore = useResultStore()
const { toast } = useToast()

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

watch(() => gameDataStore.isPaused, (isPaused, wasPaused) => {
  if (isPaused)
    toast({ description: 'Game will be paused after this round' })
  else if (wasPaused)
    toast({ description: 'Game pause was cancelled' })
}, { immediate: true })

onMounted(() => {
  searchInput.value = document.getElementById('searchInput')! as HTMLInputElement
})
</script>

<template>
  <div class="grid grid-rows-[auto_15vh]">
    <div class="grid grid-cols-2 place-content-center place-items-center gap-x-40 gap-y-10 self-start p-4 md:mb-60 md:mt-4 md:place-self-center md:p-0">
      <span class=" justify-self-start text-xl">Round: {{ gameDataStore.round }}</span>

      <div class=" flex items-center gap-6 justify-self-end">
        <CircularTimer :x="roundTimeLeft" :x-max="gameDataStore.gameSettings.roundDuration" />
      </div>
      <template v-if="!isGuessSubmitted">
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
      </template>
      <div v-else class="col-span-2 mt-40">
        <span>Waiting for other players to submit guesses</span>
      </div>
    </div>
    <AudioVisualizer />
  </div>
</template>
