<script setup lang="ts">
import { computed, ref } from 'vue'
import { COVERS } from '@/consts'
import Cover from '@/components/coverCreator/Cover.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'

const sizes = ref([200])
const size = computed(() => sizes.value[0])

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
      offsetCorrection: (value.titleOffset ?? 0) * size.value / 800, // TODO: make offset value 0 to 1, or -1 to 1 and multiply it by size
    },
    subtitle: {
      value: value.subtitle,
      offsetCorrection: (value.titleOffset ?? 0) * size.value / 800,
    },
    example: {
      value: value.example,
      offsetCorrection: (value.exampleOffset ?? 0) * size.value / 800,
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
          :base-color="cover.color"
          :title="cover.title"
          :subtitle="cover.subtitle"
          :example="cover.example"
          @click="setCover(idx)"
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
    <div class="grid *:col-start-1 *:row-start-1" :style="{ width: `${size}px`, height: `${size}px` }">
      <Cover
        :base-color="currentCover.color"
        :title="currentCover.title"
        :subtitle="currentCover.subtitle"
        :example="currentCover.example"
      />
    </div>
    <Slider v-model:model-value="sizes" :min="200" :max="1000" :step="5" />
  </div>
</template>
