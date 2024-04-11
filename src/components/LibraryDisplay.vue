<script setup lang="ts">
import type { SelectableAlbum, SelectablePlaylist } from '@/types'
import CheckableCard from '@/components/CheckableCard.vue'

defineProps<{
  playlists: SelectablePlaylist[]
  albums: SelectableAlbum[]
}>()

const favouritesSelected = defineModel<boolean>('favouritesSelected', { required: true })
</script>

<template>
  <div class="flex flex-col justify-start space-y-5 overflow-auto">
    <div class="flex flex-col gap-3">
      <h2 class="sticky -top-1 z-10 bg-gradient bg-fixed p-1 py-2 text-center text-3xl font-semibold tracking-tight">
        Playlists
      </h2>

      <div class=" mt-5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
        <CheckableCard
          id="favourites"
          v-model="favouritesSelected"
          art-type="icon"
          title="Favourites"
          src=""
          alt="Favourites"
        />
        <CheckableCard
          v-for="playlist of playlists"
          :id="playlist.id"
          :key="playlist.id"
          v-model="playlist.selected"
          art-type="image"
          :title="playlist.name"
          :src="playlist.images[0].url"
          alt="Playlist cover"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="sticky -top-1 z-10 bg-gradient bg-fixed p-1 py-2 text-center text-3xl font-semibold tracking-tight">
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
  </div>
</template>
