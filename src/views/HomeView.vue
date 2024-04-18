<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const cookies = useCookies()

const isLogged = ref(!!cookies.get('access_token') || !!cookies.get('refresh_token'))
</script>

<template>
  <div class="grid h-screen place-content-center place-items-center">
    <header class=" grid justify-items-center gap-5">
      <h1 class="flex items-center gap-5 text-8xl font-bold italic text-primary">
        <img src="@/assets/logo.png" alt="Logo" width="100">
        <span>Harmonify!</span>
      </h1>
      <h3 class="flex items-center gap-3">
        <span class="text-lg font-semibold">Guess your favorite songs from </span>
        <img alt="Spotify logo" src="@/assets/Spotify_Logo_RGB_White.png" width="150">
      </h3>
    </header>
    <main class="mt-10 text-2xl font-bold text-primary hover:animate-increase-decrease">
      <RouterLink v-if="isLogged" to="/game">
        Play
      </RouterLink>
      <a v-else href="/api/token/request">Connect</a>
    </main>
  </div>
</template>
