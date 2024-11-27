<script>
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { get as getProjection, transform, transformExtent, Projection, addProjection } from 'ol/proj'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import ImageLayer from 'ol/layer/Image'
import {  WMTS, ImageStatic } from 'ol/source'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { getWidth, getTopLeft } from 'ol/extent'
const TIAN_DI_TU_KEY = 'b58e95b35830cd576df218d62abedbdd'

export default {
  name: 'WMTSIndex',
  data() {
    return {
      map: null,
      options: {
          "id": "173192121840530276",
          "name": "矢量地形",
          "url": "http://192.168.1.128:8011/geoscb/gwc/service/wmts",
          "layer": "yhdem_4m",
          "type": "WMTS",
          "format": "image/png",
          "style": "",
          "tileMatrixSetID": "EPSG:4490_yhdem_4m",
          "anno": "",
          "tileMatrixLabels": "['1', '2', '3','4','5','6','7','8','9','10','EPSG:4490_yhdem_4m:0', 'EPSG:4490_yhdem_4m:1', 'EPSG:4490_yhdem_4m:2', 'EPSG:4490_yhdem_4m:3', 'EPSG:4490_yhdem_4m:4', 'EPSG:4490_yhdem_4m:5', 'EPSG:4490_yhdem_4m:6', 'EPSG:4490_yhdem_4m:7', 'EPSG:4490_yhdem_4m:8', 'EPSG:4490_yhdem_4m:9']"
      }
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    getArcGisLayer() {
      return new TileLayer({
        source: new XYZ({
          wrapX: false,
          url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        })
      })
    },

    getYuHangLayer() {
      
    },

    initMap() {
      const layers = [
        // arcgis 地图
        this.getArcGisLayer()
      ]
      this.map = new Map({
        target: this.$refs.mapEleRef,
        layers,
        view: new View({
          center: transform([119.978959, 30.27365], 'EPSG:4326', 'EPSG:3857'),
          zoom: 12,
          minZoom: 2,
          maxZoom: 18,
          extent: transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857')
        })
      })
    }
  }
}
</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
  </div>
</template>

<style scoped></style>
