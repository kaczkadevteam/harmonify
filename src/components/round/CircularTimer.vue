<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  x: number
  xMax: number
}>()

const fillPercentage = computed(() => {
  return `${Math.floor(((props.xMax - props.x) / props.xMax) * 100)}%`
})
</script>

<template>
  <div class="circle-background grid size-12 place-items-center rounded-full border-8 border-transparent text-xl text-primary">
    {{ x }}
  </div>
</template>

<style scoped>
.circle-background {
  background:
    var(--gradient-background) fixed content-box no-repeat,
    conic-gradient(transparent v-bind(fillPercentage), 0, hsl(var(--primary))) border-box;
}
</style>
