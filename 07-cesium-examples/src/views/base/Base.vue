<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted, ref } from 'vue'
import { Card, Form, FormItem, Select, SelectOption } from 'ant-design-vue'
const TD_KEY = '73edd9ad4809147c692e178f0b192260'

const baseLayers = [
  {
    name: 'ArcGIS',
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
  },
  {
    name: '天地图',
    url: ''
  }
]
const layer = ref(baseLayers[0].url)

const onChangeLayer = (value: string) => {
  
}

const init = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
  
  const viewer = new Cesium.Viewer('cesiumContainer', {
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

  viewer.creditDisplay.container.style.display = 'none'
  viewer.scene.moon.show = false
  viewer.scene.sun.show = false
  viewer.scene.skyAtmosphere.show = false
  viewer.scene.skyBox.show = false

  // arcgis 地图
  // const arcgis = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
  //   'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
  // )
  // viewer.imageryLayers.addImageryProvider(arcgis)

  const TD = new Cesium.WebMapTileServiceImageryProvider({
    url: 'https://t{s}.tianditu.gov.cn/.DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + TD_KEY,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    layer: 'img',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w'
  })
  viewer.imageryLayers.addImageryProvider(TD)

  
}

onMounted(init)

</script>

<template>
  <div class="map-box">
    <Card title="操作" class="map-box-operation">
      <Form>
        <FormItem label="底图">
          <Select v-model="layer" style="width: 100%">
            <SelectOption v-for="layer in baseLayers" :key="layer.name" :value="layer.url">{{ layer.name }}</SelectOption>
          </Select>
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
