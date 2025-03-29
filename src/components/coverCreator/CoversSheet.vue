<script setup lang="ts">
import type { Cover as CoverType } from '@/types/'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Folder } from 'lucide-vue-next'
import Cover from './Cover.vue'

defineProps<{
  covers: CoverType[]
}>()

const emit = defineEmits<{
  (e: 'coverClick', index: number): void
}>()
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
        <div class="grid grid-cols-2 gap-4">
          <Cover
            v-for="cover, idx of covers"
            :key="idx"
            :base-color="cover.color"
            bottom-color="#18181b"
            :title="cover.title"
            :subtitle="cover.subtitle"
            :example="cover.example"
            :type="cover.type"
            @click="emit('coverClick', idx)"
          />
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
