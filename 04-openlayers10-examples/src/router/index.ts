import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/index.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/base',
    name: 'base',
    component: () => import('../views/base/index.vue'),
    meta: {
      title: '基础使用'
    }
  },
  {
    path: '/load-map-data',
    name: 'loadMapData',
    component: () => import('../views/load-map-data/index.vue'),
    meta: {
      title: '加载不同地图数据'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
