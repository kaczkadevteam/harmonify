<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { onStartTyping, useFocus } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import SearchInputOption from './searchInput/SearchInputOption.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { DisplayedGuessDto } from '@/types'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  guesses: DisplayedGuessDto[]
}>()

const guess = defineModel<string>({ required: true })

const selectedGuess = ref<DisplayedGuessDto>(props.guesses[0])
const input = ref<HTMLInputElement | null>(null)
const { focused } = useFocus(input, { initialValue: true })

onStartTyping(() => {
  if (!focused.value)
    focused.value = true
})

const matchingGuesses = computed(() => {
  let exactMatchFound = false
  let matchingTracks = props.guesses.filter((displayedGuess) => {
    if (displayedGuess.guess == null)
      return false
    if (guess.value === '')
      return false
    if (displayedGuess.guess === guess.value) {
      exactMatchFound = true
      return false
    }

    return displayedGuess.guess.toLowerCase().includes(guess.value.toLowerCase())
  })
  if (exactMatchFound)
    matchingTracks = []

  return matchingTracks
})

watchEffect(() => {
  /**
   * Select the first track on the list if a selected track no longer matches the query and there are still tracks that do match the query
   */
  if (selectedGuess.value && !matchingGuesses.value.includes(selectedGuess.value) && matchingGuesses.value.length !== 0)
    selectedGuess.value = matchingGuesses.value[0]
})

function handleSelectionMovement(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()

    const moveDown = event.key === 'ArrowDown'
    const moveUp = event.key === 'ArrowUp'
    const selectedTrackExistsAndIsNotLast = selectedGuess.value && matchingGuesses.value.indexOf(selectedGuess.value) < matchingGuesses.value.length - 1
    const selectedTrackExistsAndIsNotFirst = selectedGuess.value && matchingGuesses.value.indexOf(selectedGuess.value) > 0

    if (!selectedGuess.value) {
      selectedGuess.value = matchingGuesses.value[0]
    }
    else if (moveDown && selectedTrackExistsAndIsNotLast) {
      const newIndex = matchingGuesses.value.indexOf(selectedGuess.value) + 1
      selectedGuess.value = matchingGuesses.value[newIndex]
    }
    else if (moveUp && selectedTrackExistsAndIsNotFirst) {
      const newIndex = matchingGuesses.value.indexOf(selectedGuess.value) - 1
      selectedGuess.value = matchingGuesses.value[newIndex]
    }
  }
}

function handleSelectionInput(event: KeyboardEvent) {
  const inputIsFocused = focused.value
  const clickedEnter = event.key === 'Enter'
  const selectedVisibleTrack = selectedGuess.value && matchingGuesses.value.length !== 0

  if (inputIsFocused && clickedEnter && selectedVisibleTrack) {
    event.preventDefault()
    guess.value = selectedGuess.value!.guess ?? ''
  }
}

watch<[number, boolean]>(() => [matchingGuesses.value.length, focused.value], ([newGuessesCount, newIsFocused], [prevGuessesCount, prevIsFocused]) => {
  if (prevGuessesCount > 0 && prevIsFocused) {
    window.removeEventListener('keydown', handleSelectionMovement)
    window.removeEventListener('keydown', handleSelectionInput)
  }

  if (newGuessesCount > 0 && newIsFocused) {
    window.addEventListener('keydown', handleSelectionMovement)
    window.addEventListener('keydown', handleSelectionInput)
  }
})

function handleOptionClick(_guess: string) {
  guess.value = _guess
}
</script>

<template>
  <div class="relative w-80 ">
    <div class="inline-flex items-center rounded-lg border">
      <Input
        id="searchInput"
        ref="input"
        v-model="guess"
        :class="cn(`focus-visible:ring-0 focus-visible:ring-offset-0 box-border text-lg h-12 border-none pr-2`, matchingGuesses.length > 0 && 'rounded-b-none border-b-0')"
        placeholder="Guess"
        type="text"
        name="guess"
        autocomplete="off"
      />
      <Button
        class="size-12 min-w-12 bg-gradient bg-fixed hover:bg-slate-800 hover:bg-none"
        variant="ghost"
        size="icon"
        type="button"
        @click="guess = ''"
      >
        <X class="size-7" />
      </Button>
    </div>
    <ScrollArea v-show="matchingGuesses.length > 0" class="!absolute h-60 rounded-b-md border bg-gradient bg-fixed md:h-80">
      <SearchInputOption
        v-for="displayedGuess of matchingGuesses"
        :key="displayedGuess.id"
        :selected="selectedGuess === displayedGuess"
        :displayed-guess="displayedGuess"
        @click="handleOptionClick"
      />
      <ScrollBar class="text-primary" />
    </ScrollArea>
  </div>
</template>
