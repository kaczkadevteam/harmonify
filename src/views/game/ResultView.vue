<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useResultStore } from '@/stores'
import type { PlayedTrack as TPlayedTrack } from '@/types'
import { AnimationDuration, Breakpoint } from '@/consts'
import DesktopResultView from '@/components/result/DesktopResultView.vue'
import MobileResultView from '@/components/result/MobileResultView.vue'

const resultStore = useResultStore()

const router = useRouter()
const windowDimensions = useWindowSize()
const resultView = ref<InstanceType<typeof DesktopResultView> | null>(null)
const startingTransform = ref('')
const displayTracks = ref(false)
const displayButton = ref(false)
const resultsAnimationPending = ref(true)
const { width: screenWidth } = useWindowSize()
const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)

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
    .gameSelfPlayer
    .roundResults
    .map((roundResult, i) => {
      const track = resultStore.game.tracks[i]
      return {
        track,
        userGuess: roundResult.guess,
        guessLevel: roundResult.guessLevel,
        score: roundResult.score,
      }
    })
})

onMounted(() => {
  const gameResultsDimensions = resultView.value!.gameResultsDimensions

  const windowMiddleX = windowDimensions.width.value / 2
  const windowMiddleY = windowDimensions.height.value / 2

  const elementMiddleX = gameResultsDimensions.x.value + (gameResultsDimensions.width.value / 2)
  const elementMiddleY = gameResultsDimensions.y.value + (gameResultsDimensions.height.value / 2)

  const deltaX = windowMiddleX - elementMiddleX
  const deltaY = windowMiddleY - elementMiddleY

  startingTransform.value = `translate( ${deltaX}px, ${deltaY}px)`
})
</script>

<template>
  <DesktopResultView
    v-if="isDesktop"
    ref="resultView"
    :played-tracks
    :score="resultStore.gameSelfPlayer.score"
    :is-desktop
    :display-tracks
    :display-button
    :results-animation-pending
    :starting-transform
    @animation-finished="handleResultsAnimationFinish"
    @play-again="handlePlayAgain"
  />
  <MobileResultView
    v-else
    :played-tracks
    :score="resultStore.gameSelfPlayer.score"
    :is-desktop
    :display-tracks
    :display-button
    @animation-finished="handleResultsAnimationFinish"
    @play-again="handlePlayAgain"
  />
</template>
