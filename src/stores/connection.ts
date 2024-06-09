import { defineStore } from 'pinia'
import { useGameDataStore } from '.'
import { type Message, messageSchema } from '@/types'

export const useConnectionStore = defineStore('connection', {
  state: (): {
    ws?: WebSocket
    handleOpen?: () => void
    handleMessage?: (message: Message) => void
    handleError?: (event: Event) => void
    handleClose?: () => void
    handleMessageWrapper?: (event: MessageEvent<string>) => void

  } => {
    return {}
  },
  actions: {
    openConnection(
      path: string,
      handlers: {
        handleOpen: () => void
        handleMessage: (message: Message) => void
        handleError: (event: Event) => void
        handleClose: () => void
      },
    ) {
      if (this.ws)
        this.ws.close()

      const gameDataStore = useGameDataStore()

      this.handleOpen = handlers.handleOpen
      this.handleMessage = handlers.handleMessage
      this.handleError = handlers.handleError
      this.handleClose = handlers.handleClose
      this.handleMessageWrapper = (event) => {
        const message = messageSchema.parse(JSON.parse(event.data))
        if (message.$type === 'message/playerList')
          gameDataStore.updatePlayersList(message.data)

        if (message.type === 'gamePaused')
          gameDataStore.isPaused = true

        if (message.type === 'gameResumed')
          gameDataStore.isPaused = false

        if (this.handleMessage)
          this.handleMessage(message)
      }

      this.ws = new WebSocket(`${import.meta.env.VITE_WEB_SOCKET_URL}${path}`)

      this.ws.addEventListener('error', this.handleError)
      this.ws.addEventListener('open', this.handleOpen)
      this.ws.addEventListener('message', this.handleMessageWrapper)
      this.ws.addEventListener('close', this.handleClose)
    },
    sendMessage(message: Message) {
      if (this.ws)
        this.ws.send(JSON.stringify(message))
    },
    clearHandlers() {
      if (this.handleError)
        this.ws?.removeEventListener('error', this.handleError)

      if (this.handleOpen)
        this.ws?.removeEventListener('open', this.handleOpen)

      if (this.handleMessage && this.handleMessageWrapper)
        this.ws?.removeEventListener('message', this.handleMessageWrapper)

      if (this.handleClose)
        this.ws?.removeEventListener('close', this.handleClose)
    },
  },
})
