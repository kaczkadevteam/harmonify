<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GameResults from '@/components/result/GameResults.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import PlayedTrack from '@/components/result/PlayedTrack.vue'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { PlayedTrack as TPlayedTrack } from '@/types'

defineProps<{
  selectablePlayers: {
    guid: string
    nickname: string
  }[]
  playedTracks: TPlayedTrack[]
  score: number
  isDesktop: boolean
  isPlayAgainEnabled: boolean
  displayTracks: boolean
  displayButton: boolean
}>()

const emit = defineEmits<{
  animationFinished: []
  playAgain: []
  quitGame: []
}>()

const selectedPlayer = defineModel<string>()
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
        <div class="row-span-2 grid h-full grid-rows-[minmax(0,auto)_minmax(0,1fr)] gap-2">
          <div class="flex items-center gap-2">
            <Label for="player">Player</Label>
            <Select v-model:model-value="selectedPlayer">
              <SelectTrigger id="player">
                <SelectValue placeholder="Select autoplay behaviour" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="player of selectablePlayers"
                    :key="player.guid"
                    :value="player.guid"
                  >
                    {{ player.nickname }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea v-if="displayTracks" class="h-full rounded-lg border">
            <div class="w-[320px] space-y-4 divide-y py-4 ">
              <PlayedTrack
                v-for="playedTrack, idx of playedTracks"
                :key="`${playedTrack.track.uri}-${idx}`"
                :played-track="playedTrack"
              />
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
    </Tabs>
    <div class="h-14">
      <Transition name="fade-bottom">
        <div v-if="displayButton" class="mt-4 flex items-center justify-center gap-5">
          <div class="text-2xl">
            <span>Score: </span>
            <span>{{ score }}</span>
          </div>
          <Button v-if="isPlayAgainEnabled" class="text-base" size="default" @click="emit('playAgain')">
            Play again?
          </Button>
          <Button v-else class="text-base" size="default" @click="emit('quitGame')">
            Quit
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
