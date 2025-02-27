<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'
import { MeasureTool } from '../../hooks/useMeasure'
import { Button } from 'ant-design-vue'

let viewer: Cesium.Viewer
let measureTool: MeasureTool

const initCesium = async () => {
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

  measureTool = new MeasureTool(viewer)
}

// 测距
const onMeasureLine = () => {
  measureTool.measureLine()
}

// 测面
const onMeasureArea = () => {
  measureTool.measureArea()
}

const init = () => {
  initCesium()
}

onMounted(init)

</script>

<template>
  <div class="map-box">
    <div class="map-box-operation">
      <Button type="primary" @click="onMeasureLine">测距</Button>
      <Button type="primary" @click="onMeasureArea">测面</Button>
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
