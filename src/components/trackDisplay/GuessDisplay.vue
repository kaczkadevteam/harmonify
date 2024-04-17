<script setup lang="ts">
import BaseDisplay from './BaseDisplay.vue'

defineProps<{
  guess: string
}>()
</script>

<template>
  <BaseDisplay
    :title="guess.split(' - ')?.[0] ?? ''"
    :author="guess.split(' - ')?.[1] ?? ''"
    :album="guess.split(' - ')?.[2] ?? ''"
  />
</template>
