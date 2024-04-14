<script setup lang="ts">
defineProps<{
  title: string
  author: string
  album: string
}>()
</script>

<template>
  <span>
    <span class="font-semibold" v-text="title" />
    <span class="ml-3 text-muted-foreground" v-text="author" />
    <span class="ml-3 text-muted-foreground" v-text="album" />
  </span>
</template>
