<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'
import { Card, Form, FormItem, Button } from 'ant-design-vue'

let viewer: Cesium.Viewer
const init = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
  
  viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: await Cesium.createWorldTerrainAsync(), // 地形
    animation: false, // 动画
    baseLayerPicker: false, // baseLayerPicker
    fullscreenButton: false, // 全屏按钮
    geocoder: false, // 地理编码
    homeButton: false, // 首页按钮
    sceneModePicker: false, // 场景模式选择器
    selectionIndicator: false, // 选择指示器
    infoBox: false, // 信息框
    navigationHelpButton: false, // 导航帮助按钮
    navigationInstructionsInitiallyVisible: false, // 导航帮助按钮
    scene3DOnly: true, // 3D模式
    timeline: false, // 时间轴
  })

  // credit 隐藏
  viewer.creditDisplay.container.style.display = 'none'
  // 隐藏 月
  viewer.scene.moon.show = false
  // 隐藏 太阳
  viewer.scene.sun.show = false
  // 隐藏 大气层
  viewer.scene.skyAtmosphere.show = false
  // 隐藏 天空盒
  viewer.scene.skyBox.show = false
}

const add3DTile = async () => {
  const tileset = await Cesium.Cesium3DTileset.fromUrl('/static/3DTiles/Batched/BatchedColors/tileset.json')
  viewer.scene.primitives.add(tileset)
  viewer.zoomTo(tileset)
}


onMounted(init)

</script>

<template>
  <div class="map-box">
    <Card class="map-box-operation">
      <Form layout="vertical">
        <FormItem label="底图切换">
          <Button type="primary" @click="add3DTile">3DTile</Button>
        </FormItem>
      </Form>
    </Card>
    <div id="cesiumContainer"></div> 
  </div>
</template>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-box-operation {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 300px;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
}
</style>
