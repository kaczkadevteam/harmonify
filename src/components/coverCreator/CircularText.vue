<script setup lang="ts">
import { type SVGAttributes, computed, ref, watchEffect } from 'vue'

export interface CircularTextProps extends SVGAttributes {
  centerX: number
  centerY: number
  radius: number
  size: number
  fontSize: number
  offsetCorrection?: number
  text: string
  id: string
}

const props = defineProps<CircularTextProps>()

const sizeCSS = computed(() => `${props.size}px`)
const offsetToCenterTopOfCircle = computed(() => (Math.PI * 2 * props.radius) / 4)
const offsetTextToBeInTheMiddle = computed(() => (offsetToCenterTopOfCircle.value - props.text.length * props.fontSize / 3.7) + (props.offsetCorrection ?? 0))
const textPathRef = ref<SVGTextPathElement | null>(null)

watchEffect(() => {
  if (textPathRef.value)
    textPathRef.value.startOffset.baseVal.value = offsetToCenterTopOfCircle.value - textPathRef.value.textLength.baseVal.value / 2
})
</script>

<template>
  <svg v-bind="props" :style="{ width: sizeCSS, height: sizeCSS }" :viewBox="`0 0 ${size} ${size}`" xmlns="http://www.w3.org/2000/svg">
    <path
      :id="id"
      fill="none"
      :d="`
        M ${centerX - radius}, ${centerY}
        a ${radius}, ${radius} 0 1, 1 ${2 * radius}, 0
        a ${radius}, ${radius} 0 1, 1 ${-2 * radius}, 0`"
    />
    <text id="text" :fontSize="fontSize" fill="currentColor">
      <textPath id="textPath" ref="textPathRef" :href="`#${id}`" :startOffset="offsetTextToBeInTheMiddle">{{ text }}</textPath>
    </text>
  </svg>
</template>
