import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      children: [
        {
          path: '',
          name: 'setup',
          component: () => import('@/views/game/SetupView.vue'),
        },
        {
          path: ':id',
          name: 'round',
          component: () => import(`@/views/game/RoundView.vue`),
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
