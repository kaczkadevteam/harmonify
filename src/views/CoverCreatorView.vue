<script setup lang="ts">
import { type InputHTMLAttributes, computed, ref } from 'vue'
import { ArrowLeft, Clipboard, Folder, Save } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import convert from 'color-convert'
import { COVERS } from '@/consts'
import Cover from '@/components/coverCreator/Cover.vue'
import { Button } from '@/components/ui/button'
import CoversSheet from '@/components/coverCreator/CoversSheet.vue'
import { Input as CNInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      offsetCorrection: (value.titleOffset ?? 0), // TODO: make offset value 0 to 1, or -1 to 1 and multiply it by size
    },
    subtitle: {
      value: value.subtitle,
      offsetCorrection: (value.titleOffset ?? 0),
    },
    example: {
      value: value.example,
      offsetCorrection: (value.exampleOffset ?? 0),
    },
  }
})

const cover = ref(covers[0])
const coverColorHex = computed(() => {
  const hslColor = cover.value.color
  return `#${convert.hsl.hex(hslColor.hue, hslColor.saturation, hslColor.lightness)}`
})

function onColorChange(event: Event) {
  const hex = (event.target as InputHTMLAttributes).value
  const [hue, saturation, lightness] = convert.hex.hsl(hex)
  cover.value.color.hue = hue
  cover.value.color.saturation = saturation
  cover.value.color.lightness = lightness
}

function setCover(index: number) {
  cover.value = covers[index]
}
</script>

<template>
  <div class="p-4">
    <div class="grid">
      <div class="flex gap-2">
        <div>
          <Button variant="ghost" size="icon" as-child>
            <RouterLink :to="{ name: 'home' }">
              <ArrowLeft class="w-7" />
            </RouterLink>
          </Button>
        </div>
        <Cover
          :base-color="cover.color"
          :title="cover.title"
          :subtitle="cover.subtitle"
          :example="cover.example"
        />
        <div class="grid content-start gap-2">
          <CoversSheet :covers="covers" @cover-click="setCover" />
          <Button variant="ghost" size="icon" type="button">
            <Save />
          </Button>
          <Button variant="ghost" size="icon" type="button">
            <Clipboard />
          </Button>
        </div>
      </div>
    </div>
    <form class="mt-2 grid gap-2">
      <div class="grid w-fit justify-center">
        <Label>Main color</Label>
        <input type="color" class="w-full border-none bg-transparent" :value="coverColorHex" @input="onColorChange">
      </div>
      <div>
        <Label>Title</Label>
        <CNInput v-model="cover.title.value" />
      </div>
      <div>
        <Label>Subtitle</Label>
        <CNInput v-model="cover.subtitle.value" />
      </div>
      <div>
        <Label>Example</Label>
        <CNInput v-model="cover.example.value" />
      </div>
    </form>
  </div>
</template>
