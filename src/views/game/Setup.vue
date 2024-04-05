<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { type ShallowAlbums, type ShallowPlaylists, useUserLibraryStore } from '@/stores/userLibrary'
import LibraryLoading from '@/components/LibraryLoading.vue'
import LibraryDisplay from '@/components/LibraryDisplay.vue'

const playerStore = usePlayerStore()
const userLibraryStore = useUserLibraryStore()

function onLoaded(playlists: ShallowPlaylists, albums: ShallowAlbums) {
  userLibraryStore.playlists = playlists
  userLibraryStore.albums = albums
}
</script>

<template>
  <LibraryLoading v-if="!userLibraryStore.playlists || !userLibraryStore.albums" @loaded="onLoaded" />
  <LibraryDisplay v-else />
  <div v-if="playerStore.player">
    Play
  </div>
  <div v-else>
    Connecting
  </div>
</template>
