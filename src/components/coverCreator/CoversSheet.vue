<script setup lang="ts">
import type { Cover as CoverType } from '@/types/'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCoversStore } from '@/stores'
import { Folder, Trash } from 'lucide-vue-next'
import Cover from './Cover.vue'

const emit = defineEmits<{
  (e: 'coverClick', selectedCover: CoverType): void
}>()

const coversStore = useCoversStore()

function deleteCover(deletedCover: CoverType) {
  coversStore.savedCovers = coversStore.savedCovers.filter(cover => cover.id !== deletedCover.id)
  deletedCover.id = undefined
}
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button variant="ghost" size="icon" type="button">
        <Folder />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Saved covers</SheetTitle>
      </SheetHeader>
      <ScrollArea class="mt-2 h-full pr-1">
        <div class="grid grid-cols-2 gap-4 px-1">
          <div v-for="cover, idx of coversStore.savedCovers" :key="idx" class="relative grid w-full gap-1 text-center">
            <Cover
              class="hover:outline hover:outline-1"
              :base-color="cover.color"
              bottom-color="#18181b"
              :title="cover.title"
              :subtitle="cover.subtitle"
              :example="cover.example"
              :type="cover.type"
              @click="emit('coverClick', cover)"
            />
            <div class="h-7 max-w-[50%] justify-self-center overflow-hidden">
              {{ cover.name }}
            </div>
            <Button size="icon" variant="ghost" class="absolute bottom-0 right-0 size-1/5" @click="deleteCover(cover)">
              <Trash />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
