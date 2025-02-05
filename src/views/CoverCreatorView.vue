<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import type { COVERS_KEYS } from '@/consts'
import { COVERS } from '@/consts'
import Cover from '@/components/coverCreator/Cover.vue'

const size = 800
const cssSize = `${size}px`
const centerX = size / 2
const centerY = size

const currentTrackIndex = ref(1)
const currentTrack = computed(() => {
  const keys = Object.keys(COVERS) as COVERS_KEYS[]
  const track = COVERS[keys[currentTrackIndex.value]]
  return {
    color: {
      hue: track.hue,
      saturation: track.saturation,
      lightness: track.lightness,
    },
    title: {
      value: track.title,
      offsetCorrection: track.titleOffset,
    },
    subtitle: {
      value: track.subtitle,
      offsetCorrection: track.subtitleOffset,
    },
    example: {
      value: track.example,
      offsetCorrection: track.exampleOffset,
    },
  }
})

function selectNextCover() {
  if (currentTrackIndex.value === Object.keys(COVERS).length - 1)
    currentTrackIndex.value = 0
  else
    currentTrackIndex.value++
}

function selectPrevCover() {
  if (currentTrackIndex.value === 0)
    currentTrackIndex.value = Object.keys(COVERS).length - 1
  else
    currentTrackIndex.value--
}
</script>

<template>
  <div :class="`grid w-[${cssSize}] *:col-start-1 *:row-start-1`">
    <Cover
      :base-color="currentTrack.color"
      :size
      :center-x
      :center-y
      :title="currentTrack.title"
      :subtitle="currentTrack.subtitle"
      :example="currentTrack.example"
    />
    <div class="grid w-20 cursor-pointer place-items-center bg-black/60 opacity-0 transition-all duration-300 hover:opacity-100" @click="selectPrevCover">
      <ChevronLeft class="size-10" />
    </div>
    <div class="grid w-20 cursor-pointer place-items-center justify-self-end bg-black/60 opacity-0 transition-all duration-300 hover:opacity-100" @click="selectNextCover">
      <ChevronRight class="size-10" />
    </div>
  </div>
</template>
