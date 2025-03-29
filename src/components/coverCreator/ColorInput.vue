<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Input as CNInput } from '../ui/input'

const model = defineModel<string>()
const input = useTemplateRef('input')
</script>

<template>
  <div class="grid">
    <div :style="{ backgroundColor: model }" class="h-5 rounded-t-md border border-b-0" @click="input?.click()" />
    <input ref="input" v-model="model" type="color" class="invisible size-0">
    <CNInput v-model:model-value="model" class="h-6 w-24 rounded-t-none border-t-0 text-center" />
  </div>
</template>
