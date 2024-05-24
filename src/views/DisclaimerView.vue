<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { Home } from 'lucide-vue-next'

const cookies = useCookies()

cookies.remove('access_token')
cookies.remove('refresh_token')
</script>

<template>
  <main class="grid h-screen place-content-center place-items-center space-y-2">
    <h2 class="text-3xl">
      Disclaimer
    </h2>
    <p class="max-w-[600px] text-lg">
      You are unable to create a room because your spotify account is not added to the developer dashboard (due to Spotify's ToS). However, you can still join rooms created by someone with the necessary privileges.
    </p>
    <RouterLink class="flex items-center gap-2 text-lg text-primary" :to="{ name: 'home' }">
      <Home />
      <span>Return</span>
    </RouterLink>
  </main>
</template>
