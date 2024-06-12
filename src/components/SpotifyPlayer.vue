<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useStorage } from '@vueuse/core'
import { useMusicPlayerStore } from '@/stores'
import { SpotifyService } from '@/services'
import { LOCAL_STORAGE } from '@/consts'
import type { MusicPlayer } from '@/types'

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any
    Spotify: any
  }
}

const scriptTag = ref<HTMLDivElement | null>(null)
const cookies = useCookies()
const router = useRouter()
const access_token = cookies.get('access_token')
const volume = useStorage(LOCAL_STORAGE.VOLUME, 0.05)

const musicPlayerStore = useMusicPlayerStore()

function createSpotifyPlayer() {
  return new window.Spotify.Player({
    name: 'Harmonify',
    getOAuthToken: (cb: any) => {
      if (!access_token)
        router.push('/api/token/refresh')

      cb(access_token)
    },
    volume: volume.value,
  })
}

function attachSpotifyScript() {
  const script = document.createElement('script')
  script.src = 'https://sdk.scdn.co/spotify-player.js'
  script.async = true

  scriptTag.value!.appendChild(script)
}

function addSpotifyPlayerReadyListener(player: any) {
  player.addListener('ready', ({ device_id }: any) => {
    musicPlayerStore.player = getWrapperForSpotifyPlayer(player, device_id)
  })
}

function addSpotifyPlayerNotReadyListener(player: any) {
  player.addListener('not_ready', ({ device_id }: any) => {
    console.warn('Device ID has gone offline', device_id)
  })
}

function getWrapperForSpotifyPlayer(player: any, device_id: string): MusicPlayer {
  return {
    _turnOn: async () => {
      await SpotifyService.selectPlayer(device_id, access_token, router)
    },
    _play: async (playData) => {
      await SpotifyService.playTrack(playData, device_id, access_token, router)
    },
    _seek: time_ms => player.seek(time_ms),
    _pause: () => player.pause(),
    _resume: () => player.resume(),
    _setVolume: volume => player.setVolume(volume),
  }
}

onMounted(() => {
  attachSpotifyScript()

  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = createSpotifyPlayer()

    addSpotifyPlayerReadyListener(player)

    addSpotifyPlayerNotReadyListener(player)

    player.connect()
  }
})
</script>

<template>
  <div ref="scriptTag" />
</template>
