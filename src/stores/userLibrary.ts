import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Album, SimplePlaylistObject, Track } from '@/types'

export interface ShallowPlaylists {
  total: number
  items: SimplePlaylistObject[]
}

export interface ShallowAlbums {
  total: number
  items: Album<Track>[]
}

export const useUserLibraryStore = defineStore('userLibrary', () => {
  const playlists = ref<ShallowPlaylists>()
  const albums = ref<ShallowAlbums>()

  return { playlists, albums }
})
