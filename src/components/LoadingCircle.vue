<script setup lang="ts">
const props = defineProps<{ size: string }>()
</script>

<template>
  <div
    class="animation size-[var(--size)] rounded-full border-[calc(var(--size)_*_0.2)] border-solid border-slate-100 border-t-sky-500"
    :style="`--size:${props.size}`"
  />
</template>

<style scoped>
.animation {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
