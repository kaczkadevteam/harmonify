<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import { usePlayerStore } from '../stores/player'
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

const playerStore = usePlayerStore()

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://sdk.scdn.co/spotify-player.js'
  script.async = true

  scriptTag.value!.appendChild(script)

  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new window.Spotify.Player({
      name: 'Harmonify',
      getOAuthToken: (cb: any) => {
        if (!cookies.get('access_token'))
          router.push('/token/refresh')

        cb(cookies.get('access_token'))
      },
      volume: 0.05,
    })

    player.addListener('ready', ({ device_id }: any) => {
      playerStore.player = {
        play: async (track) => {
          await fetchFromSpotify(
            `/me/player/play?device_id=${device_id}`,
            router,
            false,
            'PUT',
            JSON.stringify({
              uris: [track?.uri],
              position_ms: track.trackStart_ms,
            }),
          )
        },
        pause: player.pause,
        resume: player.resume,
      }
    })

    player.addListener('not_ready', ({ device_id }: any) => {
      console.warn('Device ID has gone offline', device_id)
    })

    player.connect()
  }
})
</script>

<template>
  <div ref="scriptTag" />
</template>
