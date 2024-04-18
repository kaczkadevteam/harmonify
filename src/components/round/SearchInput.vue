<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import SearchInputOption from './searchInput/SearchInputOption.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Track } from '@/types'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const props = defineProps<{
  tracks: Track[]
}>()

const guess = defineModel<string>({ required: true })

const selectedTrack = ref<Track>()
const focused = ref(false)

const matchingTracks = computed(() => {
  let exactMatchFound = false
  let matchingTracks = props.tracks.filter((track) => {
    if (track.guess == null)
      return false
    if (guess.value === '')
      return false
    if (track.guess === guess.value) {
      exactMatchFound = true
      return false
    }

    return track.guess.toLowerCase().includes(guess.value.toLowerCase())
  })
  if (exactMatchFound)
    matchingTracks = []

  return matchingTracks
})

watchEffect(() => {
  /**
   * Select the first track on the list if a selected track no longer matches the query and there are still tracks that do match the query
   */
  if (selectedTrack.value && !matchingTracks.value.includes(selectedTrack.value) && matchingTracks.value.length !== 0)
    selectedTrack.value = matchingTracks.value[0]
})

function handleSelectionMovement(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()

    if (selectedTrack.value === undefined) {
      selectedTrack.value = matchingTracks.value[0]
    }
    else if (
      event.key === 'ArrowDown'
      && selectedTrack.value !== undefined
      && matchingTracks.value.indexOf(selectedTrack.value)
      < matchingTracks.value.length - 1
    ) {
      const newIndex = matchingTracks.value.indexOf(selectedTrack.value) + 1
      selectedTrack.value = matchingTracks.value[newIndex]
    }
    else if (
      event.key === 'ArrowUp'
      && selectedTrack.value !== undefined
      && matchingTracks.value.indexOf(selectedTrack.value) > 0
    ) {
      const newIndex = matchingTracks.value.indexOf(selectedTrack.value) - 1
      selectedTrack.value = matchingTracks.value[newIndex]
    }
  }
}

function handleSelectionInput(event: KeyboardEvent) {
  if (event.key === 'Enter' && selectedTrack.value !== undefined && focused.value && matchingTracks.value.length !== 0) {
    event.preventDefault()
    guess.value = selectedTrack.value.guess ?? ''
  }
}

watchEffect(() => {
  if (matchingTracks.value.length > 0 && focused.value) {
    window.addEventListener('keydown', handleSelectionMovement)
    window.addEventListener('keydown', handleSelectionInput)

    return () => {
      window.removeEventListener('keydown', handleSelectionMovement)
      window.removeEventListener('keydown', handleSelectionInput)
    }
  }
})

function handleOptionClick(_guess: string) {
  guess.value = _guess
}
</script>

<template>
  <div class="relative w-80 ">
    <Input
      id="searchInput"
      v-model="guess"
      :class="cn(`focus-visible:ring-0 focus-visible:ring-offset-0 box-border text-lg h-12`, matchingTracks.length > 0 && 'rounded-b-none border-b-0')"
      placeholder="Guess"
      type="text"
      name="guess"
      autocomplete="off"
      @focus="focused = true"
      @blur="focused = false"
    />
    <ScrollArea v-show="matchingTracks.length > 0" class="!absolute h-80 rounded-b-md border bg-gradient bg-fixed">
      <SearchInputOption
        v-for="track of matchingTracks"
        :key="track.uri"
        :selected="selectedTrack === track"
        :track="track"
        @click="handleOptionClick"
      />
      <ScrollBar class="text-primary" />
    </ScrollArea>
  </div>
</template>
