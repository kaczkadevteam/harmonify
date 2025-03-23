<script setup lang="ts">
import type { Cover as CoverType } from '../types/'
import Cover from '@/components/coverCreator/Cover.vue'
import CoversSheet from '@/components/coverCreator/CoversSheet.vue'
import CurvedTextForm from '@/components/coverCreator/CurvedTextForm.vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { COVERS } from '@/consts'
import { unrefElement } from '@vueuse/core'
import convert from 'color-convert'
import { toBlob } from 'html-to-image'
import { ArrowLeft, Clipboard, Save } from 'lucide-vue-next'
import { ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'

const covers = Object.entries(COVERS).map<CoverType>(([key, value]) => {
  return {
    name: key,
    color: `#${convert.hsl.hex(value.hue, value.saturation, value.lightness)}`,
    title: {
      value: value.title,
      fontSize: 0.1125,
      radius: 0.8125,
      offsetCorrection: 0,
    },
    subtitle: {
      value: value.subtitle,
      fontSize: 0.05,
      radius: 0.6,
      offsetCorrection: 0,
    },
    example: {
      value: value.example,
      fontSize: 0.045,
      radius: 0.35,
      offsetCorrection: 0,
    },
    type: {
      value: 'MOVIES',
      fontSize: 0.04,
      radius: 0.1,
      offsetCorrection: 0,
    },
  }
})

const cover = ref(covers[0])
const coverImage = useTemplateRef('coverImage')
const bottomColor = ref<string>('#18181b')

const { toast } = useToast()

function setCover(index: number) {
  cover.value = covers[index]
}

async function copyToClipboard() {
  if (!coverImage.value) {
    return
  }

  const blob = await toBlob(unrefElement(coverImage) as HTMLElement)
  if (!blob) {
    toast({
      variant: 'destructive',
      description: 'Could not copy, try again!',
    })
    return
  }

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
  toast({
    description: 'Cover copied to clipboard!',
  })
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
          ref="coverImage"
          :base-color="cover.color"
          :bottom-color="bottomColor"
          :title="cover.title"
          :subtitle="cover.subtitle"
          :example="cover.example"
          :type="cover.type"
        />
        <div class="grid content-start gap-2">
          <CoversSheet :covers="covers" @cover-click="setCover" />
          <Button variant="ghost" size="icon" type="button">
            <Save />
          </Button>
          <Button variant="ghost" size="icon" type="button" @click="copyToClipboard">
            <Clipboard />
          </Button>
        </div>
      </div>
    </div>
    <form class="mt-2 grid gap-2">
      <div class="flex gap-4">
        <div class="grid w-fit justify-center">
          <Label>Main color</Label>
          <input v-model="cover.color" type="color" class="w-full border-none bg-transparent">
        </div>
        <div class="grid w-fit justify-center">
          <Label>Bottom color</Label>
          <input v-model="bottomColor" type="color" class="w-full border-none bg-transparent">
        </div>
      </div>
      <CurvedTextForm v-model:model-value="cover.title" label="Title" />
      <CurvedTextForm v-model:model-value="cover.subtitle" label="Subtitle" />
      <CurvedTextForm v-model:model-value="cover.example" label="Example" />
      <CurvedTextForm v-model:model-value="cover.type" label="Type" />
    </form>
  </div>
</template>
