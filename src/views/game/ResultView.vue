<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useWindowSize, whenever } from '@vueuse/core'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'
import type { PlayedTrack as TPlayedTrack } from '@/types'
import { AnimationDuration, Breakpoint } from '@/consts'
import DesktopResultView from '@/components/result/DesktopResultView.vue'
import MobileResultView from '@/components/result/MobileResultView.vue'

const resultStore = useResultStore()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()

const router = useRouter()
const displayTracks = ref(false)
const displayButton = ref(false)
const selectedPlayerGuid = ref(resultStore.gameSelfPlayer.guid)
const resultsAnimationPending = ref(true)
const { width: screenWidth } = useWindowSize()
const isPlayAgainEnabled = computed(() => !!connectionStore.ws)
const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)
const selectablePlayers = computed(() => {
  return resultStore.game.players.map(p => ({ guid: p.guid, nickname: gameDataStore.selfPlayer.guid === p.guid ? 'You' : p.nickname }))
})

function handlePlayAgain() {
  connectionStore.sendMessage({
    $type: 'message',
    type: 'playAgain',
  })
}

function handleQuitGame() {
  if (connectionStore.ws)
    connectionStore.sendMessage({ $type: 'message', type: 'quitGame' })

  router.push({ name: 'home' })
}

whenever(() => gameDataStore.selfPlayer.connected, () => {
  router.push({ name: 'setup', params: router.currentRoute.value.params })
})

function handleResultsAnimationFinish() {
  setTimeout(() => {
    displayTracks.value = true
  }, isDesktop.value ? AnimationDuration.D1500 : AnimationDuration.D200)

  setTimeout(() => {
    displayButton.value = true
  }, isDesktop.value ? AnimationDuration.D2000 : AnimationDuration.D800)

  resultsAnimationPending.value = false
}

const playedTracks = computed<TPlayedTrack[]>(() => {
  return resultStore
    .game
    .players
    .find(p => p.guid === selectedPlayerGuid.value)
    ?.roundResults
    .map((roundResult, i) => {
      const track = resultStore.game.tracks[i]
      return {
        track,
        userGuess: roundResult.guess,
        guessLevel: roundResult.guessLevel,
        score: roundResult.score,
      }
    }) ?? []
})
</script>

<template>
  <DesktopResultView
    v-if="isDesktop"
    v-model="selectedPlayerGuid"
    :selectable-players
    :played-tracks
    :score="resultStore.gameSelfPlayer.score"
    :is-desktop
    :is-play-again-enabled
    :display-tracks
    :display-button
    :results-animation-pending
    @animation-finished="handleResultsAnimationFinish"
    @play-again="handlePlayAgain"
    @quit-game="handleQuitGame"
  />
  <MobileResultView
    v-else
    v-model="selectedPlayerGuid"
    :selectable-players
    :played-tracks
    :score="resultStore.gameSelfPlayer.score"
    :is-desktop
    :is-play-again-enabled
    :display-tracks
    :display-button
    @animation-finished="handleResultsAnimationFinish"
    @play-again="handlePlayAgain"
    @quit-game="handleQuitGame"
  />
</template>
