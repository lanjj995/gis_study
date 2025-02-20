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
  },
  {
    path: '/cesiumWidget',
    name: 'cesiumWidget',
    component: () => import('../views/cesiumWidget/CesiumWidget.vue'),
    meta: {
      title: 'cesiumWidget',
      icon: h(ProfileOutlined)
    }
  },
  {
    path: '/imageryProvider',
    name: 'imageryProvider',
    component: () => import('../views/imageryProvider/ImageryProvider.vue'),
    meta: {
      title: 'imageryProvider',
      icon: h(ProfileOutlined)
    }
  },
  {
    path: '/entity',
    name: 'entity',
    component: () => import('../views/entity/Entity.vue'),
    meta: {
      title: 'entity',
      icon: h(ProfileOutlined)
    }
  },
  {
    path: '/split',
    name: 'split',
    component: () => import('../views/split/Split.vue'),
    meta: {
      title: '卷帘',
      icon: h(ProfileOutlined)
    }
  },
  {
    path: '/entityOperation',
    name: 'entityOperation',
    component: () => import('../views/entityOperation/EntityOperation.vue'),
    meta: {
      title: '实体操作',
      icon: h(ProfileOutlined)
    }
  },
  {
    path: '/terrain',
    name: 'terrain',
    component: () => import('../views/terrain/Terrain.vue'),
    meta: {
      title: '地形',
      icon: h(ProfileOutlined)
    }
  },
  {
    path: '/vector',
    name: 'vector',
    component: () => import('../views/vector/Vector.vue'),
    meta: {
      title: '矢量',
      icon: h(ProfileOutlined)
    }
  },
  {
    path: '/3DTile',
    name: '3DTile',
    component: () => import('../views/3DTile/3DTile.vue'),
    meta: {
      title: '3DTile',
      icon: h(ProfileOutlined)
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
