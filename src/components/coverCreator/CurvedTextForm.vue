<script setup lang="ts">
import type { CurvedText } from '@/types/'
import { Input as CNInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Switch } from '@/components/ui/switch'

const curvedText = defineModel<CurvedText>({ required: true })
</script>

<template>
  <div class="grid gap-4">
    <CNInput v-model="curvedText.value" />
    <div class="grid gap-3 sm:grid-cols-[repeat(4,_minmax(0,12rem))] sm:justify-center">
      <div class="grid gap-2">
        <Label>Font size</Label>
        <NumberField
          v-model:model-value="curvedText.fontSize"
          class="flex min-w-32"
          :min="-1"
          :step="0.01"
          :step-snapping="false"
          :max="1"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="grid gap-2">
        <Label>Height</Label>
        <NumberField
          v-model:model-value="curvedText.radius"
          class="flex min-w-32"
          :min="-1"
          :step="0.01"
          :step-snapping="false"
          :max="1"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="grid gap-2">
        <Label>Side correction</Label>
        <NumberField
          v-model:model-value="curvedText.offsetCorrection"
          class="flex min-w-32"
          :min="-1"
          :step="0.01"
          :step-snapping="false"
          :max="1"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="grid gap-2">
        <Label>Italic</Label>
        <Switch v-model:model-value="curvedText.italic" />
      </div>
    </div>
  </div>
</template>
