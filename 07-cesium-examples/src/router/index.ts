import { createRouter, createWebHistory } from 'vue-router'
import { HomeFilled, ProfileOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '首页',
      icon: h(HomeFilled)
    }
  },
  {
    path: '/baseMap',
    name: 'baseMap',
    component: () => import('../views/baseMap/BaseMap.vue'),
    meta: {
      title: '底图加载',
      icon: h(ProfileOutlined)
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
