<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import { PinInput, PinInputGroup, PinInputInput } from '@/components/ui/pin-input'
import { Button } from '@/components/ui/button'
import { useConnectionStore, useGameDataStore } from '@/stores'
import { playerSchema } from '@/types'

const cookies = useCookies()
const connectionStore = useConnectionStore()
const gameDataStore = useGameDataStore()
const router = useRouter()

const isLogged = ref(!!cookies.get('access_token') || !!cookies.get('refresh_token'))
const roomId = ref<string[]>([])
const username = ref('')
const usernameError = ref('')
const isJoinRoomError = ref(false)

function joinRoom() {
  const room = roomId.value.join('')

  connectionStore.openConnection(`/game/${room}`, {
    handleOpen() {},
    handleError() {
      isJoinRoomError.value = true
    },
    handleMessage(message) {
      console.log(message)
    },
    handleClose() {},
  })
}

function createRoom() {
  const parseResult = playerSchema.shape.username.safeParse(username.value)
  if (!parseResult.success) {
    usernameError.value = parseResult.error.issues[0].message
    return
  }

  connectionStore.openConnection('/create', {
    handleOpen() {},
    handleError() {
      console.error('Couldn\'t establish connection with a server')
    },
    handleMessage(message) {
      if (message.$type === 'message/createdGameDto') {
        gameDataStore.createGame(message.data)
        router.push({ name: 'setup', params: { id: message.data.gameId } })
      }
    },
    handleClose() {},
  })
}

function connectToSpotify() {
  window.location.href = '/api/token/request'
}
</script>

<template>
  <div class="grid h-screen place-content-center place-items-center">
    <header class=" grid justify-items-center gap-5">
      <h1 class="flex items-center gap-5 text-8xl font-bold italic text-primary">
        <img src="@/assets/logo.png" alt="Logo" width="100">
        <span>Harmonify!</span>
      </h1>
    </header>
    <main class="mt-10 text-2xl font-bold">
      <div class="flex items-end gap-10">
        <form class="grid justify-items-center gap-5" @submit.prevent="joinRoom">
          <p v-if="isJoinRoomError" class="-mb-3 text-base font-normal text-destructive">
            No room with such id
          </p>
          <PinInput
            id="room-id"
            v-model="roomId"
            placeholder="○"
            @update:model-value="isJoinRoomError = false"
            @complete="joinRoom"
          >
            <PinInputGroup>
              <PinInputInput v-for="(id, index) in 4" :key="id" :index="index" required />
            </PinInputGroup>
          </PinInput>

          <Button>Join room</Button>
        </form>
        <form v-if="isLogged" class="grid justify-items-center gap-5" @submit.prevent="createRoom">
          <p v-if="usernameError" class="-mb-3 text-base font-normal text-destructive">
            {{ usernameError }}
          </p>
          <Input v-model="username" type="text" placeholder="Player name" required @focus="usernameError = ''" />
          <Button type="submit">
            Create room
          </Button>
        </form>
        <div v-else class="grid justify-items-center gap-4">
          <h3 class="flex w-56 flex-wrap items-center gap-x-3">
            <span class="text-lg font-semibold">Connect to</span>
            <img alt="Spotify logo" src="@/assets/Spotify_Logo_RGB_White.png" width="100">
            <span class="text-lg font-semibold">in order to create room</span>
          </h3>
          <Button @click="connectToSpotify">
            Connect
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>
