<script setup lang="ts">
import CheckableCard from '@/components/CheckableCard.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useSpotifyLibraryStore } from '@/stores'
import { Heart } from 'lucide-vue-next'

const spotifyLibraryStore = useSpotifyLibraryStore()

const favouritesSelected = defineModel<boolean>('favouritesSelected', { required: true })
</script>

<template>
  <ScrollArea class="flex max-h-full flex-col justify-start rounded-lg border p-4">
    <div class="flex flex-col gap-3">
      <h2 class="sticky -top-1 z-10 bg-gradient bg-fixed pb-2 text-center text-xl font-semibold tracking-tight lg:pb-4 lg:text-3xl">
        Playlists
      </h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(116px,1fr))] gap-5 lg:mt-5">
        <template v-if="spotifyLibraryStore.favourites && spotifyLibraryStore.playlists">
          <CheckableCard
            id="favourites"
            v-model="favouritesSelected"
            art-type="icon"
            title="Favourites"
            alt="Favourites"
          >
            <Heart fill="hsl(38, 92%, 50%)" class="text-primary" :size="60" />
          </CheckableCard>
          <CheckableCard
            v-for="playlist of spotifyLibraryStore.playlists"
            :id="playlist.id"
            :key="playlist.id"
            v-model="playlist.selected"
            art-type="image"
            :title="playlist.name"
            :src="playlist?.images?.[0].url"
            alt="Playlist cover"
          />
        </template>
        <template v-else>
          <div v-for="i in 10" :key="i" class="space-y-3">
            <Skeleton class="m-1 aspect-square" />
            <Skeleton class="mx-1 h-5" />
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="sticky -top-1 z-10 bg-gradient bg-fixed pb-2 text-center text-xl font-semibold tracking-tight lg:pb-4  lg:text-3xl">
        Albums
      </h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(116px,1fr))] gap-5 lg:mt-5">
        <template v-if="spotifyLibraryStore.albums">
          <CheckableCard
            v-for="album of spotifyLibraryStore.albums"
            :id="album.id"
            :key="album.id"
            v-model="album.selected"
            art-type="image"
            :title="album.name"
            :src="album.images[0].url"
            alt="Album cover"
          />
        </template>
        <template v-else>
          <div v-for="i in 10" :key="i" class="space-y-3">
            <Skeleton class="m-1 aspect-square" />
            <Skeleton class="mx-1 h-5" />
          </div>
        </template>
      </div>
    </div>
  </scrollarea>
</template>
