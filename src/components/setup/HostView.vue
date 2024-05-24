<script setup lang="ts">
import { computed } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from 'vue-router'
import { useConnectionStore, useGameDataStore, useMusicPlayerStore, useSpotifyLibraryStore } from '@/stores'
import SpotifyLibraryLoading from '@/components/setup/SpotifyLibraryLoading.vue'
import SpotifyLibraryDisplay from '@/components/setup/SpotifyLibraryDisplay.vue'
import { Button } from '@/components/ui/button'
import GameDataForm from '@/components/setup/GameDataForm.vue'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'

const musicPlayerStore = useMusicPlayerStore()
const spotifyLibraryStore = useSpotifyLibraryStore()
const router = useRouter()
const cookies = useCookies()
const access_token = cookies.get('access_token')
const connectionStore = useConnectionStore()
const gameData = useGameDataStore()

function handleLoadingFinished(playlists: SelectablePlaylist[], albums: SelectableAlbum[]) {
  spotifyLibraryStore.playlists = playlists
  spotifyLibraryStore.albums = albums
}

async function handleGameStart() {
  if (!musicPlayerStore.ready)
    return

  await musicPlayerStore.turnOn()
  const tracks = await spotifyLibraryStore.getTracksFromSelectedSets(access_token, router)
  connectionStore.sendMessage({
    $type: 'message/startGameDto',
    type: 'startGame',
    data: {
      tracks,
      gameSettings: gameData.gameSettings,
    },
  })
}

const selectedAnything = computed(() => {
  return spotifyLibraryStore.playlists?.some(i => i.selected)
    || spotifyLibraryStore.albums?.some(i => i.selected)
    || spotifyLibraryStore.favouritesSelected
})

const startButtonText = computed(() => {
  if (!musicPlayerStore.ready)
    return 'Connecting...'
  else if (!selectedAnything.value)
    return 'Select tracks'
  else return 'Play!'
})
</script>

<template>
  <SpotifyLibraryLoading v-if="!spotifyLibraryStore.playlists || !spotifyLibraryStore.albums" @loaded="handleLoadingFinished" />
  <form v-else class="grid h-[80vh] w-[80vw] grid-cols-[1fr_auto] grid-rows-[1fr_50px] items-start gap-5" @submit.prevent="handleGameStart">
    <SpotifyLibraryDisplay
      v-model:favourites-selected="spotifyLibraryStore.favouritesSelected"
      :playlists="spotifyLibraryStore.playlists"
      :albums="spotifyLibraryStore.albums"
    />
    <GameDataForm />
    <Button
      class=" w-28 place-self-center"
      :disabled="!musicPlayerStore.player || !selectedAnything"
      type="submit"
    >
      {{ startButtonText }}
    </Button>
  </form>
</template>
