<script setup>
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { transform, transformExtent } from 'ol/proj'
import { onMounted, reactive, useTemplateRef } from 'vue'
import { TileWMS } from 'ol/source'
import { ScaleLine, Zoom } from 'ol/control'
import HomeControl from './HomeControl.js'
import MapEventType from 'ol/MapEventType.js'
import MapBrowserEventType from 'ol/MapBrowserEventType'
import { containsExtent } from 'ol/extent'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import Draw from 'ol/interaction/Draw'
const TIAN_DI_TU_KEY = 'b58e95b35830cd576df218d62abedbdd'

window.transformExtent = transformExtent
window.transform = transform

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

const createExtent = () =>
  transformExtent(
    // [108.4, 34.699999000000005, 108.50000100000001, 34.800000000000004],
    [108.3699199635583, 34.69338735895845, 108.5295420876878, 34.82026155846857],
    'EPSG:4326',
    'EPSG:3857'
  )

// 创建view
const createView = () => {
  return new View({
    center: transform([108.44973102562304, 34.75684882738713], 'EPSG:4326', 'EPSG:3857'),
    zoom: 12.53,
    minZoom: 12.53,
    maxZoom: 18
  })
}

// 创建图层
const layers = {
  arcgais: new TileLayer({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
  }),
  // a: new TileLayer({
  //   source: new XYZ({
  //     url: `http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
  //   }),
  // }),
  // 天地图矢量标注
  b: new TileLayer({
    source: new XYZ({
      url: `http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
    })
  }),
  mywms: new TileLayer({
    extent: transformExtent(
      [108.4, 34.699999000000005, 108.50000100000001, 34.800000000000004],
      'EPSG:4326',
      'EPSG:3857'
    ),
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
  }),
  drawLayer: new VectorLayer({
    source: new VectorSource()
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
let map
const initMap = () => {
  map = new Map({
    target: mapEleRef.value,
    controls: createControls(),
    layers: Object.values(layers),
    view: createView()
  })

  window.map = map

  listenSingleClick(map)
  // 限制view
  limitView(map)
}

onMounted(initMap)

const drawLabels = [
  { value: 'Point', label: '点' },
  { value: 'LineString', label: '线' },
  { value: 'Polygon', label: '面' },
  { value: 'Circle', label: '圆' }
]

let lastDraw
const initialMousePosition = () => ({
  left: '0px',
  top: '0px',
  text: '',
  display: 'none'
})
const mousePosition = reactive(initialMousePosition())

const onMouseMovePoint = (event) => {
  console.log(`event---`, event)
  mousePosition.left = event.pixel[0] + 10 + 'px'
  mousePosition.top = event.pixel[1] + 10 + 'px'
  const coordinate = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
  mousePosition.text = `经度：${coordinate[0]}，纬度：${coordinate[1]}`
  mousePosition.display = 'block'
}
const handleDraw = (item) => {
  if (item.value === 'Point') {
    map.on(MapBrowserEventType.POINTERMOVE, onMouseMovePoint)
  } else {
    map.un(MapBrowserEventType.POINTERMOVE, onMouseMovePoint)
  }
  map.removeInteraction(lastDraw)
  const source = layers['drawLayer'].getSource()
  lastDraw = new Draw({
    source,
    type: item.value
  })
  map.addInteraction(lastDraw)
  if (item.value === 'Point') {
    lastDraw.on('drawend', () => {
      map.removeInteraction(lastDraw)
      map.un(MapBrowserEventType.POINTERMOVE, onMouseMovePoint)
      Object.assign(mousePosition, initialMousePosition())
    })
  }
}

const handleClear = () => {
  const source = layers['drawLayer'].getSource()
  source.clear()
}
</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
    <div ref="toolBarRef" class="tool-bar"></div>
    <div ref="labelToolbarRef" class="label-tool-bar">
      <button v-for="item in drawLabels" :key="item.value" @click="handleDraw(item)">
        {{ item.label }}
      </button>
      <button @click="handleClear">清除</button>
    </div>
    <div
      class="mouse-position"
      :style="{
        position: 'absolute',
        left: mousePosition.left,
        top: mousePosition.top,
        display: mousePosition.display
      }"
    >
      {{ mousePosition.text }}
    </div>
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
