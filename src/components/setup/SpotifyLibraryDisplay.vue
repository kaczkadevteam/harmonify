<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'
import CheckableCard from '@/components/CheckableCard.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

defineProps<{
  playlists: SelectablePlaylist[]
  albums: SelectableAlbum[]
}>()

const favouritesSelected = defineModel<boolean>('favouritesSelected', { required: true })
</script>

<template>
  <ScrollArea class="flex max-h-full flex-col justify-start space-y-5 rounded-lg border p-4">
    <div class="flex flex-col gap-3">
      <h2 class="sticky -top-1 z-10 -m-1 bg-gradient bg-fixed p-1 py-2 text-center text-3xl font-semibold tracking-tight">
        Playlists
      </h2>
      <div class=" mt-5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
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
          v-for="playlist of playlists"
          :id="playlist.id"
          :key="playlist.id"
          v-model="playlist.selected"
          art-type="image"
          :title="playlist.name"
          :src="playlist?.images?.[0].url"
          alt="Playlist cover"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="sticky -top-1 z-10 -m-1 bg-gradient bg-fixed p-1 py-2 text-center text-3xl font-semibold tracking-tight">
        Albums
      </h2>
      <div class=" mt-5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
        <CheckableCard
          v-for="album of albums"
          :id="album.id"
          :key="album.id"
          v-model="album.selected"
          art-type="image"
          :title="album.name"
          :src="album.images[0].url"
          alt="Album cover"
        />
      </div>
    </div>
    <ScrollBar class=" z-30" />
  </ScrollArea>
</template>
