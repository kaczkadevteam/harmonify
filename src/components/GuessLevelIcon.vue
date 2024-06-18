<script setup lang="ts">
import { toRefs } from '@vueuse/core'
import { type HTMLAttributes, computed } from 'vue'
import { CircleCheck, CircleMinus, CircleX, ShieldQuestion, Unplug } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { GuessLevel } from '@/types'

const props = defineProps<{
  guessLevel: GuessLevel
  class?: HTMLAttributes['class']
}>()

const [icon, color, message] = toRefs(computed(() => {
  switch (props.guessLevel) {
    case 'full':
      return [CircleCheck, 'text-green-500', 'Guessed track']
    case 'album':
      return [CircleMinus, 'text-yellow-500', 'Guessed album']
    case 'artist':
      return [CircleMinus, 'text-yellow-500', 'Guessed artist']
    case 'none':
      return [CircleX, 'text-red-500', 'Incorrect guess']
    case 'disconnected':
      return [Unplug, 'text-gray-500', 'Player is not connected']
    default:
      return [ShieldQuestion, 'text-purple-500', 'Unknown status']
  }
}))
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <component :is="icon" :class="cn('min-w-4 min-h-4 w-4 h-4 cursor-default', color, props.class)" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ message }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
