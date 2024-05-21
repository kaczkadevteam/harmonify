<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'
import PlayerResults from '@/components/roundResult/PlayerResults.vue'
import LoadingIndicator from '@/components/roundResult/LoadingIndicator.vue'

const router = useRouter()
const gameDataStore = useGameDataStore()
const resultStore = useResultStore()
const connectionStore = useConnectionStore()

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
const roundFinishedTitle = computed(() => isFullyGuessed.value ? 'Correct :)' : 'Incorrect :(')
</script>

<template>
  <LoadingIndicator />
  <div class=" grid grid-cols-2 place-content-center gap-10">
    <div class=" justify-self-center">
      <PlayerResults :points-bar-max-width="320" />
    </div>
    <div class=" justify-self-center">
      <div class="w-96">
        <div>
          <div :class="cn('text-xl', isFullyGuessed ? 'text-green-600' : 'text-red-600')">
            {{ roundFinishedTitle }}
          </div>
        </div>
        <div class="mb-2 grid justify-items-center gap-1 text-center">
          <img :src="track.album.images[0].url" alt="Album cover" width="200" height="200">
          <TrackDisplay :track="track" />
          <div v-if="!isFullyGuessed" class="mt-4">
            <span class="mr-3">Your guess:</span>
            <GuessDisplay :guess="selfPlayerRoundResult.guess" />
          </div>
        </div>
        <div class="flex items-center sm:justify-between">
          <div class="text-lg">
            <span>Points </span>
            <span>{{ `${resultStore.roundSelfPlayer.score - selfPlayerRoundResult.score} + ${selfPlayerRoundResult.score}` }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
