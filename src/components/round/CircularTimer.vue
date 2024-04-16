<script setup lang="ts">
defineProps<{
  x: number
  xMax: number
}>()

// bg-[var(--gradient-background)_fixed_content-box_no-repeat,conic-gradient(transparent_var(--percentage),0,hsl(var(--primary)))_border-box]
</script>

<template>
  <div
    :style="`--percentage: ${Math.floor(
      ((xMax - x) / xMax) * 100,
    )}%`"
    class="circle-background grid size-12 place-items-center rounded-full border-8 border-transparent text-xl text-primary"
  >
    {{ x }}
  </div>
</template>

<style scoped>
.circle-background {
  background:
    var(--gradient-background) fixed content-box no-repeat,
    conic-gradient(transparent var(--percentage), 0, hsl(var(--primary)))
      border-box;
}
</style>
