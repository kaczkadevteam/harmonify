<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { Copy } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'

const route = useRoute()

const { copy } = useClipboard()
const { toast } = useToast()

function copyId() {
  copy(new URL(route.fullPath, window.location.origin).href)
  toast({ description: 'Room URL copied to clipboard!' })
}
</script>

<template>
  <div class="ml-2 flex items-center gap-3">
    <span>
      Room: {{ route.params.id }}
    </span>
    <Button v-if="route.name === 'setup'" variant="ghost" size="icon">
      <Copy @click="copyId" />
    </Button>
  </div>
</template>
