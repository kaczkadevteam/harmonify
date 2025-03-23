<script setup lang="ts">
import type { DisplayedGuessDto } from '@/types'
import GuessDisplay from '@/components/trackDisplay/GuessDisplay.vue'
import { cn } from '@/lib/utils'
import { whenever } from '@vueuse/core'
import { ref } from 'vue'

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
    :class="cn('py-1.5 px-3 md:px-5 md:py-3 hover:bg-accent hover:text-accent-foreground', selected && 'bg-accent text-accent-foreground')"
    @click="emit('click', displayedGuess.guess ?? '')"
  >
    <GuessDisplay :guess="displayedGuess.guess" />
    <input type="hidden" name="track" :value="displayedGuess.id">
  </div>
</template>
