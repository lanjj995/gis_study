<script setup lang="ts">
import { routes } from './router/index'
</script>

<template>
  <div class="layout">
    <ElContainer>
      <ElHeader>OpenLayers10 使用示例</ElHeader>
      <ElContainer>
        <ElAside width="200px">
          <ElMenu router>
            <ElMenuItem
              v-for="route in routes"
              :key="route.path"
              :index="route.path"
              :route="route"
              >{{ route.meta.title }}</ElMenuItem
            >
          </ElMenu>
        </ElAside>
        <ElMain>
          <RouterView></RouterView>
        </ElMain>
      </ElContainer>
    </ElContainer>
  </div>
</template>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout .el-header {
  background-color: var(--el-color-primary);
  font-size: 16px;
  /* color: var(--el-text-color-primary); */
  color: var(--el-color-white);
  line-height: var(--el-header-height);
}

.layout .el-menu {
  height: 100%;
}
</style>
