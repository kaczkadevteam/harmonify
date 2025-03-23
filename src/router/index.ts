import type { RouteLocationNormalized } from 'vue-router'
import { useConnectionStore, useGameDataStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/game',
      component: () => import('@/views/GameLayout.vue'),
      beforeEnter: beforeGameEnter,
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
    {
      path: '/cover',
      name: 'cover',
      component: () => import(`@/views/CoverCreatorView.vue`),
    },
    {
      path: '/disclaimer',
      name: 'disclaimer',
      component: () => import(`@/views/DisclaimerView.vue`),
    },
  ],
})

async function beforeGameEnter(to: RouteLocationNormalized) {
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
      })
    })

    return { name: 'setup', params: to.params }
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e) {
    return { name: 'home' }
  }
}

export default router
