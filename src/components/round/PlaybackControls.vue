<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import VolumeInput from './VolumeInput.vue'
import { Button } from '@/components/ui/button'

defineProps<{
  isPlaying: boolean
}>()
</script>

<template>
  <div class="relative">
    <!-- eslint-disable-next-line tailwindcss/no-contradicting-classname -->
    <Button id="playbackButton" class="h-20 w-32 rounded-xl bg-[linear-gradient(0.25turn,#1b3162_49%,50%,transparent)] bg-[length:200%_200%] bg-[position:100%_0]">
      <Pause v-if="isPlaying" class="size-12" />
      <Play v-else class="size-12" />
    </Button>
    <VolumeInput class="absolute inset-y-0 left-full p-4" />
  </div>
</template>
