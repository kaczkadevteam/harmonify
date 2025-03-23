<script setup lang="ts">
import Cover from '@/components/coverCreator/Cover.vue'
import CoversSheet from '@/components/coverCreator/CoversSheet.vue'
import { Button } from '@/components/ui/button'
import { Input as CNInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { COVERS } from '@/consts'
import { unrefElement } from '@vueuse/core'
import convert from 'color-convert'
import { toBlob } from 'html-to-image'
import { ArrowLeft, Clipboard, Save } from 'lucide-vue-next'
import { ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'

const covers = Object.entries(COVERS).map(([key, value]) => {
  return {
    name: key,
    color: `#${convert.hsl.hex(value.hue, value.saturation, value.lightness)}`,
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
    type: {
      value: 'MOVIES',
      offsetCorrection: -10,
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
      <div>
        <Label>Type</Label>
        <CNInput v-model="cover.type.value" />
      </div>
    </form>
  </div>
</template>
