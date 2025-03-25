import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/auth/register',
    component: () => import ('@/views/AuthPages/RegisterPage.vue')
  },
  {
    path: '/auth/login',
    component: () => import ('@/views/AuthPages/LoginPage.vue')
  },
  {
    path: '/video/:id',
    component: () => import('@/views/VideoPage.vue')
  },
  {
    path: '/profile',
    component: () => import('@/views/ProfilePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
