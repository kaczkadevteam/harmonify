<script setup lang="ts">
import BaseDisplay from './BaseDisplay.vue'

const props = defineProps<{
  guess: string
}>()

function extractGuessPart(index: number) {
  return props.guess.split(' - ')?.[index] ?? ''
}
</script>

<template>
  <BaseDisplay
    :title="extractGuessPart(0)"
    :author="extractGuessPart(1)"
    :album="extractGuessPart(2)"
  />
</template>
