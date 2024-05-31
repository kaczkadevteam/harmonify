<script setup lang="ts">
defineProps<{
  title: string
  author: string
  album: string
}>()
</script>

<template>
  <span class="text-sm md:text-base">
    <span class="font-semibold" v-text="title" />
    <span class="ml-3 text-muted-foreground" v-text="author" />
    <span class="ml-3 text-muted-foreground" v-text="album" />
  </span>
</template>
