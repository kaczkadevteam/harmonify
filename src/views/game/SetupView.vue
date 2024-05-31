<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useClipboard, useWindowSize } from '@vueuse/core'
import { Copy, Users } from 'lucide-vue-next'
import HostView from '@/components/setup/HostView.vue'
import { useConnectionStore, useGameDataStore } from '@/stores'
import LoadingCircle from '@/components/LoadingCircle.vue'
import Player from '@/components/Player.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const router = useRouter()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()
const { width: screenWidth } = useWindowSize()
const { copy } = useClipboard()
const { toast } = useToast()

onBeforeMount(() => {
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/gameStartedDto') {
      gameDataStore.startGame(message.data)
      router.push({ name: 'round', params: router.currentRoute.value.params })
    }
  }
})

function copyId() {
  copy(router.currentRoute.value.params.id.toString())
  toast({ description: 'Room ID copied to clipboard!' })
}

const isMobileSize = computed(() => screenWidth.value < 1024)
</script>

<template>
  <main class="grid items-start gap-4 lg:grid-cols-[200px_1fr]">
    <div class="grid gap-3">
      <div class="mb-2 flex items-center justify-between">
        <Sheet v-if="isMobileSize">
          <SheetTrigger>
            <Button variant="outline" size="icon" class="w-fit gap-1 px-1">
              <Users />
              <div>{{ gameDataStore.players.length }}</div>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader class="mb-2">
              <SheetTitle>Players</SheetTitle>
            </SheetHeader>
            <div class="space-y-3">
              <Player
                v-for="player of gameDataStore.players" :key="player.guid"
                :is-self="player.guid === gameDataStore.selfPlayer.guid"
                :editable="player.guid === gameDataStore.selfPlayer.guid"
                :player
              />
            </div>
          </SheetContent>
        </Sheet>
        <div class="flex gap-3">
          <span>
            Room: {{ router.currentRoute.value.params.id }}
          </span>
          <button>
            <Copy @click="copyId" />
          </button>
        </div>
      </div>
      <template v-if="!isMobileSize">
        <Player
          v-for="player of gameDataStore.players" :key="player.guid"
          :is-self="player.guid === gameDataStore.selfPlayer.guid"
          :editable="player.guid === gameDataStore.selfPlayer.guid"
          :player
        />
      </template>
    </div>
    <HostView v-if="gameDataStore.selfPlayer.isHost" :is-mobile-size />
    <div v-else class="flex items-center gap-5 self-center text-2xl">
      <span>Waiting for host to start game</span><LoadingCircle size="60px" />
    </div>
  </main>
</template>
