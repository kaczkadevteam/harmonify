import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useConnectionStore, useGameDataStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/game',
      component: () => import('@/views/GameLayout.vue'),
      beforeEnter: async (to) => {
        const connectionStore = useConnectionStore()

        if (connectionStore.ws)
          return

        const gameDataStore = useGameDataStore()
        const roomId = to.params.id.toString()

        try {
          await new Promise<void>((resolve, reject) => {
            connectionStore.openConnection(`/game/${roomId}`, {
              handleOpen() {},
              handleError() {
                reject(new Error('Couldn\'t connect to server'))
              },
              handleMessage(message) {
                if (message.$type === 'message/playerInfoDto') {
                  gameDataStore.joinGame(roomId, message.data)
                  resolve()
                }
              },
              handleClose() {},
            })
          })

          return { name: 'setup', params: to.params }
        }
        catch (e) {
          return { name: 'home' }
        }
      },
      children: [
        {
          path: ':id/setup',
          name: 'setup',
          component: () => import('@/views/game/SetupView.vue'),

        },
        {
          path: ':id',
          name: 'round',
          component: () => import(`@/views/game/RoundView.vue`),
        },
        {
          path: ':id/roundResult',
          name: 'roundResult',
          component: () => import(`@/views/game/RoundResultView.vue`),
        },
        {
          path: ':id/result',
          name: 'result',
          component: () => import(`@/views/game/ResultView.vue`),
        },
      ],
    },
  ],
})

export default router
