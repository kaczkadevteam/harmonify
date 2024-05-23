<script setup lang="ts">
import { ref } from 'vue'
import { whenever } from '@vueuse/core'
import type { DisplayedGuessDto } from '@/types'
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

whenever(() => props.selected, () => {
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
