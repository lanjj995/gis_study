<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted, ref, watch } from 'vue'
import { Card, Form, FormItem, Select, SelectOption } from 'ant-design-vue'
const TD_KEY = 'b58e95b35830cd576df218d62abedbdd'

const baseLayers = [
  { label: 'ArcGIS', value: 'ArcGIS' },
  { label: '天地图', value: 'TD' },
  { label: '高德', value: 'AM' },
  { label: 'OSM', value: 'OSM' },
  { label: 'bing', value: 'bing' },
  // { label: 'WMTS', value: 'WMTS' },
  { label: 'WMS', value: 'WMS' },
]
const baseLayerValue = ref<string>(baseLayers[0].value)
watch(baseLayerValue, (newValue, oldValue) => {
  if (oldValue) {
    // 移除旧图层
    removeBaseLayer(oldValue)
  }

  if (newValue) {
    // 添加新图层
    addBaseLayer(newValue)
  }
})

// 移除旧涂层
const removeBaseLayer = (type: string) => {
  const layers = viewer.imageryLayers
  for (let index = 0; index < layers.length; index++) {
    const layer = layers.get(index)
    if (Reflect.get(layer, 'imagery_id') === type) {
      layers.remove(layer)
    }
  }
}

// 添加新图层
const addBaseLayer = async (type: string) => {
  switch (type) {
    case 'WMS':
      const wmsProvider = new Cesium.WebMapServiceImageryProvider({
        url: 'http://localhost:8090/geoserver/mywork/wms',
        layers: 'mywork:新昌',
        rectangle: Cesium.Rectangle.fromDegrees(120.82626342773438,29.472198486328125,120.91278076171875,29.542236328125),
        tileWidth: 256,
        tileHeight: 256,
      })
      const wmsImagery = new Cesium.ImageryLayer(wmsProvider, {
        alpha: 0.5
      })
      Reflect.set(wmsImagery, 'imagery_id', type)
      viewer.imageryLayers.add(wmsImagery)
      viewer.flyTo(wmsImagery)
      break;
    case 'OSM':
      const osmProvider = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/'
      })
      const osmImagery = new Cesium.ImageryLayer(osmProvider)
      Reflect.set(osmImagery, 'imagery_id', type)
      viewer.imageryLayers.add(osmImagery)
      break;
    case 'bing':
      const bing = await Cesium.BingMapsImageryProvider.fromUrl(
        "https://dev.virtualearth.net", {
          key: "get-yours-at-https://www.bingmapsportal.com/",
          mapStyle: Cesium.BingMapsStyle.AERIAL
      });
      const bingImagery = new Cesium.ImageryLayer(bing)
      Reflect.set(bingImagery, 'imagery_id', type)
      viewer.imageryLayers.add(bingImagery)
      break;
    case 'TD':
      const TD = new Cesium.WebMapTileServiceImageryProvider({
        url: 'https://{s}.tianditu.gov.cn/img_w/wmts?tk=' + TD_KEY,
        format: 'tiles',
        layer: 'img',
        style: 'default',
        tileMatrixSetID: 'w',
        // TODO: 加这个就不行了 有待研究
        // tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        tileWidth: 256,
        tileHeight: 256,
        minimumLevel: 1,
        maximumLevel: 18,
        // rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
      })
      const TD_imagery = new Cesium.ImageryLayer(TD)
      Reflect.set(TD_imagery, 'imagery_id', type)
      viewer.imageryLayers.add(TD_imagery)
      break
    case 'AM':
      const AMProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        minimumLevel: 1,
        maximumLevel: 18,
      })
      const AMImagery = new Cesium.ImageryLayer(AMProvider)
      Reflect.set(AMImagery, 'imagery_id', type)
      viewer.imageryLayers.add(AMImagery)
      break
    default:
      const arcgisProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')
      const arcgisImagery = new Cesium.ImageryLayer(arcgisProvider)
      Reflect.set(arcgisImagery, 'imagery_id', type)
      viewer.imageryLayers.add(arcgisImagery)
      break
  }
}

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

  addBaseLayer(baseLayerValue.value)
  window.viewer = viewer
}

onMounted(init)

</script>

<template>
  <div class="map-box">
    <Card class="map-box-operation">
      <Form layout="vertical">
        <FormItem label="底图切换">
          <Select v-model:value="baseLayerValue" :options="baseLayers" @change="onChangeBaseLayer"></Select>
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
