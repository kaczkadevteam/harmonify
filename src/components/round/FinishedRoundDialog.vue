<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { RoundFinishedDto } from '@/types'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  guess: string
  roundResult: RoundFinishedDto
}>()

const isOpen = defineModel<boolean>({ required: true })

const isFullyGuessed = computed(() => props.roundResult.roundResult.guess === props.guess)
const roundFinishedTitle = computed(() => isFullyGuessed.value ? 'Correct :)' : 'Incorrect :(')

function handleContinue() {
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent v-if="isOpen">
      <DialogHeader>
        <DialogTitle :class="cn('text-xl', isFullyGuessed ? 'text-green-600' : 'text-red-600')">
          {{ roundFinishedTitle }}
        </DialogTitle>
      </DialogHeader>
      <div class="mb-2 grid justify-items-center gap-1 text-center">
        <img :src="roundResult.track.album.images[0].url" alt="Album cover" width="200" height="200">
        <TrackDisplay :track="roundResult.track" />
        <div v-if="!isFullyGuessed" class="mt-4">
          <span class="mr-3">Your guess:</span>
          <GuessDisplay :guess />
        </div>
      </div>
      <DialogFooter class="flex items-center sm:justify-between">
        <div class="text-lg">
          <span>Points </span>
          <span>{{ `${roundResult.score - roundResult.roundResult.score} + ${roundResult.roundResult.score}` }}</span>
        </div>
        <Button autofocus @click="handleContinue">
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
