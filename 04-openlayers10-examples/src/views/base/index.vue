<script setup>
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { transform, transformExtent } from 'ol/proj'
import { onMounted, useTemplateRef } from 'vue'
import { TileWMS } from 'ol/source'
import { ScaleLine, Zoom } from 'ol/control'
import HomeControl from './HomeControl.js'
import MapEventType from 'ol/MapEventType.js'
import { containsExtent } from 'ol/extent'

defineOptions({
  name: 'BaseIndex'
})

const toolBarRef = useTemplateRef('toolBarRef')
// 创建控件
const createControls = () => {
  return [
    new ScaleLine(),
    new HomeControl({
      target: toolBarRef.value,
      initialView: createView()
    }),
    new Zoom({
      target: toolBarRef.value
    })
  ]
}

const createExtent = () => transformExtent(
  [108.4, 34.699999000000005, 108.50000100000001, 34.800000000000004],
  'EPSG:4326',
  'EPSG:3857'
)

// 创建view
const createView = () => {
  return new View({
    center: transform([116.397428, 39.90923], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4,
    minZoom: 2,
    maxZoom: 18,
  })
}

// 创建图层
const layers = {
  arcgis: new TileLayer({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
  }),
  mywms: new TileLayer({
    extent: createExtent(),
    source: new TileWMS({
      projection: 'EPSG:4326',
      url: 'http://localhost:8080/geoserver/mywork/wms',
      params: {
        FORMATE: 'image/png8',
        VERSION: '1.1.1',
        exceptions: 'application/vnd.ogc.se_inimage',
        LAYERS: 'mywork:1084_0348'
      },
      serverType: 'geoserver'
    }),
    opacity: 0.4
  })
}

// 点击获取要素信息
const listenSingleClick = (map) => {
  map.on('singleclick', (event) => {
    const view = map.getView()
    const url = layers['mywms']
      .getSource()
      .getFeatureInfoUrl(event.coordinate, view.getResolution(), view.getProjection(), {
        INFO_FORMAT: 'application/json',
        FEATURE_COUNT: 50
      })
    console.log(`url`, url)
    fetch(url)
      .then((res) => res.json())
      .then((html) => {
        console.log(`html`, html)
      })
  })
}

// 限制view
const limitView = (map) => {
  map.on(MapEventType.MOVEEND, () => {
    const currentExtent = map.getView().calculateExtent(map.getSize())
    const extent = createExtent()

    if (!containsExtent(extent, currentExtent)) {
      map.getView().fit(extent, {
        duration: 2000
      })
    }
  })
}

const mapEleRef = useTemplateRef('mapEleRef')
const initMap = () => {
  const map = new Map({
    target: mapEleRef.value,
    controls: createControls(),
    layers: Object.values(layers),
    view: createView()
  })

  listenSingleClick(map)
  // 限制view
  limitView(map)
}

onMounted(initMap)
</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
    <div ref="toolBarRef" class="tool-bar"></div>
  </div>
</template>

<style scoped>
.tool-bar {
  position: absolute;
  right: 0.5em;
  bottom: 0.5em;
  display: flex;
  flex-direction: column;
}

.tool-bar :deep(.ol-control) {
  position: relative;
}

.tool-bar :deep(.ol-zoom) {
  top: 0;
  left: 0;
}
</style>
