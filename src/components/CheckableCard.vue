<script setup lang="ts">
import { LucideImageOff } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineProps<{
  id: string
  title: string
  artType: 'image' | 'icon'
  src: string
  alt: string
}>()

const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <label :for="id">
    <div class="flex flex-col items-center gap-1 text-center font-semibold">
      <div :class="cn('box-border relative w-full aspect-square overflow-hidden border-4 border-solid border-transparent', checked && 'border-primary shadow-[0px_2px_16px_3px_rgba(245,190,11,0.33)]')">
        <img v-if="artType === 'image'" :src :alt class=" size-full object-contain transition-transform duration-300 hover:scale-105">
        <div v-else class=" grid h-full place-items-center">
          <LucideImageOff :size="60" />
        </div>
      </div>
      <span>{{ title }}</span>
      <input :id v-model="checked" hidden type="checkbox">
    </div>
  </label>
</template>
