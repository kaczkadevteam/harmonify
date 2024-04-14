<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Track } from '@/types'
import TrackDisplay from '@/components/TrackDisplay.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  track: Track
  selected: boolean
}>()

const emit = defineEmits<{
  click: [guess: string]
}>()

const element = ref<HTMLDivElement | null>(null)

watch(() => props.selected, (selected) => {
  if (selected)
    element.value?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <div
    ref="element"
    :class="cn('px-5 py-3 hover:bg-accent hover:text-accent-foreground', selected && 'bg-accent text-accent-foreground')"
    @click="emit('click', track.guess ?? '')"
  >
    <TrackDisplay :track />
    <input type="hidden" name="track" :value="track.uri">
  </div>
</template>
