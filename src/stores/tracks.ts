import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SelectableAlbum, SelectablePlaylist } from '@/types'

export const useTracksStore = defineStore('tracks', () => {
  const favouritesSelected = ref(false)
  const playlists = ref<SelectablePlaylist[]>()
  const albums = ref<SelectableAlbum[]>()

  return { favouritesSelected, playlists, albums }
})
