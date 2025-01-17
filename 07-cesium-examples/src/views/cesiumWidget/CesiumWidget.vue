<script setup lang="ts">
import * as Cesium from 'cesium'
import { onMounted } from 'vue'
const TD_KEY = 'b58e95b35830cd576df218d62abedbdd'

let cesium: Cesium.CesiumWidget

const initCesium = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

  cesium = new Cesium.CesiumWidget('cesiumContainer', {
    skyBox: false, // 关闭天空盒
    skyAtmosphere: false, // 关闭大气层
    creditContainer: 'credit-container', // 显示版权信息
    terrainProvider: await Cesium.createWorldTerrainAsync(), // 地形provider
    sceneMode: Cesium.SceneMode.SCENE3D, // 场景模式
    orderIndependentTranslucency: true,
    baseLayer: false
  });

}

const initBaseLayerPicker = () => {

  const imageryProviderViewModels = [
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/tdt_img.png',
      name: '天地图影像',
      tooltip: '天地图影像',
      creationFunction: () => {
        const TD = new Cesium.WebMapTileServiceImageryProvider({
          url: 'https://{s}.tianditu.gov.cn/img_w/wmts?tk=' + TD_KEY,
          format: 'tiles',
          layer: 'img',
          style: 'default',
          tileMatrixSetID: 'w',
          subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tileWidth: 256,
          tileHeight: 256,
          minimumLevel: 1,
          maximumLevel: 18,
          // rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
        })
        return TD
      }
    })
  ]

  new Cesium.BaseLayerPicker('base-layer-picker', {
    globe: cesium.scene.globe,
    imageryProviderViewModels
  })
}

const init = () => {
  initCesium()
  // initBaseLayerPicker()
}
onMounted(init)
</script>


<template>
  <div class="map-box">
    <div id="credit-container"></div>
    <div id="base-layer-picker"></div>
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

#credit-container {
  display: none;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
}
</style>
