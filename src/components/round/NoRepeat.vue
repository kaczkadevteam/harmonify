<script setup lang="ts">
import { Repeat, Slash } from 'lucide-vue-next'
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-1 place-content-stretch place-items-stretch">
    <Repeat class="col-start-1 col-end-2 row-start-1 row-end-2 size-full" />
    <Slash class="col-start-1 col-end-2 row-start-1 row-end-2 size-full rotate-90 p-0.5" />
  </div>
</template>
