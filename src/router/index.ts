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
    path: '/multimedia/:id',
    component: () => import('@/views/MultimediaPage.vue')
  },
  {
    path: '/profile',
    component: () => import('@/views/ProfilePage.vue')
  },
  {
    path: '/videos/manage',
    component: () => import('@/views/VideosManagerCRUD/IndexPage.vue')
  },
  {
    path: '/videos/manage/show/:id',
    component: () => import('@/views/VideosManagerCRUD/ShowPage.vue')
  },
  {
    path: '/videos/manage/create',
    component: () => import('@/views/VideosManagerCRUD/CreatePage.vue')
  },
  {
    path: '/videos/manage/edit/:id',
    component: () => import('@/views/VideosManagerCRUD/EditPage.vue')
  },
  {
    path: '/videos/manage/delete/:id',
    component: () => import('@/views/VideosManagerCRUD/DeletePage.vue')
  },
  {
    path: '/multimedia/manage',
    component: () => import('@/views/MultimediaManagerCRUD/IndexPage.vue')
  },
  {
    path: '/multimedia/manage/show/:id',
    component: () => import('@/views/MultimediaManagerCRUD/ShowPage.vue')
  },
  {
    path: '/multimedia/manage/create',
    component: () => import('@/views/MultimediaManagerCRUD/CreatePage.vue')
  },
  {
    path: '/multimedia/manage/edit/:id',
    component: () => import('@/views/MultimediaManagerCRUD/EditPage.vue')
  },
  {
    path: '/multimedia/manage/delete/:id',
    component: () => import('@/views/MultimediaManagerCRUD/DeletePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
