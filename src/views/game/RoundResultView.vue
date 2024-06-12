<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'
import PlayerResults from '@/components/roundResult/PlayerResults.vue'
import LoadingIndicator from '@/components/roundResult/LoadingIndicator.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Breakpoint } from '@/consts'
import PauseBackdrop from '@/components/roundResult/PauseBackdrop.vue'

const router = useRouter()
const gameDataStore = useGameDataStore()
const resultStore = useResultStore()
const connectionStore = useConnectionStore()
const { width: screenWidth } = useWindowSize()

onBeforeMount(() => {
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/roundStartedDto') {
      gameDataStore.musicPlayData = {
        uri: message.data.preview_url,
        trackStart_ms: message.data.trackStart_ms,
      }
      gameDataStore.round = message.data.roundNumber
      router.push({ name: 'round', params: router.currentRoute.value.params })
    }
  }
})

const track = computed(() => resultStore.round.track)
const selfPlayerRoundResult = computed(() => resultStore.roundSelfPlayer.roundResults.at(-1)!)
const isFullyGuessed = computed(() => selfPlayerRoundResult.value.guess === resultStore.round.track.guess)
const pointsBarMaxWidth = computed(() => screenWidth.value >= Breakpoint.LG ? 320 : 220)
</script>

<template>
  <div class="relative grid place-content-stretch">
    <LoadingIndicator v-if="!gameDataStore.isPaused" />
    <PauseBackdrop v-else />
    <div class="grid max-h-screen grid-rows-[auto_350px] place-content-center gap-4 overflow-y-auto py-8 md:grid-cols-[minmax(auto,420px)_minmax(0,auto)] md:grid-rows-1 md:gap-10 md:self-center md:justify-self-center">
      <ScrollArea>
        <div class="max-w-80 justify-self-center md:max-h-[calc(100vh_-_100px)] md:max-w-none">
          <PlayerResults :points-bar-max-width />
        </div>
      </ScrollArea>

      <div class="justify-self-center md:self-center">
        <div class="w-80 lg:w-96">
          <div class="mb-2 grid justify-items-center gap-1 text-center">
            <img :src="track.album.images[0].url" alt="Album cover" width="200" height="200">
            <TrackDisplay :track="track" />
            <div v-if="!isFullyGuessed" class="mt-4">
              <span class="mr-3 text-sm md:text-base">Your guess:</span>
              <GuessDisplay :guess="selfPlayerRoundResult.guess" />
            </div>
          </div>
          <div class="flex items-center sm:justify-between">
            <div class="md:text-lg">
              <span>Points </span>
              <span>{{ `${resultStore.roundSelfPlayer.score - selfPlayerRoundResult.score} + ${selfPlayerRoundResult.score}` }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
