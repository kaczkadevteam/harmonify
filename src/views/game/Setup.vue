<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useTracksStore } from '@/stores/tracks'
import LibraryLoading from '@/components/LibraryLoading.vue'
import LibraryDisplay from '@/components/LibraryDisplay.vue'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'

const playerStore = usePlayerStore()
const userLibraryStore = useTracksStore()

function onLoaded(playlists: SelectablePlaylist[], albums: SelectableAlbum[]) {
  userLibraryStore.playlists = playlists
  userLibraryStore.albums = albums
}

const selectedAnything = computed(() => {
  return userLibraryStore.playlists?.some(i => i.selected)
    || userLibraryStore.albums?.some(i => i.selected)
    || userLibraryStore.favouritesSelected
})
</script>

<template>
  <LibraryLoading v-if="!userLibraryStore.playlists || !userLibraryStore.albums" @loaded="onLoaded" />
  <main v-else class="grid h-[80vh] w-[80vw] grid-cols-[1fr_auto] grid-rows-[1fr_50px] gap-5">
    <LibraryDisplay
      v-model:favourites-selected="userLibraryStore.favouritesSelected"
      :playlists="userLibraryStore.playlists"
      :albums="userLibraryStore.albums"
    />
    <div />
    <div v-if="!playerStore.player">
      Connecting
    </div>
    <div v-else-if="!selectedAnything">
      Select track
    </div>
    <div v-else>
      Play!
    </div>
  </main>
</template>
