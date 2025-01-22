<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { ref, onMounted, shallowReactive } from 'vue'
import { Form, FormItem, RadioGroup, type RadioChangeEvent } from 'ant-design-vue'
import { findImageryLayer } from '../../utils/cesiumUtil'

const TD_KEY = 'b58e95b35830cd576df218d62abedbdd'

const imageryLayerVisible = shallowReactive({
  ArcGisMapServerImageryProvider: false,
  BingMapsImageryProvider: false,
  OpenStreetMapImageryProvider: false,
  TileMapServiceImageryProvider: false,
  TileCoordinatesImageryProvider: false,
  WebMapServiceImageryProvider: false,
  WebMapTileServiceImageryProvider: false,
  UrlTemplateImageryProvider: false,
})

// imageryProviders
const imageryProviders = [
  {
    label: 'ArcGisMapServerImageryProvider',
    value: 'ArcGisMapServerImageryProvider',
    createImageryLayer() {
      const arcGisImageryProvider = Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')
      const arcGisImageryLayer = Cesium.ImageryLayer.fromProviderAsync(arcGisImageryProvider, {})
      return arcGisImageryLayer
    }
  },
  {
    label: 'BingMapsImageryProvider',
    value: 'BingMapsImageryProvider',
    createImageryLayer() {
      const bingImageryProvider = Cesium.BingMapsImageryProvider.fromUrl(
        'https://dev.virtualearth.net', {
          key: 'get-yours-at-https://www.bingmapsportal.com/',
          mapStyle: Cesium.BingMapsStyle.AERIAL
      })
      const bingImageryLayer = Cesium.ImageryLayer.fromProviderAsync(bingImageryProvider, {})
      return bingImageryLayer
    }
  },
  {
    label: 'OpenStreetMapImageryProvider',
    value: 'OpenStreetMapImageryProvider',
    createImageryLayer() {
      const osmImageryProvider = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/'
      })
      const osmImageryLayer = new Cesium.ImageryLayer(osmImageryProvider)
      return osmImageryLayer
    }
  },
  {
    label: 'TileMapServiceImageryProvider',
    value: 'TileMapServiceImageryProvider',
    createImageryLayer() {
      const tmsImageryProvider = Cesium.TileMapServiceImageryProvider.fromUrl(
        'http://localhost:5173/Assets/Textures/NaturalEarthII',
        // 'http://localhost:8090/geoserver/gwc/service/tms/1.0.0/my_work%3Awuhan2000@EPSG%3A4326@png',
        {
          tileWidth: 256,
          tileHeight: 256,
          fileExtension: 'jpg',
        }
      )
      return Cesium.ImageryLayer.fromProviderAsync(tmsImageryProvider, {})
    }
  },
  {
    label: 'TileCoordinatesImageryProvider',
    value: 'TileCoordinatesImageryProvider',
    createImageryLayer() {
      const tileCoordinatesImageryProvider = new Cesium.TileCoordinatesImageryProvider()
      const tileCoordinatesImageryLayer = new Cesium.ImageryLayer(tileCoordinatesImageryProvider)
      return tileCoordinatesImageryLayer
    }
  },
  {
    label: 'WebMapServiceImageryProvider',
    value: 'WebMapServiceImageryProvider',
    createImageryLayer() {
      const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
        url: 'http://localhost:8090/geoserver/my_work/wms',
        layers: 'my_work:wuhan2000',
        rectangle: Cesium.Rectangle.fromDegrees(114.34621810913086, 30.55323600769043, 114.38020706176758, 30.58786869049072),
        tileWidth: 256,
        tileHeight: 256,
        srs: 'EPSG:4326'
      })
      const wmsImageryLayer = new Cesium.ImageryLayer(wmsImageryProvider)
      return wmsImageryLayer
    }
  },
  {
    label: 'WebMapTileServiceImageryProvider',
    value: 'WebMapTileServiceImageryProvider',
    createImageryLayer() {
      const wmtsImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: 'https://{s}.tianditu.gov.cn/img_w/wmts?tk=' + TD_KEY,
        format: 'tiles',
        layer: 'img',
        style: 'default',
        tileMatrixSetID: 'w',
        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        tileWidth: 256,
        tileHeight: 256,
        minimumLevel: 1,
        maximumLevel: 18
      })
      const wmtsImageryLayer = new Cesium.ImageryLayer(wmtsImageryProvider)
      return wmtsImageryLayer
    }
  },
  {
    label: 'UrlTemplateImageryProvider',
    value: 'UrlTemplateImageryProvider',
    createImageryLayer() {
      const urlTemplateImageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'http://localhost:8090/geoserver/my_work/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=true&STYLES&LAYERS=my_work%3Awuhan2000&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A4326&WIDTH={width}&HEIGHT={height}&BBOX={westDegrees},{southDegrees},{eastDegrees},{northDegrees}',
        tileWidth: 256,
        tileHeight: 256,
        rectangle: Cesium.Rectangle.fromDegrees(114.34621810913086, 30.55323600769043, 114.38020706176758, 30.58786869049072),
      })
      const urlTemplateImageryLayer = new Cesium.ImageryLayer(urlTemplateImageryProvider)
      return urlTemplateImageryLayer
    }
  },
]

let viewer: Cesium.Viewer
const radioVisibleOptions = [
  { label: '显示', value: true },
  { label: '隐藏', value: false },
]
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
onMounted(init)

const onChange = (event: RadioChangeEvent, item: typeof imageryLayers[number]) => {
  let imageryLayer = findImageryLayer(viewer.imageryLayers, item.value)
  if (!imageryLayer) {
    imageryLayer = item.createImageryLayer()
    Reflect.set(imageryLayer, 'id', item.value)
    imageryLayer.show = false
    viewer.imageryLayers.add(imageryLayer)
  }
  if (event.target.value) {
    imageryLayer.show = true
    viewer.flyTo(imageryLayer)
  } else {
    imageryLayer.show = false
  }
}

</script>

<template>
  <div class="map-box">
    <div class="map-box-operation">
      <Form>
        <FormItem v-for="item in imageryProviders" :key="item.value" :label="item.label">
          <RadioGroup v-model:value="imageryLayerVisible[item.value]" :options="radioVisibleOptions" @change="onChange($event, item)"></RadioGroup>
        </FormItem>
      </Form>
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
  width: 400px;
  background-color: #fff;
  padding: 10px;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
}
</style>
