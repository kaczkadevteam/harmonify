<script setup lang="ts">
import { ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import Input from '@/components/ui/input/Input.vue'
import { useConnectionStore, useGameDataStore } from '@/stores'
import { useToast } from '@/components/ui/toast/use-toast'
import { playerDtoSchema } from '@/types'

const props = defineProps<{
  nickname: string
}>()

const connectionStore = useConnectionStore()
const gameDataStore = useGameDataStore()

const { toast } = useToast()
const nickname = ref(props.nickname)

watch(() => props.nickname, (newNickname) => {
  nickname.value = newNickname
})

watchDebounced(nickname, () => {
  const result = playerDtoSchema.shape.nickname.safeParse(nickname.value)

  if (!result.success) {
    nickname.value = gameDataStore.selfPlayer.nickname
    toast({
      title: 'Couldn\'t change nickname',
      description: result.error.errors[0].message,
      variant: 'destructive',
    })
    return
  }

  connectionStore.sendMessage({
    $type: 'message/string',
    type: 'changeName',
    data: nickname.value,
  })
}, { debounce: 400, maxWait: 1600 })
</script>

<template>
  <Input v-model:model-value="nickname" />
</template>
