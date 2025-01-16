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
    path: '/base',
    name: 'base',
    component: () => import('../views/base/Base.vue'),
    meta: {
      title: '基础使用',
      icon: h(ProfileOutlined)
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
