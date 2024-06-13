<script setup lang="ts">
import { computed, ref } from 'vue'
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-vue-next'
import { useElementHover } from '@vueuse/core'
import { useMusicPlayerStore } from '@/stores'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SCROLL_DELTA = -120
const VOLUME_CHANGE_ON_SCROLL_TICK = 0.05

const musicPlayerStore = useMusicPlayerStore()

const rootElement = ref<HTMLDivElement | null>(null)
const isHovered = useElementHover(rootElement)
const isSliderToggled = ref(false)

const isSliderVisible = computed(() => isHovered.value || isSliderToggled.value)
const volumeIcon = computed(() => {
  if (musicPlayerStore.volume === 0)
    return VolumeX
  else if (musicPlayerStore.volume < 0.25)
    return Volume
  else if (musicPlayerStore.volume < 0.75)
    return Volume1
  else
    return Volume2
})

function handleWheelScroll(e: WheelEvent) {
  const volumeDelta = (e.deltaY / SCROLL_DELTA) * VOLUME_CHANGE_ON_SCROLL_TICK
  const newVolume = Math.min(
    Math.max(musicPlayerStore.volume + volumeDelta, 0),
    1,
  )

  musicPlayerStore.setVolume(newVolume)
}

function handleVolumeChange(newValue?: number[]) {
  if (newValue?.[0] !== undefined)
    musicPlayerStore.setVolume(newValue[0])
}

function handleIconClick() {
  isSliderToggled.value = !isSliderToggled.value
}
</script>

<template>
  <div
    ref="rootElement"
    :class="cn('relative flex items-center text-primary', isSliderVisible && 'text-primary/80')"
    @wheel="handleWheelScroll"
  >
    <Button size="icon" variant="ghost" class="size-12 hover:bg-inherit hover:text-inherit">
      <component :is="volumeIcon" class="size-full" @click="handleIconClick" />
    </Button>
    <Transition
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-300"
      enter-from-class="opacity-0 -translate-x-2"
      leave-to-class="opacity-0 -translate-x-2"
    >
      <div v-show="isSliderVisible" class="relative">
        <Slider
          class="absolute inset-y-0 left-full ml-2 w-28"
          :model-value="[musicPlayerStore.volume]"
          :min="0"
          :max="1"
          :step="0.01"
          @update:model-value="handleVolumeChange"
        />
      </div>
    </Transition>
  </div>
</template>
