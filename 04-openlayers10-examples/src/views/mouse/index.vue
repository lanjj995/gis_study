<script setup>
import { onMounted, shallowRef, useTemplateRef } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import Vector from 'ol/layer/Vector'
import { XYZ, TileWMS, ImageWMS } from 'ol/source'
import { transform } from 'ol/proj'
const TIAN_DI_TU_KEY = 'b58e95b35830cd576df218d62abedbdd'

defineOptions({
  name: 'MouseIndex'
})

const mapEleRef = useTemplateRef('mapEleRef')

const map = shallowRef()

const initMap = () => {
  map.value = new Map({
    target: mapEleRef.value,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: `http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
        })
      }),
      new TileLayer({
        source: new XYZ({
          url: `http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
        })
      })
    ],
    view: new View({
      center: transform([116.397428, 39.90923], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4,
      minZoom: 2,
      maxZoom: 18
    })
  })

  map.value.on('singleclick', (evt) => {
    var view = map.value.getView()
    var viewResolution = view.getResolution()
    var wmsLayer = map.value
      .getLayers()
      .getArray()
      .find(function (layer) {
        return layer.getSource() instanceof TileWMS
      })

    if (wmsLayer) {
      var url = wmsLayer
        .getSource()
        .getFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), {
          INFO_FORMAT: 'application/json'
        })

      if (url) {
        fetch(url)
          .then(function (response) {
            return response.json()
          })
          .then(function (json) {
            // 这里处理返回的特征信息
            console.log('Feature info:', json)
          })
          .catch(function (error) {
            console.error('Error during GetFeatureInfo request:', error)
          })
      }
    }
  })
}

onMounted(initMap)
</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
    <div class="tools"></div>
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
