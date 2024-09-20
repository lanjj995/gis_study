<script setup>
import { onMounted, shallowRef, useTemplateRef } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import { transform } from 'ol/proj'
import MeasureTools from './measure.js'
const TIAN_DI_TU_KEY = 'b58e95b35830cd576df218d62abedbdd'

defineOptions({
  name: 'MeasureIndex'
})

const mapEleRef = useTemplateRef('mapEleRef')

const map = shallowRef()

const mapMeasure = shallowRef()

const initMap = () => {
  map.value = new Map({
    target: mapEleRef.value,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: `http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
        })
      }),
      new TileLayer({
        source: new XYZ({
          url: `http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
        })
      })
    ],
    view: new View({
      center: transform([116.397428, 39.90923], 'EPSG:4326', 'EPSG:3857'),
      zoom: 8,
      minZoom: 8,
      maxZoom: 18
    })
  })

  mapMeasure.value = new MeasureTools(map.value)
}

onMounted(initMap)

const onLine = () => {
  mapMeasure.value.getLength()
}

const onArea = () => {
  mapMeasure.value.getArea()
}

const onClear = () => {
  mapMeasure.value.clearMeasure()
}
</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
    <div class="tools">
      <ElButton type="primary" size="small" @click="onLine">测距</ElButton>
      <ElButton type="primary" size="small" @click="onArea">测面</ElButton>
      <ElButton type="primary" size="small" @click="onClear">清除</ElButton>
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
