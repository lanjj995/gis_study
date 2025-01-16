<script lang="ts" setup>
import { onMounted, ref, type VNode } from 'vue'
import {
  Layout,
  LayoutSider,
  LayoutContent,
  Menu,
  Breadcrumb,
  BreadcrumbItem,
  type ItemType
} from 'ant-design-vue'
import { type SelectInfo } from 'ant-design-vue/es/menu/src/interface'
import { routes } from './router'
import { useRouter, type RouteRecordRaw, RouterView, useRoute } from 'vue-router'

/**
 * @description 菜单初始化
 * @param routes 路由
 * @returns 菜单
 */
const initMenus = (routes: Array<RouteRecordRaw>) => {
  const createMenuItem = (route: RouteRecordRaw): ItemType => {
    const item = {
      key: route.path,
      label: route.meta!.title as string,
      icon: route.meta!.icon as VNode,
      children: [] as Array<ItemType>
    }
    if (route.children) {
      item.children = route.children.map(createMenuItem)
    } else {
      Reflect.deleteProperty(item, 'children')
    }
    return item
  }
  return routes.map(createMenuItem)
}
const menus = initMenus(routes)
const collapsed = ref<boolean>(false)
const router = useRouter()
const route = useRoute()
const menuSelectedKeys = ref<string[]>([])

onMounted(() => {
  console.log(`route`, route)
  menuSelectedKeys.value = [route.path]
})

const onSelectMenu = (e: SelectInfo) => {
  console.log(`onSelectMenu----`, e)
  router.push({
    path: e.key as string
  })
}
</script>

<template>
  <Layout style="min-height: 100vh">
    <LayoutSider v-model:collapsed="collapsed" collapsible>
      <div class="logo"></div>
      <Menu v-model:selected-keys="menuSelectedKeys" :items="menus" theme="light" mode="inline" @select="onSelectMenu"></Menu>
    </LayoutSider>
    <Layout>
      <!-- <LayoutHeader style="background: #fff; padding: 0" /> -->
      <LayoutContent>
        <div class="router-view">
          <RouterView></RouterView>
        </div>
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<style scoped>
.router-view {
  width: 100%;
  height: 100%;
}
</style>