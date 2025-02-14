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

// baseLayerPicker
const initBaseLayerPicker = () => {

  // 底图
  const imageryProviderViewModels = [
    // 天地图
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
    }),
    // arcgis地图
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/esriWorldImagery.png',
      name: 'ArcGIS影像',
      tooltip: 'ArcGIS影像',
      creationFunction: () => {
        return Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')
      }
    }),
    // 高德地图
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/gaode_img.png',
      name: '高德影像',
      tooltip: '高德影像',
      creationFunction: () => {
        return new Cesium.UrlTemplateImageryProvider({
          url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          subdomains: ['1', '2', '3', '4'],
          minimumLevel: 1,
          maximumLevel: 18,
        })
      }
    }),
    // 谷歌地图
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/google_img.png',
      name: '谷歌影像',
      tooltip: '谷歌影像',
      creationFunction: () => {
        return new Cesium.UrlTemplateImageryProvider({
          url: 'https://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
          subdomains: ['0', '1', '2', '3'],
          minimumLevel: 1,
          maximumLevel: 18,
        })
      }
    }),
    // OSM地图
    new Cesium.ProviderViewModel({
      iconUrl: 'https://data.mars3d.cn/img/thumbnail/basemap/null.png',
      name: 'OSM地图',
      tooltip: 'OSM地图',
      creationFunction: () => {
        return new Cesium.OpenStreetMapImageryProvider({
          url: 'https://tile.openstreetmap.org/'
        })
      }
    }),
    // bing地图
    new Cesium.ProviderViewModel({
      iconUrl: 'https://data.mars3d.cn/img/thumbnail/basemap/null.png',
      name: 'Bing影像',
      tooltip: 'Bing影像',
      creationFunction: () => {
        return Cesium.BingMapsImageryProvider.fromUrl(
          "https://dev.virtualearth.net", {
            key: "get-yours-at-https://www.bingmapsportal.com/",
            mapStyle: Cesium.BingMapsStyle.AERIAL
        })
      }
    }),
    // Mapbox地图
    new Cesium.ProviderViewModel({
      iconUrl: 'https://data.mars3d.cn/img/thumbnail/basemap/null.png',
      name: 'Mapbox影像',
      tooltip: 'Mapbox影像',
      creationFunction: () => {
        return new Cesium.MapboxImageryProvider({
          mapId: 'mapbox.satellite',
          accessToken: 'get-yours-at-https://www.mapbox.com/'
        })
      }
    }),
  ]
  // 地形
  const terrainProviderViewModels = [
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/null.png',
      name: '无地形',
      tooltip: '无地形',
      creationFunction: () => {
        return new Cesium.EllipsoidTerrainProvider()
      }
    }),
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/null.png',
      name: '世界地形',
      tooltip: '世界地形',
      creationFunction: () => {
        return Cesium.createWorldTerrainAsync()
      }
    }),
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/null.png',
      name: 'ArcGIS地形',
      tooltip: 'ArcGIS地形',
      creationFunction: () => {
        return Cesium.ArcGISTiledElevationTerrainProvider.fromUrl("https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer", {
          token: "KED1aF_I4UzXOHy3BnhwyBHU4l5oY6rO6walkmHoYqGp4XyIWUd5YZUC1ZrLAzvV40pR6gBXQayh0eFA8m6vPg.."
        });
      }
    }),
    // Cesium
    new Cesium.ProviderViewModel({
      iconUrl: 'http://data.mars3d.cn/img/thumbnail/basemap/null.png',
      name: 'Cesium地形',
      tooltip: 'Cesium地形',
      creationFunction: () => {
        return Cesium.CesiumTerrainProvider.fromUrl(Cesium.IonResource.fromAssetId(1))
      }
    })
  ]

  const baseLayerPicker = new Cesium.BaseLayerPicker('base-layer-picker', {
    globe: cesium.scene.globe,
    imageryProviderViewModels,
    terrainProviderViewModels
  })
  const imageryTitle = document.querySelector('.cesium-baseLayerPicker-sectionTitle[data-bind="visible: imageryProviderViewModels.length > 0"]')
  if (imageryTitle) {
    imageryTitle.innerHTML = '影像'
  }
  const sectionTitleEle = document.querySelector('.cesium-baseLayerPicker-sectionTitle[data-bind="visible: terrainProviderViewModels.length > 0"]')
  if (sectionTitleEle) {
    sectionTitleEle.innerHTML = '地形服务'
  }

  return baseLayerPicker
}

const initTileCoordinatesImageryProvider = () => {
  const tileCoordinatesImageryProvider = new Cesium.TileCoordinatesImageryProvider()
  cesium.imageryLayers.addImageryProvider(tileCoordinatesImageryProvider)
}

const init = async () => {
  await initCesium()
  initBaseLayerPicker()
  initTileCoordinatesImageryProvider()
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

#base-layer-picker {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

#credit-container {
  display: none;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
}
</style>
