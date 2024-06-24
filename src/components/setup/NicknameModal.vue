<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useConnectionStore, useGameDataStore } from '@/stores'
import { nicknameSchema } from '@/types'
import { LOCAL_STORAGE } from '@/consts'
import { Button } from '@/components/ui/button'

const connectionStore = useConnectionStore()
const gameDataStore = useGameDataStore()

const model = defineModel<boolean>('open')
const localNickname = ref(gameDataStore.selfPlayer.nickname)
const error = ref('')

onMounted(() => {
  localNickname.value = localStorage.getItem(LOCAL_STORAGE.NICKNAME) ?? localNickname.value
  if (isCorrect())
    return

  localNickname.value = gameDataStore.selfPlayer.nickname
  error.value = ''
})

function isCorrect() {
  const result = nicknameSchema.safeParse(localNickname.value)

  if (!result.success) {
    error.value = result.error.errors[0].message
    return false
  }

  if (gameDataStore.players.some(p => p.nickname === localNickname.value && p.guid !== gameDataStore.selfPlayer.guid)) {
    error.value = 'Nicknames must be unique'
    return false
  }

  error.value = ''
  return true
}

function tryUpdateNickname() {
  if (!isCorrect())
    return

  if (localNickname.value === gameDataStore.selfPlayer.nickname) {
    model.value = false
    return
  }

  connectionStore.sendMessage({
    $type: 'message/string',
    type: 'changeName',
    data: localNickname.value,
  })

  model.value = false
}
</script>

<template>
  <AlertDialog v-model:open="model">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Set player name</AlertDialogTitle>
      </AlertDialogHeader>
      <div class="grid">
        <p v-if="error" class="text-base font-normal text-destructive">
          {{ error }}
        </p>
        <Input v-model:model-value="localNickname" />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button type="button" variant="outline" @click="tryUpdateNickname">
          Save
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
