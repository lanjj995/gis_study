<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'
import { Button } from 'ant-design-vue'

let viewer: Cesium.Viewer

// layer1
const layerDataSource = new Cesium.CustomDataSource('layer')

const pointEntity = new Cesium.Entity({
  id: 'point',
  name: '点',
  position: Cesium.Cartesian3.fromDegrees(116.367477, 39.808692, 200),
  point: new Cesium.PointGraphics({
    color: Cesium.Color.RED,
    pixelSize: 10
  })
})

layerDataSource.entities.add(pointEntity)

const initCesium = () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
  
  viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false, // 动画
    baseLayerPicker: true, // baseLayerPicker
    fullscreenButton: true, // 全屏按钮
    geocoder: true, // 地理编码
    homeButton: true, // 首页按钮
    sceneModePicker: false, // 场景模式选择器
    selectionIndicator: false, // 选择指示器
    infoBox: false, // 信息框
    navigationHelpButton: true, // 导航帮助按钮
    navigationInstructionsInitiallyVisible: false, // 导航帮助按钮
    scene3DOnly: false, // 3D模式
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

  viewer.dataSources.add(layerDataSource)
}

const init = async () => {
  initCesium()
}

onMounted(init)

const toggleShow = () => {
  layerDataSource.show = !layerDataSource.show
}

</script>

<template>
  <div class="map-box">
    <div class="map-box-operation">
      <Button type="primary" @click="toggleShow">切换显示entities</Button>
    </div>

    <div id="cesiumContainer"></div> 
  </div>
</template>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.slider {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: #d3d3d3;
  z-index: 2;
  cursor: ew-resize;
}

.map-box-operation {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 300px;
  padding: 10px;
  background-color: #fff;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
}
</style>
