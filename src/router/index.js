import { createRouter, createWebHistory } from 'vue-router'
import Scrapbook from '@/components/Scrapbook.vue'
import HomeView from '@/views/HomeView.vue' // Impor komponen Home

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/scrapbook',
      name: 'scrapbook',
      component: Scrapbook,
    },
  ],
})

export default router // Ekspor router
