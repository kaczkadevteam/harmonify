<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useStorage } from '@vueuse/core'
import { type Player, VOLUME_KEY, usePlayerStore } from '@/stores/player'
import { fetchFromSpotify } from '@/lib/spotify'

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
const volume = useStorage(VOLUME_KEY, 0.05)

const playerStore = usePlayerStore()

function createSpotifyPlayer() {
  return new window.Spotify.Player({
    name: 'Harmonify',
    getOAuthToken: (cb: any) => {
      if (!access_token)
        router.push('/api/token/refresh')

      cb(access_token)
    },
    volume,
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
    playerStore.player = getWrapperForSpotifyPlayer(player, device_id)
  })
}

function addSpotifyPlayerNotReadyListener(player: any) {
  player.addListener('not_ready', ({ device_id }: any) => {
    console.warn('Device ID has gone offline', device_id)
  })
}

function getWrapperForSpotifyPlayer(player: any, device_id: string): Player {
  return {
    _turnOn: async () => {
      await fetchFromSpotify(
        '/me/player',
        access_token,
        router,
        false,
        'PUT',
        JSON.stringify({ device_ids: [device_id] }),
      )
    },
    _play: async (track) => {
      await fetchFromSpotify(
            `/me/player/play?device_id=${device_id}`,
            access_token,
            router,
            false,
            'PUT',
            JSON.stringify({
              uris: [track?.uri],
              position_ms: track.trackStart_ms,
            }),
      )
    },
    _pause: player.pause,
    _resume: player.resume,
    _setVolume: player.setVolume,
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
