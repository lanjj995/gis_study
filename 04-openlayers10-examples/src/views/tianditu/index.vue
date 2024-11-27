<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import { WMTS, XYZ } from 'ol/source'
import { transform, get, Projection } from 'ol/proj'
import View from 'ol/View'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { getWidth } from 'ol/extent'

defineOptions({
  name: 'TIANDITUIndex'
})

const olMapTargetElementRef = useTemplateRef<HTMLElement>('olMapTargetElementRef')
const TIAN_DI_TU_KEY = '73edd9ad4809147c692e178f0b192260'
let olMap

const getResolutions = (maxZoom = 22) => {
  const EPSG4326 = get('EPSG:4326') as Projection;
  const TILE_SIZE = 256;
  const size = getWidth(EPSG4326.getExtent()) / TILE_SIZE
  
  const resolutions: Array<number> = []
  for (let index = 1; index <= maxZoom; index++) {
    resolutions.push(size / Math.pow(2, index))
  }
  return resolutions
}

const getMatrixIds = (prefix = '', maxZoom = 22) => {
  const matrixIds: Array<string> = []
  for (let index = 1; index <= maxZoom; index++) {
    matrixIds.push([prefix, index].filter(Boolean).join(':'))
  }
  return matrixIds
}
const initOlMap = () => {
  var matrixIds = getMatrixIds('', 18)
  var resolutions = getResolutions(18)
  olMap = new Map({
    target: olMapTargetElementRef.value as HTMLElement,
    layers: [
      new TileLayer({
        source: new WMTS({
          url: 'http://t0.tianditu.gov.cn/img_c/wmts?tk=' + TIAN_DI_TU_KEY,
          layer: 'img',
          style: 'default',
          format: 'tiles',
          matrixSet: 'w',
          projection: 'EPSG:4326',
          tileGrid: new WMTSTileGrid({
            origin: [-180.0, 90.0],
            resolutions,
            matrixIds
          })
        })
      }),
      new TileLayer({
        source: new WMTS({
          url: 'http://t0.tianditu.gov.cn/cia_c/wmts?tk=' + TIAN_DI_TU_KEY,
          layer: 'cia',
          style: 'default',
          format: 'tiles',
          matrixSet: 'c',
          projection: 'EPSG:4326',
          tileGrid: new WMTSTileGrid({
            origin: [-180.0, 90.0],
            resolutions,
            matrixIds
          })
        })
      })
    ],
    view: new View({
      center: transform([116.397428, 39.90923], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4
    })
  })

  console.log(olMap)
}

onMounted(initOlMap)
</script>

<template>
  <div ref="olMapTargetElementRef" class="map"></div>
</template>
