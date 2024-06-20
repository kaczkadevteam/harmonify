<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useConnectionStore, useGameDataStore, useMusicPlayerStore, useSpotifyLibraryStore } from '@/stores'
import SpotifyLibraryDisplay from '@/components/setup/SpotifyLibraryDisplay.vue'
import { Button } from '@/components/ui/button'
import GameDataForm from '@/components/setup/GameDataForm.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SpotifyService } from '@/services'

defineProps<{
  isDesktop: boolean
}>()

const isLoading = ref(false)
const musicPlayerStore = useMusicPlayerStore()
const spotifyLibraryStore = useSpotifyLibraryStore()
const router = useRouter()
const cookies = useCookies()
const access_token = cookies.get('access_token')
const connectionStore = useConnectionStore()
const gameData = useGameDataStore()

async function loadData() {
  const access_token = z.string().parse(cookies.get('access_token'))

  spotifyLibraryStore.favourites = await SpotifyService.getTracksFromFavourites(access_token, router)
  spotifyLibraryStore.playlists = await SpotifyService.getPlaylists(access_token, router)
  spotifyLibraryStore.albums = await SpotifyService.getAlbums(access_token, router)
}

async function handleGameStart() {
  if (!musicPlayerStore.ready)
    return

  isLoading.value = true

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

function disableLoading() {
  isLoading.value = false
}

onBeforeMount(() => {
  loadData()
})

const selectedAnything = computed(() => {
  return spotifyLibraryStore.playlists?.some(i => i.selected)
    || spotifyLibraryStore.albums?.some(i => i.selected)
    || spotifyLibraryStore.favouritesSelected
})

const selectedAnyTrack = computed(() => selectedAnything.value && spotifyLibraryStore.totalSelectedTracks !== 0)

const startButtonText = computed(() => {
  if (!musicPlayerStore.ready)
    return 'Connecting...'
  else if (!selectedAnything.value)
    return 'Select tracks'
  else if (!selectedAnyTrack.value)
    return 'Selected empty playlists'
  else if (isLoading.value)
    return 'Loading...'
  else return 'Play!'
})

defineExpose({ disableLoading })
</script>

<template>
  <form class="grid h-[80vh] max-h-[80vh] w-[80vw] lg:w-auto lg:grid-cols-[minmax(auto,600px)_270px] lg:grid-rows-[1fr_50px] lg:items-start lg:gap-5" @submit.prevent="handleGameStart">
    <Tabs v-if="!isDesktop" default-value="tracks">
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
      class="min-w-32 place-self-center"
      :disabled="!musicPlayerStore.player || !selectedAnyTrack || isLoading"
      type="submit"
    >
      {{ startButtonText }}
    </Button>
  </form>
</template>
