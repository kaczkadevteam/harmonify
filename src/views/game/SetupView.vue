<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClipboard, useWindowSize } from '@vueuse/core'
import { Copy, Users } from 'lucide-vue-next'
import HostView from '@/components/setup/HostView.vue'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'
import LoadingCircle from '@/components/LoadingCircle.vue'
import Player from '@/components/Player.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Breakpoint } from '@/consts'

const router = useRouter()
const resultStore = useResultStore()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()
const { width: screenWidth } = useWindowSize()
const { copy } = useClipboard()
const { toast } = useToast()

const hostView = ref<InstanceType<typeof HostView> | null>(null)

onBeforeMount(() => {
  resultStore.$reset()
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/gameStartedDto') {
      gameDataStore.startGame(message.data)
      router.push({ name: 'round', params: router.currentRoute.value.params })
    }
    else if (message.$type === 'messageError') {
      toast({ title: 'Error', description: message.errorMessage, variant: 'destructive', duration: 4000 })
      if (hostView.value)
        hostView.value.disableLoading()
    }
  }
})

function copyId() {
  copy(router.currentRoute.value.params.id.toString())
  toast({ description: 'Room ID copied to clipboard!' })
}

const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)
</script>

<template>
  <main class="grid grid-rows-[minmax(0,auto)_minmax(0,1fr)] content-center justify-center gap-4 p-4 lg:grid-cols-[260px_auto] lg:grid-rows-none lg:justify-center lg:justify-items-center">
    <div class="grid gap-3 self-start lg:mt-2 lg:place-content-start lg:justify-self-start">
      <div class="flex items-center justify-between">
        <Sheet v-if="!isDesktop">
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
            <ScrollArea class="h-[calc(100%_-_30px)]">
              <div class="space-y-3">
                <Player
                  v-for="player of gameDataStore.players" :key="player.guid"
                  :is-self="player.guid === gameDataStore.selfPlayer.guid"
                  :editable="player.guid === gameDataStore.selfPlayer.guid"
                  :player
                />
              </div>
            </ScrollArea>
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
      <ScrollArea v-if="isDesktop" class="max-h-[calc(100vh_-_200px)]">
        <div class="space-y-3">
          <Player
            v-for="player of gameDataStore.players" :key="player.guid"
            :is-self="player.guid === gameDataStore.selfPlayer.guid"
            :editable="player.guid === gameDataStore.selfPlayer.guid"
            :player
          />
        </div>
      </ScrollArea>
    </div>
    <HostView v-if="gameDataStore.selfPlayer.isHost" ref="hostView" is-desktop />
    <div v-else class="flex items-center gap-5 text-2xl">
      <span>Waiting for host to start game</span><LoadingCircle size="60px" />
    </div>
  </main>
</template>
