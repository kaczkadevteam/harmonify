<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStorage, watchDebounced } from '@vueuse/core'
import Input from '@/components/ui/input/Input.vue'
import { useConnectionStore, useGameDataStore } from '@/stores'
import { useToast } from '@/components/ui/toast/use-toast'
import { nicknameSchema } from '@/types'
import { LOCAL_STORAGE } from '@/consts'

const props = defineProps<{
  nickname: string
}>()

const connectionStore = useConnectionStore()
const gameDataStore = useGameDataStore()

const { toast } = useToast()
const nickname = ref(props.nickname)

watch(() => props.nickname, (newNickname) => {
  nickname.value = newNickname
  localStorage.setItem(LOCAL_STORAGE.NICKNAME, newNickname)
})

onMounted(() => {
  nickname.value = localStorage.getItem(LOCAL_STORAGE.NICKNAME) ?? nickname.value
})

watchDebounced(nickname, () => {
  if (nickname.value === props.nickname)
    return

  const result = nicknameSchema.safeParse(nickname.value)

  if (!result.success) {
    nickname.value = gameDataStore.selfPlayer.nickname
    toast({
      title: 'Couldn\'t change nickname',
      description: result.error.errors[0].message,
      variant: 'destructive',
    })
    return
  }

  if (gameDataStore.players.some(p => p.nickname === nickname.value)) {
    nickname.value = gameDataStore.selfPlayer.nickname
    toast({
      title: 'Couldn\'t change nickname',
      description: 'Nicknames must be unique',
      variant: 'destructive',
    })
    return
  }

  connectionStore.sendMessage({
    $type: 'message/string',
    type: 'changeName',
    data: nickname.value,
  })
}, { immediate: true, debounce: 400, maxWait: 1600 })
</script>

<template>
  <Input v-model:model-value="nickname" />
</template>
