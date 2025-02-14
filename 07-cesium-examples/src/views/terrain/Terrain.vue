<script lang="ts" setup>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

let viewer: Cesium.Viewer
const init = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

  viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl('http://localhost:9090/static/terrain/xian_33_108', {}), // 地形
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

  
  const arcgisProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')
  const arcgisImagery = new Cesium.ImageryLayer(arcgisProvider)
  viewer.imageryLayers.add(arcgisImagery)
}

onMounted(init)
</script>

<template>
  <div class="map-box">
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
