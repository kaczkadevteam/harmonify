<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { Track } from '@/types'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GuessDisplay, TrackDisplay } from '@/components/trackDisplay'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  selectedTrack: Track
  guess: string
  isFullyGuessed: boolean
  points: number
  pointsForRound: number
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const roundFinishedTitle = computed(() => props.isFullyGuessed ? 'Correct :)' : 'Incorrect :(')
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent v-if="isOpen">
      <DialogHeader>
        <DialogTitle :class="cn(isFullyGuessed ? 'text-green-600' : 'text-red-600')">
          {{ roundFinishedTitle }}
        </DialogTitle>
      </DialogHeader>
      <div>
        <img :src="selectedTrack.album.images[0].url" alt="Album cover" width="200" height="200">
        <TrackDisplay :track="selectedTrack" />
        <span v-if="!isFullyGuessed">
          <span>Your guess: </span>
          <GuessDisplay :guess="guess" />

        </span>
        <span>
          <span>Points </span>
          <span>{{ `${points} + ${pointsForRound}` }}</span>
        </span>
      </div>
      <DialogFooter>
        <Button autofocus @click="isOpen = false">
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
