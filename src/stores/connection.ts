import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', {
  state: (): {
    ws?: WebSocket
    handleOpen?: () => void
    handleMessage?: (message: unknown) => void
    handleError?: (event: Event) => void
    handleClose?: () => void
    handleMessageWrapper: (event: MessageEvent<string>) => void

  } => {
    return {
      handleMessageWrapper(event) {
        if (this.handleMessage)
          this.handleMessage(JSON.parse(event.data))
      },
    }
  },
  actions: {
    openConnection(
      path: string,
      handlers: {
        handleOpen: () => void
        handleMessage: (message: unknown) => void
        handleError: (event: Event) => void
        handleClose: () => void
      },
    ) {
      if (this.ws)
        this.ws.close()

      this.handleOpen = handlers.handleOpen
      this.handleMessage = handlers.handleMessage
      this.handleError = handlers.handleError
      this.handleClose = handlers.handleClose
      this.handleMessageWrapper = (event) => {
        if (this.handleMessage)
          this.handleMessage(JSON.parse(event.data))
      }

      this.ws = new WebSocket(`${import.meta.env.VITE_WEB_SOCKET_URL}${path}`)

      this.ws.addEventListener('error', this.handleError)
      this.ws.addEventListener('open', this.handleOpen)
      this.ws.addEventListener('message', this.handleMessageWrapper)
      this.ws.addEventListener('close', this.handleClose)
    },
    sendMessage(message: unknown) {
      if (this.ws)
        this.ws.send(JSON.stringify(message))
    },
    clearHandlers() {
      if (this.handleError)
        this.ws?.removeEventListener('error', this.handleError)

      if (this.handleOpen)
        this.ws?.removeEventListener('open', this.handleOpen)

      if (this.handleMessage)
        this.ws?.removeEventListener('message', this.handleMessageWrapper)

      if (this.handleClose)
        this.ws?.removeEventListener('close', this.handleClose)
    },
  },
})
