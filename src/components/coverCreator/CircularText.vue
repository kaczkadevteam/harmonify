<script setup lang="ts">
import type { CurvedText } from '@/types/'
import { cn } from '@/lib/utils'
import { computed, ref, watchEffect } from 'vue'

export interface CircularTextProps {
  centerX: number
  centerY: number
  size: number
  text: CurvedText
  pathId: string
}

const props = defineProps<CircularTextProps>()

const fontSize = computed(() => props.text.fontSize * props.size)
const radius = computed(() => props.text.radius * props.size)
const offsetToCenterTopOfCircle = computed(() => (Math.PI * 2 * radius.value) / 4)
const offsetTextToBeInTheMiddle = computed(() => {
  const standard = offsetToCenterTopOfCircle.value - props.text.value.length * fontSize.value / 3.7
  return standard + standard * (props.text.offsetCorrection ?? 0)
})
const textPathRef = ref<SVGTextPathElement | null>(null)

watchEffect(() => {
  if (textPathRef.value)
    textPathRef.value.startOffset.baseVal.value = offsetToCenterTopOfCircle.value - textPathRef.value.textLength.baseVal.value / 2
})
</script>

<template>
  <svg v-bind="props" :class="cn('size-full', text.italic && 'italic')" :viewBox="`0 0 ${size} ${size}`" xmlns="http://www.w3.org/2000/svg">
    <path
      :id="`${pathId}`"
      fill="none"
      :d="`
        M ${centerX - radius}, ${centerY}
        a ${radius}, ${radius} 0 1, 1 ${2 * radius}, 0
        a ${radius}, ${radius} 0 1, 1 ${-2 * radius}, 0`"
    />
    <text id="text" fill="currentColor" :style="{ fontSize: `${fontSize}px` }">
      <textPath :id="`textPath${pathId}`" ref="textPathRef" :href="`#${pathId}`" :startOffset="offsetTextToBeInTheMiddle">{{ text.value }}</textPath>
    </text>
  </svg>
</template>
