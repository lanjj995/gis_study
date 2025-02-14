<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'
import { Card, Button } from 'ant-design-vue'

let viewer: Cesium.Viewer
const init = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
  viewer = new Cesium.Viewer('cesiumContainer')
}

const loadKML = async () => {
  viewer.camera.flyHome(0)
  const options = {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
    screenOverlayContainer: viewer.container,
  }
  const kmlDataSource = Cesium.KmlDataSource.load(
    '/static/kml/facilities/facilities.kml',
    options
  )
  viewer.dataSources.add(kmlDataSource)
}

const loadGeoJSON = async () => {
}

const loadTopoJSON = async () => {
}

const loadCZML = async () => {
  
}

onMounted(init)
</script>

<template>
  <div class="map-box">
    <Card class="map-box-operation">
      <Button type="primary" @click="loadKML">load kml</Button>
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
