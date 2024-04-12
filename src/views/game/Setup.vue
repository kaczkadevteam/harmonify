<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useTracksStore } from '@/stores/tracks'
import LibraryLoading from '@/components/setup/LibraryLoading.vue'
import LibraryDisplay from '@/components/setup/LibraryDisplay.vue'
import { Button } from '@/components/ui/button'
import GameDataForm from '@/components/setup/GameDataForm.vue'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'

const playerStore = usePlayerStore()
const userLibraryStore = useTracksStore()

function onLoaded(playlists: SelectablePlaylist[], albums: SelectableAlbum[]) {
  userLibraryStore.playlists = playlists
  userLibraryStore.albums = albums
}

async function onStartGame() {

}

const selectedAnything = computed(() => {
  return userLibraryStore.playlists?.some(i => i.selected)
    || userLibraryStore.albums?.some(i => i.selected)
    || userLibraryStore.favouritesSelected
})

const startButtonText = computed(() => {
  if (!playerStore.player)
    return 'Connecting...'
  else if (!selectedAnything.value)
    return 'Select tracks'
  else return 'Play!'
})
</script>

<template>
  <LibraryLoading v-if="!userLibraryStore.playlists || !userLibraryStore.albums" @loaded="onLoaded" />
  <main v-else class="grid h-[80vh] w-[80vw] grid-cols-[1fr_auto] grid-rows-[1fr_50px] items-start gap-5">
    <LibraryDisplay
      v-model:favourites-selected="userLibraryStore.favouritesSelected"
      :playlists="userLibraryStore.playlists"
      :albums="userLibraryStore.albums"
    />
    <GameDataForm />
    <Button
      :disabled="!playerStore.player || !selectedAnything"
      @click="onStartGame"
    >
      {{ startButtonText }}
    </Button>
  </main>
</template>
