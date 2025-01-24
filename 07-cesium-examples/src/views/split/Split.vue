<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted, useTemplateRef } from 'vue'
import { useSplitImageryLayer } from '@/hooks/useSplit'

const sliderRef = useTemplateRef('sliderRef')
let viewer: Cesium.Viewer

const { init: initSplitImageryLayer } = useSplitImageryLayer(Cesium.SplitDirection.RIGHT)

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
}

const createLeftImageryLayer = async () => {
  const arcGisProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')
  const arcGisImagery = new Cesium.ImageryLayer(arcGisProvider)
  Reflect.set(arcGisImagery, 'id', 'arcGisImagery')
  return arcGisImagery
}

const createRightImageryLayer = async () => {
  const osmProvider = new Cesium.OpenStreetMapImageryProvider({
    url: 'https://tile.openstreetmap.org/'
  })
  const osmImagery = new Cesium.ImageryLayer(osmProvider)
  Reflect.set(osmImagery, 'id', 'osmImagery')
  return osmImagery
}

const init = async () => {
  initCesium()
  const splitImageryLayer = await createLeftImageryLayer()
  const rightImageryLayer = await createRightImageryLayer()
  initSplitImageryLayer({
    viewer,
    splitImageryLayer,
    rightImageryLayer,
    slider: sliderRef.value
  })
}

onMounted(init)

</script>

<template>
  <div class="map-box">
    <div ref="sliderRef" class="slider"></div>
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
