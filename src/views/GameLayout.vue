<script setup lang="ts">
import PreviewPlayer from '@/components/PreviewPlayer.vue'
</script>

<template>
  <div class="grid min-h-screen place-content-center">
    <RouterView />
    <PreviewPlayer />
  </div>
</template>
