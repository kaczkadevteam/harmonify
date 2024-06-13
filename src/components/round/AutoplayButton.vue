<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Repeat, Repeat1 } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSettingsStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import NoRepeat from '@/components/round/NoRepeat.vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const settingsStore = useSettingsStore()

const icon = computed(() => {
  switch (settingsStore.autoplay) {
    case 'always':
      return Repeat
    case 'once':
      return Repeat1
    default:
      return NoRepeat
  }
})

const tooltip = computed(() => {
  switch (settingsStore.autoplay) {
    case 'always':
      return 'Autoplay track always'
    case 'once':
      return 'Play track once at the start of round'
    default:
      return 'Don\'t play track automatically'
  }
})

function changeAutoplaySetting() {
  switch (settingsStore.autoplay) {
    case 'always':
      settingsStore.autoplay = 'once'
      break
    case 'once':
      settingsStore.autoplay = 'never'
      break
    case 'never':
      settingsStore.autoplay = 'always'
      break
  }
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button size="icon" variant="ghost" :class="cn('size-9 hover:bg-inherit', props.class)" @click="changeAutoplaySetting">
          <component :is="icon" class="size-full text-primary hover:text-primary/80" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ tooltip }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
