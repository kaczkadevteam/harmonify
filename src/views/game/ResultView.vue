<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useElementBounding, useWindowSize } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useResultStore } from '@/stores'
import PlayedTrack from '@/components/result/PlayedTrack.vue'
import type { PlayedTrack as TPlayedTrack } from '@/types'
import GameResults from '@/components/result/GameResults.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const resultStore = useResultStore()

const router = useRouter()
const gameResultsEl = ref<HTMLDivElement | null>(null)
const windowDimensions = useWindowSize()
const gameResultsDimensions = useElementBounding(gameResultsEl)
const startingTransform = ref('')
const displayTracks = ref(false)
const displayButton = ref(false)
const { width: screenWidth } = useWindowSize()

function handlePlayAgain() {
  router.push({ name: 'home' })
}

function handleResultsAnimationFinish() {
  setTimeout(() => {
    displayTracks.value = true
  }, 200)

  setTimeout(() => {
    displayButton.value = true
  }, 800)
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
  const windowMiddleX = windowDimensions.width.value / 2
  const windowMiddleY = windowDimensions.height.value / 2

  const elementMiddleX = gameResultsDimensions.x.value + (gameResultsDimensions.width.value / 2)
  const elementMiddleY = gameResultsDimensions.y.value + (gameResultsDimensions.height.value / 2)

  const deltaX = windowMiddleX - elementMiddleX
  const deltaY = windowMiddleY - elementMiddleY

  startingTransform.value = `translate( ${deltaX}px, ${deltaY}px)`
})

const isMobileSize = computed(() => screenWidth.value < 1024)
</script>

<template>
  <template v-if="isMobileSize">
    <Tabs default-value="leaderboard">
      <div class="h-10">
        <Transition name="fade-top">
          <TabsList v-if="displayTracks" class="w-full">
            <TabsTrigger value="leaderboard" class="flex-1">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="tracks" class="flex-1">
              Tracks
            </TabsTrigger>
          </TabsList>
        </Transition>
      </div>

      <TabsContent value="leaderboard" class="h-[60vh] border py-2" force-mount>
        <GameResults :points-bar-max-width="20" :is-mobile-size @animation-finished="handleResultsAnimationFinish" />
      </TabsContent>
      <TabsContent value="tracks" class="h-[60vh]">
        <ScrollArea v-if="displayTracks" class="row-span-2 h-4/5 rounded-lg border lg:w-full">
          <div class="w-[320px] space-y-4 divide-y py-4 ">
            <PlayedTrack
              v-for="playedTrack, idx of playedTracks"
              :key="`${playedTrack.track.uri}-${idx}`"
              :played-track="playedTrack"
            />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
    <div class="h-14">
      <Transition name="fade-bottom">
        <div v-if="displayButton" class="mt-4 flex items-center justify-center gap-5">
          <div class="text-2xl">
            <span>Score: </span>
            <span>{{ resultStore.gameSelfPlayer.score }}</span>
          </div>
          <Button class="text-base" size="default" @click="handlePlayAgain">
            Play again?
          </Button>
        </div>
      </Transition>
    </div>
  </template>

  <div v-else class="grid h-screen grid-cols-[650px_auto] grid-rows-2 place-items-center gap-5">
    <Transition name="fade-left">
      <ScrollArea v-if="displayTracks" class="row-span-2 h-4/5 w-full rounded-lg border p-4">
        <div class="space-y-4">
          <PlayedTrack
            v-for="playedTrack, idx of playedTracks"
            :key="`${playedTrack.track.uri}-${idx}`"
            :played-track="playedTrack"
          />
        </div>
      </ScrollArea>
    </Transition>
    <div ref="gameResultsEl" class="game-results col-start-2">
      <GameResults :points-bar-max-width="20" :is-mobile-size @animation-finished="handleResultsAnimationFinish" />
    </div>

    <Transition name="fade-bottom">
      <div v-if="displayButton" class="grid place-items-center gap-5">
        <div class="text-4xl">
          <span>Score: </span>
          <span>{{ resultStore.gameSelfPlayer.score }}</span>
        </div>
        <Button class="text-xl" size="lg" @click="handlePlayAgain">
          Play again?
        </Button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game-results {
  transform: v-bind(startingTransform);
  animation: comeback 2s ease-in-out 5000ms;
  animation-fill-mode: forwards;
}

.fade-left-leave-active,
.fade-left-enter-active,
.fade-top-leave-active,
.fade-top-enter-active,
.fade-bottom-leave-active,
.fade-bottom-enter-active {
  transition: all 1s ease-out;
}

.fade-top-enter-from,
.fade-top-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-bottom-enter-from,
.fade-bottom-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

.fade-left-enter-from,
.fade-left-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

@keyframes comeback {
  to {
    transform: translate(0, 0);
  }
}
</style>
