<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useResultStore } from '@/stores'
import type { PlayedTrack as TPlayedTrack } from '@/types'
import { AnimationDuration, Breakpoint } from '@/consts'
import DesktopResultView from '@/components/result/DesktopResultView.vue'
import MobileResultView from '@/components/result/MobileResultView.vue'

const resultStore = useResultStore()

const router = useRouter()
const displayTracks = ref(false)
const displayButton = ref(false)
const selectedPlayerGuid = ref(resultStore.gameSelfPlayer.guid)
const resultsAnimationPending = ref(true)
const { width: screenWidth } = useWindowSize()
const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)
const selectablePlayers = computed(() => {
  return resultStore.game.players.map(p => ({ guid: p.guid, nickname: p.nickname }))
})

function handlePlayAgain() {
  router.push({ name: 'home' })
}

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
    :played-tracks
    :score="resultStore.gameSelfPlayer.score"
    :is-desktop
    :display-tracks
    :display-button
    :results-animation-pending
    @animation-finished="handleResultsAnimationFinish"
    @play-again="handlePlayAgain"
  />
  <MobileResultView
    v-else
    v-model="selectedPlayerGuid"
    :selectable-players
    :played-tracks
    :score="resultStore.gameSelfPlayer.score"
    :is-desktop
    :display-tracks
    :display-button
    @animation-finished="handleResultsAnimationFinish"
    @play-again="handlePlayAgain"
  />
</template>
