<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'
import { Card, Button, Space } from 'ant-design-vue'

let viewer: Cesium.Viewer
const init = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
  viewer = new Cesium.Viewer('cesiumContainer')
}

const loadKML = () => {
  return Cesium.KmlDataSource.load(
    '/static/kml/facilities/facilities.kml',
    {
      camera: viewer.scene.camera,
      canvas: viewer.scene.canvas,
      screenOverlayContainer: viewer.container,
    }
  )
}

const loadKMZ = () => {
  return Cesium.KmlDataSource.load(
    '/static/kml/facilities/facilities.kmz',
    {
      camera: viewer.scene.camera,
      canvas: viewer.scene.canvas,
      screenOverlayContainer: viewer.container,
    }
  )
}

const loadGeoJSON = () => {
  return Cesium.GeoJsonDataSource.load('/static/json/simplestyles.geojson')
}

const loadTopoJSON = () => {
  return Cesium.GeoJsonDataSource.load('/static/json/ne_10m_us_states.topojson')
}

const loadCZML = () => {
  return Cesium.CzmlDataSource.load('/static/czml/tracking.czml')
}

const loadGPX = () => {
  return Cesium.GpxDataSource.load('/static/gpx/lamina.gpx')
}


const vectors = [
  { name: 'KML', load: loadKML },
  { name: 'KMZ', load: loadKMZ },
  { name: 'GeoJSON', load: loadGeoJSON },
  { name: 'TopoJSON', load: loadTopoJSON },
  { name: 'GPX', load: loadGPX },
  { name: 'CZML', load: loadCZML },
]

const toggle = (item: typeof vectors[0]) => {
  const dss = viewer.dataSources.getByName(item.name)
  if (dss.length > 0) {
    dss[0].show = !dss[0].show
    viewer.flyTo(dss[0])
  } else {
    item.load().then((dataSource) => {
      Reflect.set(dataSource, 'name', item.name)
      viewer.flyTo(dataSource)
      viewer.dataSources.add(dataSource)
      dataSource.show = true
    })
  }
}


onMounted(init)
</script>

<template>
  <div class="map-box">
    <Card class="map-box-operation">
      <Space warp>
        <Button v-for="item in vectors" :key="item.name" type="primary" @click="toggle(item)">{{ item.name }}</Button>
      </Space>
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
  min-width: 300px;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
}
</style>
