<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import PauseGameButton from '@/components/PauseGameButton.vue'
import PreviewPlayer from '@/components/PreviewPlayer.vue'
import { useGameDataStore } from '@/stores'
import QuitGameButton from '@/components/QuitGameButton.vue'
import Settings from '@/components/Settings.vue'
import { Breakpoint } from '@/consts'
import PlayersSheet from '@/components/PlayersSheet.vue'
import RoomIdDisplay from '@/components/RoomIdDisplay.vue'

const gameDataStore = useGameDataStore()
const route = useRoute()
const { width: screenWidth } = useWindowSize()

const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)

const displayPauseButton = computed(() => gameDataStore.selfPlayer.isHost && (route.name === 'round' || route.name === 'roundResult'))
const displayPlayersButton = computed(() => !isDesktop.value && gameDataStore.selfPlayer.isHost && route.name === 'setup')
</script>

<template>
  <div class="grid h-screen min-h-screen grid-rows-[minmax(0,auto)_minmax(0,1fr)] place-content-stretch">
    <div class="z-20 grid grid-cols-[minmax(auto,1200px)] justify-center border-b">
      <div class="flex items-center justify-start p-1">
        <RoomIdDisplay class="mr-auto" />
        <Settings />
        <PlayersSheet v-if="displayPlayersButton" />
        <PauseGameButton v-if="displayPauseButton" />
        <QuitGameButton />
      </div>
    </div>
    <RouterView class="relative" />
    <PreviewPlayer />
  </div>
</template>
