<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DisplayedGuessDto, Track } from '@/types'
import { TrackDisplay } from '@/components/trackDisplay'
import { cn } from '@/lib/utils'
import GuessDisplay from '@/components/trackDisplay/GuessDisplay.vue'

const props = defineProps<{
  displayedGuess: DisplayedGuessDto
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
    @click="emit('click', displayedGuess.guess ?? '')"
  >
    <GuessDisplay :guess="displayedGuess.guess" />
    <input type="hidden" name="track" :value="displayedGuess.id">
  </div>
</template>
