<script setup lang="ts">
import LoadingCircle from '@/components/LoadingCircle.vue'
import Player from '@/components/Player.vue'
import HostView from '@/components/setup/HostView.vue'
import NicknameModal from '@/components/setup/NicknameModal.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/toast/use-toast'
import { Breakpoint } from '@/consts'
import { cn } from '@/lib/utils'
import { useConnectionStore, useGameDataStore, useResultStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import { cva } from 'class-variance-authority'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const resultStore = useResultStore()
const gameDataStore = useGameDataStore()
const connectionStore = useConnectionStore()
const { width: screenWidth } = useWindowSize()
const { toast } = useToast()
const isNicknameModalOpen = ref(true)

const hostView = ref<InstanceType<typeof HostView> | null>(null)

onBeforeMount(() => {
  resultStore.$reset()
  connectionStore.handleMessage = (message) => {
    if (message.$type === 'message/gameStartedDto') {
      gameDataStore.startGame(message.data)
      router.push({ name: 'round', params: router.currentRoute.value.params })
    }
    else if (message.$type === 'messageError') {
      toast({ title: 'Error', description: `${message.type}: ${message.errorMessage}`, variant: 'destructive', duration: 4000 })
      if (message.type === 'dataTooLarge' && hostView.value)
        hostView.value.disableLoading()
    }
  }
})

const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)

const showPlayers = computed(() => isDesktop.value || !gameDataStore.selfPlayer.isHost)
const desktopPlayerContainerVariants = cva('', {
  variants: {
    variant: {
      host: 'space-y-3',
      guest: 'grid min-h-[60vh] w-full auto-rows-[40px] grid-cols-[repeat(auto-fill,minmax(240px,1fr))] content-start justify-center gap-5',
    },
  },
  defaultVariants: {
    variant: 'guest',
  },
})
</script>

<template>
  <main
    :class="cn('grid grid-rows-[minmax(0,auto)_minmax(0,1fr)] content-center justify-center gap-4 p-4 lg:grid-rows-none grid-cols-[minmax(auto,1200px)] mx-10', gameDataStore.selfPlayer.isHost && 'justify-items-center lg:grid-cols-[260px_auto] mx-0')"
  >
    <div :class="cn('grid gap-6 self-start lg:mt-2 justify-items-center', gameDataStore.selfPlayer.isHost && 'lg:justify-items-start gap-3')">
      <ScrollArea v-if="showPlayers" class="max-h-[calc(100vh_-_200px)] w-full">
        <div :class="desktopPlayerContainerVariants({ variant: gameDataStore.selfPlayer.isHost ? 'host' : 'guest' })">
          <Player
            v-for="player of gameDataStore.players" :key="player.guid"
            :is-self="player.guid === gameDataStore.selfPlayer.guid"
            :editable="player.guid === gameDataStore.selfPlayer.guid"
            :player
          />
        </div>
      </ScrollArea>
    </div>
    <HostView v-if="gameDataStore.selfPlayer.isHost" ref="hostView" :is-desktop />
    <div v-else class="flex items-center gap-5 justify-self-center text-2xl">
      <span>Waiting for host to start game</span><LoadingCircle size="60px" />
    </div>
    <NicknameModal v-model:open="isNicknameModalOpen" />
  </main>
</template>
