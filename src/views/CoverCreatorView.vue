<script setup lang="ts">
import type { Cover as CoverType } from '../types/'
import ColorInput from '@/components/coverCreator/ColorInput.vue'
import Cover from '@/components/coverCreator/Cover.vue'
import CoversSheet from '@/components/coverCreator/CoversSheet.vue'
import CurvedTextForm from '@/components/coverCreator/CurvedTextForm.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { DEFAULT_COVER } from '@/consts'
import { useCoversStore } from '@/stores'
import { unrefElement } from '@vueuse/core'
import { saveAs } from 'file-saver'
import { toBlob } from 'html-to-image'
import { ArrowLeft, Clipboard, CopyPlus, Download, Save } from 'lucide-vue-next'
import { ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'

const cover = ref<CoverType>(DEFAULT_COVER)
const coverImage = useTemplateRef('coverImage')
const bottomColor = ref<string>('#18181b')
const coversStore = useCoversStore()

const { toast } = useToast()

function setCover(selectedCover: CoverType) {
  cover.value = selectedCover
}

async function copyToClipboard() {
  const blob = await getCoverBlob()

  if (!blob) {
    toast({
      variant: 'destructive',
      description: 'Could not copy, try again!',
    })
    return
  }

  await navigator.clipboard.write([
    new ClipboardItem({ [blob.type]: blob }),
  ])
  toast({
    description: 'Cover copied to clipboard!',
  })
}

async function download() {
  const blob = await getCoverBlob()

  if (!blob) {
    toast({
      variant: 'destructive',
      description: 'Could not download, try again!',
    })
    return
  }

  const name = getCoverNameOrDefault(cover.value)

  saveAs(blob, `${name}.png`)
}

function save() {
  let duplicated = false
  if (cover.value.id) {
    cover.value = JSON.parse(JSON.stringify(cover.value)) as CoverType
    duplicated = true
  }

  cover.value.id = crypto.randomUUID()
  if (!cover.value.name) {
    cover.value.name = getCoverNameOrDefault(cover.value)
  }

  coversStore.savedCovers.push(cover.value)

  toast({
    description: duplicated ? 'Succesfully duplicated cover!' : 'Succesfully saved cover!',
  })
}

function getCoverNameOrDefault(cover: CoverType) {
  return cover.name ? cover.name : `${cover.title.value}_${cover.subtitle.value}_${cover.example.value}`
}

async function getCoverBlob() {
  if (!coverImage.value) {
    return undefined
  }

  return await toBlob(unrefElement(coverImage) as HTMLElement)
}
</script>

<template>
  <div class="grid justify-items-center">
    <div class="relative w-full max-w-[1260px] p-4 pt-0">
      <div class="sticky top-0 z-10 grid justify-center bg-gradient bg-fixed py-2">
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
            <CoversSheet @cover-click="setCover" />
            <Button variant="ghost" size="icon" type="button" @click="save">
              <CopyPlus v-if="cover.id" />
              <Save v-else />
            </Button>
            <Button variant="ghost" size="icon" type="button" @click="copyToClipboard">
              <Clipboard />
            </Button>
            <Button variant="ghost" size="icon" type="button" @click="download">
              <Download />
            </Button>
          </div>
        </div>
      </div>
      <form class="grid gap-2">
        <div class="mt-1 grid w-[300px] gap-1 justify-self-center text-center">
          <Label>Name</Label>
          <Input v-model:model-value="cover.name" />
        </div>
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
