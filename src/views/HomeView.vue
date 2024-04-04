<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const cookies = useCookies()

const isLogged = ref(!!cookies.get('access_token') || !!cookies.get('refresh_token'))
</script>

<template>
  <div>
    <header>
      <h1>Tutaj będzie logo</h1>
      <h3>
        Guess your favorite songs from{{ " " }}
        <img alt="Spotify logo" src="@/assets/Spotify_Logo_RGB_White.png" width="150">
      </h3>
    </header>
    <main>
      <RouterLink v-if="isLogged" to="/game">
        Play
      </RouterLink>
      <a v-else href="/api/token/request">Connect</a>
    </main>
  </div>
</template>
