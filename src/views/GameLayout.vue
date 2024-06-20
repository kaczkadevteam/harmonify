<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useClipboard, useWindowSize } from '@vueuse/core'
import { Copy } from 'lucide-vue-next'
import PauseGameButton from '@/components/PauseGameButton.vue'
import PreviewPlayer from '@/components/PreviewPlayer.vue'
import { useGameDataStore } from '@/stores'
import QuitGameButton from '@/components/QuitGameButton.vue'
import Settings from '@/components/Settings.vue'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { Breakpoint } from '@/consts'
import PlayersSheet from '@/components/PlayersSheet.vue'

const gameDataStore = useGameDataStore()
const route = useRoute()
const { width: screenWidth } = useWindowSize()
const { copy } = useClipboard()
const { toast } = useToast()
const isDesktop = computed(() => screenWidth.value >= Breakpoint.LG)

const displayPauseButton = computed(() => gameDataStore.selfPlayer.isHost && (route.name === 'round' || route.name === 'roundResult'))
const displayPlayersButton = computed(() => !isDesktop.value && route.name === 'setup')

function copyId() {
  copy(new URL(route.fullPath, window.location.origin).href)
  toast({ description: 'Room URL copied to clipboard!' })
}
</script>

<template>
  <div class="grid h-screen min-h-screen grid-rows-[minmax(0,auto)_minmax(0,1fr)] place-content-stretch">
    <div class="z-20 grid grid-cols-[minmax(auto,1200px)] justify-center border-b">
      <div class="flex items-center justify-start p-1">
        <div class="ml-2 mr-auto flex items-center gap-3">
          <span>
            Room: {{ route.params.id }}
          </span>
          <Button v-if="route.name === 'setup'" variant="ghost" size="icon">
            <Copy @click="copyId" />
          </Button>
        </div>
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
