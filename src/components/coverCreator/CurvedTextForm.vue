<script setup lang="ts">
import type { CurvedText } from '@/types/'
import { Input as CNInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'

defineProps<{
  label: string
}>()
const curvedText = defineModel<CurvedText>({ required: true })
</script>

<template>
  <div class="grid gap-2">
    <Label>{{ label }}</Label>
    <CNInput v-model="curvedText.value" />
    <Label>Font size</Label>
    <NumberField
      v-model:model-value="curvedText.fontSize"
      class="flex"
      :min="-1"
      :step="0.01"
      :step-snapping="false"
      :max="1"
    >
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput class="rounded-r-none" />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <Label>Height</Label>
    <NumberField
      v-model:model-value="curvedText.radius"
      class="flex"
      :min="-1"
      :step="0.01"
      :step-snapping="false"
      :max="1"
    >
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput class="rounded-r-none" />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <Label>Side correction</Label>
    <NumberField
      v-model:model-value="curvedText.offsetCorrection"
      class="flex"
      :min="-1"
      :step="0.01"
      :step-snapping="false"
      :max="1"
    >
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput class="rounded-r-none" />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
</template>
