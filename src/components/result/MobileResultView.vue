<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GameResults from '@/components/result/GameResults.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import PlayedTrack from '@/components/result/PlayedTrack.vue'
import { Button } from '@/components/ui/button'
import type { PlayedTrack as TPlayedTrack } from '@/types'

defineProps<{
  playedTracks: TPlayedTrack[]
  score: number
  isDesktop: boolean
  displayTracks: boolean
  displayButton: boolean
}>()

const emit = defineEmits<{
  animationFinished: []
  playAgain: []
}>()
</script>

<template>
  <div class="grid place-content-center">
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

      <TabsContent value="leaderboard" class="h-[60vh] max-h-[60vh] border" force-mount>
        <GameResults
          :is-desktop
          animate
          @animation-finished="emit('animationFinished')"
        />
      </TabsContent>
      <TabsContent value="tracks" class="h-[60vh] max-h-[60vh]">
        <ScrollArea v-if="displayTracks" class="row-span-2 h-full rounded-lg border lg:w-full">
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
            <span>{{ score }}</span>
          </div>
          <Button class="text-base" size="default" @click="emit('playAgain')">
            Play again?
          </Button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
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
</style>
