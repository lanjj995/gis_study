<script>
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { transform, transformExtent } from 'ol/proj'
import ImageLayer from 'ol/layer/Image'
import { ImageStatic } from 'ol/source'
const TIAN_DI_TU_KEY = 'b58e95b35830cd576df218d62abedbdd'

export default {
  name: 'YuHangIndex',
  data() {
    return {
      map: null
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      const q = 0.0005
      const qq = -0.0035

      const tt = [
        119.68108999999999753 + qq,
        30.15869700000000009 + q,
        120.15048400000000584 + qq,
        30.56651600000000002 + q
      ]
      const layers = [
        // arcgis 地图
        new TileLayer({
          source: new XYZ({
            wrapX: false,
            url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          })
        }),
        // 天地图矢量
        new TileLayer({
          source: new XYZ({
            url: `http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
          }),
          opacity: 0.5
        }),
        // 天地图矢量标注
        new TileLayer({
          source: new XYZ({
            url: `http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
          }),
          opacity: 0.5
        }),
        // 地图蓝色png
        // new ImageLayer({
        //   source: new ImageStatic({
        //     url: '/Assets/earthbump1k4.jpg',
        //     projection: 'EPSG:4326',
        //     // imageExtent: transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857'),
        //     imageExtent: [-180, -90, 180, 90]
        //   }),
        //   opacity: 0.8
        // }),
        // 余杭区
        new ImageLayer({
          extent: transformExtent(tt, 'EPSG:4326', 'EPSG:3857'),
          source: new ImageStatic({
            url: '/Assets/personalized/yhzq.png',
            projection: 'EPSG:4326',
            imageExtent: tt
          }),
          opacity: 0.5
        })
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
      window.map = this.map
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
