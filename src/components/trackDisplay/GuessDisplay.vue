<script setup lang="ts">
import { computed } from 'vue'
import BaseDisplay from './BaseDisplay.vue'

const props = defineProps<{
  guess: string
}>()
const SEPARATOR = ' - '
function extractGuessPart(index: number) {
  return props.guess.split(SEPARATOR)?.[index] ?? ''
}

const album = computed(() =>
  props.guess.split(SEPARATOR).slice(2).join(' '),
)
</script>

<template>
  <BaseDisplay
    :title="extractGuessPart(0)"
    :author="extractGuessPart(1)"
    :album
  />
</template>
