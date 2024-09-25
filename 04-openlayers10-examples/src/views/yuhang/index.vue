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
  name: 'YuHangIndex',
  data() {
    return {
      map: null
    }
  },
  mounted() {
    this.register4490()
    this.initMap()
  },
  methods: {
    register4490() {
      const projection_4490 = new Projection({
        code: 'EPSG:4490',
        extent: [-180, -90, 180, 90],
        units: 'degress'
      })
      addProjection(projection_4490)
      proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs +type=crs')
      register(proj4)
    },
    calcResolution(zoom) {
      // 开始定义WMTS服务的重要参数 /////////////////////////////////////////
      // 1 定义CGCS2000大地坐标系，代号4490
      var projection = new Projection({
          code: 'EPSG:4490',
          extent: [-180, -90, 180, 90],
          units : Units.DEGREES // 这个是经纬度默认
      });
      // EPSG:4490的地图半径是6378137 与默认的不同
      projection.getMetersPerUnit = function () {
          let meters_unit = 2 * Math.PI * 6378137 / 360;
          return meters_unit * 1.057080925592217; // 因为这个倍数是 (0.28E-3)/(0.025428516728689246/96) = 1.057080925592217
      };
      addProjection(projection);

      const projectionExtent = projection.getExtent();
      const size = getWidth(projectionExtent) / 256;

      // // 2 计算每个层级所对应的分辨率，按照天地图统一的规则从1到20，总共20级，第0级就是一张瓦片全世界
      // var resolutions = new Array(21);
      // for (let z = 0; z < 21; ++z) {
      //     // 统一的规则，从1到20
      //     resolutions[z] = size / Math.pow(2, z);
      // }
      // 省级节点提供的瓦片总共14级，从7到20
      var resolutions2 = new Array(zoom);
      for (let z = 0; z < zoom; ++z) {
          // generate resolutions and matrixIds arrays for this WMTS
          resolutions2[z] = size / Math.pow(2, z + 7);
      }
      return resolutions2
    },
    initMap() {
      // const q = 0.0005
      // const qq = -0.0035

      // const tt = [
      //   119.68108999999999753 + qq,
      //   30.15869700000000009 + q,
      //   120.15048400000000584 + qq,
      //   30.56651600000000002 + q
      // ]

      // console.log(`tt`, JSON.stringify(tt))
    

      const resolutions = [
        6.866455206208891E-4,
        3.4332276031044456E-4,
        1.7166138015522228E-4,
        8.583069007761114E-5,
        4.291534503880557E-5,
        2.1457672519402785E-5,
        1.0728836259701392E-5,
        5.364418129850696E-6,
        2.682209064925349E-6,
        1.3411045324626745E-6
      ];

      const layers = [
        // arcgis 地图
        new TileLayer({
          source: new XYZ({
            wrapX: false,
            url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          })
        }),

        
        // wmts
        // new TileLayer({
        //   source: new WMTS({
        //     url: 'http://192.168.1.128:8011/geoscb/gwc/service/wmts',
        //     layer: 'yhimgmap_2023_2_20cm',
        //     matrixSet: 'EPSG:4490_yhimgmap_2023_2_20cm',
        //     format: 'image/jpeg',
        //     style: 'default',
        //     projection: 'EPSG:4490',
        //     tileGrid: new WMTSTileGrid({
        //       projection: 'EPSG:4490',
        //       origin: [-180.0, 90.0],
        //       matrixIds: ['EPSG:4490_yhimgmap_2023_2_20cm:0', 'EPSG:4490_yhimgmap_2023_2_20cm:1', 'EPSG:4490_yhimgmap_2023_2_20cm:2', 'EPSG:4490_yhimgmap_2023_2_20cm:3', 'EPSG:4490_yhimgmap_2023_2_20cm:4', 'EPSG:4490_yhimgmap_2023_2_20cm:5', 'EPSG:4490_yhimgmap_2023_2_20cm:6', 'EPSG:4490_yhimgmap_2023_2_20cm:7', 'EPSG:4490_yhimgmap_2023_2_20cm:8', 'EPSG:4490_yhimgmap_2023_2_20cm:9'],
        //       resolutions
        //     })
        //   })
        // })

        new TileLayer({
          source: new WMTS({
            url: 'http://192.168.1.128:8011/geoscb/gwc/service/wmts',
            layer: 'yhdem_4m',
            matrixSet: 'EPSG:4490_yhdem_4m',
            format: 'image/jpeg',
            style: 'default',
            projection: 'EPSG:4490',
            tileGrid: new WMTSTileGrid({
              projection: 'EPSG:4490',
              origin: [-180.0, 90.0],
              matrixIds: ['EPSG:4490_yhdem_4m:0', 'EPSG:4490_yhdem_4m:1', 'EPSG:4490_yhdem_4m:2', 'EPSG:4490_yhdem_4m:3', 'EPSG:4490_yhdem_4m:4', 'EPSG:4490_yhdem_4m:5', 'EPSG:4490_yhdem_4m:6', 'EPSG:4490_yhdem_4m:7', 'EPSG:4490_yhdem_4m:8', 'EPSG:4490_yhdem_4m:9'],
              resolutions
            })
          })
        })


        // // 天地图矢量
        // new TileLayer({
        //   source: new XYZ({
        //     url: `http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
        //   }),
        //   opacity: 0.5
        // }),
        // // 天地图矢量标注
        // new TileLayer({
        //   source: new XYZ({
        //     url: `http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
        //   }),
        //   opacity: 0.5
        // }),
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
        // new ImageLayer({
        //   extent: transformExtent([119.67759,30.159197,120.146984,30.567016], 'EPSG:4326', 'EPSG:3857'),
        //   source: new ImageStatic({
        //     url: '/Assets/personalized/yhzq.png',
        //     projection: 'EPSG:4326',
        //     imageExtent: [119.67759,30.159197,120.146984,30.567016]
        //   }),
        //   opacity: 0.5
        // })
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
