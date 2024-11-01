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
  },
  {
    path: '/measure',
    name: 'measure',
    component: () => import('../views/measure/index.vue'),
    meta: {
      title: '绘图工具'
    }
  },
  {
    path: '/mouse',
    name: 'mouse',
    component: () => import('../views/mouse/index.vue'),
    meta: {
      title: '点击事件'
    }
  },
  {
    path: '/swipe',
    name: 'swipe',
    component: () => import('../views/swipe/index.vue'),
    meta: {
      title: '卷帘'
    }
  },
  {
    path: '/yuhang',
    name: 'yuhang',
    component: () => import('../views/yuhang/index.vue'),
    meta: {
      title: '余杭'
    }
  },
  {
    path: '/wmts',
    name: 'wmts',
    component: () => import('../views/wmts/index.vue'),
    meta: {
      title: 'wmts'
    }
  },
  {
    path: '/modify',
    name: '边线',
    component: () => import('../views/modify/index.vue'),
    meta: {
      title: 'Modify'
    }
  },
  
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test/index.vue'),
    meta: {
      title: 'Test'
    }
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
