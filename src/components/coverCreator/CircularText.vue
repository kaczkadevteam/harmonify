<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

export interface CurvedText {
  value: string
  offsetCorrection?: number
}

export interface CircularTextProps {
  centerX: number
  centerY: number
  radius: number
  size: number
  fontSize: number
  text: CurvedText
  pathId: string
}

const props = defineProps<CircularTextProps>()

const offsetToCenterTopOfCircle = computed(() => (Math.PI * 2 * props.radius) / 4)
const offsetTextToBeInTheMiddle = computed(() => (offsetToCenterTopOfCircle.value - props.text.value.length * props.fontSize / 3.7) + (props.text.offsetCorrection ?? 0) * props.size / 800)
const textPathRef = ref<SVGTextPathElement | null>(null)

watchEffect(() => {
  if (textPathRef.value)
    textPathRef.value.startOffset.baseVal.value = offsetToCenterTopOfCircle.value - textPathRef.value.textLength.baseVal.value / 2
})
</script>

<template>
  <svg v-bind="props" class="size-full" :viewBox="`0 0 ${size} ${size}`" xmlns="http://www.w3.org/2000/svg">
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
