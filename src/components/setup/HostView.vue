<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from 'vue-router'
import { useConnectionStore, useGameDataStore, useMusicPlayerStore, useSpotifyLibraryStore } from '@/stores'
import SpotifyLibraryLoading from '@/components/setup/SpotifyLibraryLoading.vue'
import SpotifyLibraryDisplay from '@/components/setup/SpotifyLibraryDisplay.vue'
import { Button } from '@/components/ui/button'
import GameDataForm from '@/components/setup/GameDataForm.vue'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

defineProps<{
  isMobileSize: boolean
}>()

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
  <form v-else class="grid h-[80vh] max-h-[80vh] w-[80vw] lg:w-auto lg:grid-cols-[minmax(auto,600px)_270px] lg:grid-rows-[1fr_50px] lg:items-start lg:gap-5" @submit.prevent="handleGameStart">
    <Tabs v-if="isMobileSize" default-value="tracks">
      <TabsList class="w-full">
        <TabsTrigger value="tracks" class="flex-1">
          Playlists & Albums
        </TabsTrigger>
        <TabsTrigger value="settings" class="flex-1">
          Game settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tracks" class="h-[60vh]">
        <SpotifyLibraryDisplay
          v-model:favourites-selected="spotifyLibraryStore.favouritesSelected"
          :playlists="spotifyLibraryStore.playlists"
          :albums="spotifyLibraryStore.albums"
        />
      </TabsContent>
      <TabsContent value="settings" class="h-[60vh]">
        <GameDataForm />
      </TabsContent>
    </Tabs>
    <template v-else>
      <SpotifyLibraryDisplay
        v-model:favourites-selected="spotifyLibraryStore.favouritesSelected"
        :playlists="spotifyLibraryStore.playlists"
        :albums="spotifyLibraryStore.albums"
      />
      <GameDataForm />
    </template>
    <Button
      class=" w-28 place-self-center"
      :disabled="!musicPlayerStore.player || !selectedAnything"
      type="submit"
    >
      {{ startButtonText }}
    </Button>
  </form>
</template>
