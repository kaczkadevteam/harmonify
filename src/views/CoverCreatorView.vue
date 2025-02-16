<script setup lang="ts">
import { ref } from 'vue'
import { COVERS } from '@/consts'
import Cover from '@/components/coverCreator/Cover.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const size = 800
const cssSize = `${size}px`

const covers = Object.entries(COVERS).map(([key, value]) => {
  return {
    name: key,
    color: {
      hue: value.hue,
      saturation: value.saturation,
      lightness: value.lightness,
    },
    title: {
      value: value.title,
      offsetCorrection: value.titleOffset,
    },
    subtitle: {
      value: value.subtitle,
      offsetCorrection: value.subtitleOffset,
    },
    example: {
      value: value.example,
      offsetCorrection: value.exampleOffset,
    },
  }
})

const currentCover = ref(covers[0])

function setCover(index: number) {
  currentCover.value = covers[index]
}
</script>

<template>
  <div class="p-4">
    <ScrollArea class="w-full">
      <div class="flex gap-2 py-1">
        <Cover
          v-for="cover, idx of covers"
          :key="idx"
          :size="100"
          :base-color="cover.color"
          :title="cover.title"
          :subtitle="cover.subtitle"
          :example="cover.example"
          @click="setCover(idx)"
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
    <div :class="`grid w-[${cssSize}] *:col-start-1 *:row-start-1`">
      <Cover
        :size
        :base-color="currentCover.color"
        :title="currentCover.title"
        :subtitle="currentCover.subtitle"
        :example="currentCover.example"
      />
    </div>
  </div>
</template>
