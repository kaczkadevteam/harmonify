<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useConnectionStore } from '@/stores'
import { X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const connectionStore = useConnectionStore()
const isAlertOpen = ref(false)

function handleClick() {
  if (router.currentRoute.value.name === 'setup' || router.currentRoute.value.name === 'result')
    quitGame()
  else
    isAlertOpen.value = true
}

function quitGame() {
  if (connectionStore.ws)
    connectionStore.sendMessage({ $type: 'message', type: 'quitGame' })

  if (router.currentRoute.value.name === 'result')
    router.push({ name: 'home' })
}
</script>

<template>
  <Button variant="ghost" size="icon" @click="handleClick">
    <X />
  </Button>
  <AlertDialog v-model:open="isAlertOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to quit game early?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="quitGame">
          Quit
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
