<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'

const router = useRouter()
const gameDataStore = useGameDataStore()
const resultStore = useResultStore()
const connectionStore = useConnectionStore()

onBeforeMount(() => {
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/roundStartedDto') {
      gameDataStore.musicPlayData = {
        uri: message.data.uri,
        trackStart_ms: message.data.trackStart_ms,
      }
      gameDataStore.round = message.data.roundNumber
      router.push({ name: 'round', params: router.currentRoute.value.params })
    }
  }
})

const roundResult = computed(() => resultStore.round)
const isFullyGuessed = computed(() => resultStore.round.roundResult.guess === resultStore.round.track.guess)
const roundFinishedTitle = computed(() => isFullyGuessed.value ? 'Correct :)' : 'Incorrect :(')
</script>

<template>
  <div>
    <div>
      <div>
        <div :class="cn('text-xl', isFullyGuessed ? 'text-green-600' : 'text-red-600')">
          {{ roundFinishedTitle }}
        </div>
      </div>
      <div class="mb-2 grid justify-items-center gap-1 text-center">
        <img :src="roundResult.track.album.images[0].url" alt="Album cover" width="200" height="200">
        <TrackDisplay :track="roundResult.track" />
        <div v-if="!isFullyGuessed" class="mt-4">
          <span class="mr-3">Your guess:</span>
          <GuessDisplay :guess="roundResult.roundResult.guess" />
        </div>
      </div>
      <div class="flex items-center sm:justify-between">
        <div class="text-lg">
          <span>Points </span>
          <span>{{ `${roundResult.score - roundResult.roundResult.score} + ${roundResult.roundResult.score}` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
