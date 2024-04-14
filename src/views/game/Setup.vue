<script setup lang="ts">
import { computed } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useSpotifyLibraryStore } from '@/stores/spotifyLibrary'
import SpotifyLibraryLoading from '@/components/setup/SpotifyLibraryLoading.vue'
import SpotifyLibraryDisplay from '@/components/setup/SpotifyLibraryDisplay.vue'
import { Button } from '@/components/ui/button'
import GameDataForm from '@/components/setup/GameDataForm.vue'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'
import { useGameDataStore } from '@/stores/gameData'

const playerStore = usePlayerStore()
const spotifyLibraryStore = useSpotifyLibraryStore()
const gameDataStore = useGameDataStore()
const router = useRouter()
const cookies = useCookies()
const access_token = cookies.get('access_token')

function onLoaded(playlists: SelectablePlaylist[], albums: SelectableAlbum[]) {
  spotifyLibraryStore.playlists = playlists
  spotifyLibraryStore.albums = albums
}

async function onStartGame() {
  if (!playerStore.ready)
    return

  await playerStore.turnOn()
  const tracks = await spotifyLibraryStore.getTracksFromSelectedSets(access_token, router)
  gameDataStore.prepareGame(tracks)
  router.push({ name: 'round', params: { id: '7734' } })
}

const selectedAnything = computed(() => {
  return spotifyLibraryStore.playlists?.some(i => i.selected)
    || spotifyLibraryStore.albums?.some(i => i.selected)
    || spotifyLibraryStore.favouritesSelected
})

const startButtonText = computed(() => {
  if (!playerStore.ready)
    return 'Connecting...'
  else if (!selectedAnything.value)
    return 'Select tracks'
  else return 'Play!'
})
</script>

<template>
  <SpotifyLibraryLoading v-if="!spotifyLibraryStore.playlists || !spotifyLibraryStore.albums" @loaded="onLoaded" />
  <main v-else class="grid h-[80vh] w-[80vw] grid-cols-[1fr_auto] grid-rows-[1fr_50px] items-start gap-5">
    <SpotifyLibraryDisplay
      v-model:favourites-selected="spotifyLibraryStore.favouritesSelected"
      :playlists="spotifyLibraryStore.playlists"
      :albums="spotifyLibraryStore.albums"
    />
    <GameDataForm />
    <Button
      class=" w-28 place-self-center"
      :disabled="!playerStore.player || !selectedAnything"
      @click="onStartGame"
    >
      {{ startButtonText }}
    </Button>
  </main>
</template>
