<script setup lang="ts">
import { ref, onMounted, useTemplateRef, shallowRef } from 'vue'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import { transform } from 'ol/proj'
import View from 'ol/View'
const TIAN_DI_TU_KEY = 'b58e95b35830cd576df218d62abedbdd'

defineOptions({
  name: 'LoadMapDataIndex'
})

const mapElRef = useTemplateRef('mapElRef')
const map = shallowRef()

const layers_4326 = [
  new TileLayer({
    // name: '天地图矢量底图4326',
    source: new XYZ({
      projection: 'EPSG:4326',
      url: `http://t{0-7}.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
    }),
    opacity: 0.5
  }),
  new TileLayer({
    // name: '天地图矢量标注4326',
    source: new XYZ({
      projection: 'EPSG:4326',
      url: `http://t{0-7}.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
    }),
    opacity: 0.5
  })
]

const layers_3857 = [
  new TileLayer({
    // name: '天地图矢量底图3857',
    source: new XYZ({
      projection: 'EPSG:3857',
      url: `http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
    }),
    opacity: 0.5
  }),
  new TileLayer({
    // name: '天地图矢量标注3857',
    source: new XYZ({
      projection: 'EPSG:3857',
      url: `http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
    }),
    opacity: 0.5
  })
]
const initMap = () => {
  map.value = new Map({
    target: mapElRef.value as HTMLElement,
    // layers: [...layers_4326, ...layers_3857],
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        })
      }),
      ...layers_3857
    ],
    view: new View({
      center: transform([116.397428, 39.90923], 'EPSG:4326', 'EPSG:3857'),
      // center: [116.397428, 39.90923],
      zoom: 4,
      minZoom: 2,
      maxZoom: 18
    })
  })
}

onMounted(() => {
  initMap()
  // load4326Data()
})

const mapEPSGCode = ref('4326')

const load4326Data = () => {
  layers_4326.forEach((e) => {
    e.setVisible(true)
  })
  layers_3857.forEach((e) => {
    e.setVisible(false)
  })
  mapEPSGCode.value = '4326'
  map.value.setView(
    new View({
      projection: 'EPSG:4326',
      center: [116.397428, 39.90923],
      zoom: 4,
      minZoom: 2,
      maxZoom: 18
    })
  )
}

const load3857Data = () => {
  layers_4326.forEach((e) => {
    e.setVisible(false)
  })
  layers_3857.forEach((e) => {
    e.setVisible(true)
  })
  mapEPSGCode.value = '3857'

  map.value.setView(
    new View({
      projection: 'EPSG:3857',
      center: transform([116.397428, 39.90923], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4,
      minZoom: 1,
      maxZoom: 18
    })
  )
}
</script>

<template>
  <div class="page">
    <div ref="mapElRef" class="map"></div>
    <div class="tools">
      <ElButton type="primary" size="small" :disabled="mapEPSGCode === '4326'" @click="load4326Data"
        >加载4326地图</ElButton
      >
      <ElButton type="primary" size="small" :disabled="mapEPSGCode === '3857'" @click="load3857Data"
        >加载3857地图</ElButton
      >
    </div>
  </div>
</template>

<style scoped>
.tools {
  padding: 10px;
  background-color: #fff;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2);
}
</style>
