<script setup lang="ts">
import type { Cover as CoverType } from '../types/'
import ColorInput from '@/components/coverCreator/ColorInput.vue'
import Cover from '@/components/coverCreator/Cover.vue'
import CoversSheet from '@/components/coverCreator/CoversSheet.vue'
import CurvedTextForm from '@/components/coverCreator/CurvedTextForm.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
      italic: false,
    },
    subtitle: {
      value: value.subtitle,
      fontSize: 0.05,
      radius: 0.6,
      offsetCorrection: 0,
      italic: true,
    },
    example: {
      value: value.example,
      fontSize: 0.045,
      radius: 0.35,
      offsetCorrection: 0,
      italic: true,
    },
    type: {
      value: 'MOVIES',
      fontSize: 0.04,
      radius: 0.1,
      offsetCorrection: 0,
      italic: false,
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
  <div class="grid justify-items-center">
    <div class="relative w-full max-w-[1260px] p-4 pt-0">
      <div class="sticky top-0 z-10 grid justify-center bg-gradient bg-fixed py-4">
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
      <form class="grid gap-2">
        <div class="flex gap-4 justify-self-center text-center">
          <div class="grid w-fit justify-center gap-1">
            <Label>Main color</Label>
            <ColorInput v-model:model-value="cover.color" />
          </div>
          <div class="grid w-fit justify-center gap-1 ">
            <Label>Bottom color</Label>
            <ColorInput v-model:model-value="bottomColor" />
          </div>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="title">
            <AccordionTrigger>Title</AccordionTrigger>
            <AccordionContent class="pb-8">
              <CurvedTextForm v-model:model-value="cover.title" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="subtitle">
            <AccordionTrigger>Subtitle</AccordionTrigger>
            <AccordionContent>
              <CurvedTextForm v-model:model-value="cover.subtitle" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="example">
            <AccordionTrigger>Example</AccordionTrigger>
            <AccordionContent>
              <CurvedTextForm v-model:model-value="cover.example" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="type">
            <AccordionTrigger>Type</AccordionTrigger>
            <AccordionContent>
              <CurvedTextForm v-model:model-value="cover.type" label="Type" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  </div>
</template>
