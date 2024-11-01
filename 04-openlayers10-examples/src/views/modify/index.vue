<script setup>
import { Feature, Map, View } from 'ol'
import { Polygon } from 'ol/geom'
import Draw from 'ol/interaction/Draw'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import { OSM } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Style, Fill } from 'ol/style'
import { onMounted, shallowRef, useTemplateRef } from 'vue'

defineOptions({
  name: 'ModifyIndex'
})

const mapEleRef = useTemplateRef('mapEleRef')

const olMap = shallowRef()

const baseLayer = new TileLayer({
  source: new OSM()
})

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [
      new Feature({
        geometry: new Polygon([
          [
            [12124674.766263325, 4066218.0592459845],
            [12124779.867177218, 4062778.3929731515],
            [12130226.005442536, 4062768.838344616],
            [12130245.114699608, 4066323.1601598766],
            [12124674.766263325, 4066218.0592459845]
          ]
        ])
      })
    ]
  })
})

window.transform = transform
window.olMap = olMap

const initMap = () => {
  olMap.value = new Map({
    target: mapEleRef.value,
    layers: [baseLayer, vectorLayer],
    view: new View({
      center: transform([108.94231123668638, 34.260992867468005], 'EPSG:4326', 'EPSG:3857'),
      zoom: 14
    })
  })
}

const initInteraction = () => {
  const interaction = new Draw({
    source: vectorLayer.getSource(),
    type: 'Polygon'
  })
  olMap.value.addInteraction(interaction)
}

const init = () => {
  initMap()
  initInteraction()
}

onMounted(init)
</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
  </div>
</template>

<style lang="scss" scoped></style>
