<script setup>
import { Feature, Map, View } from 'ol'
import { Polygon, Point, Circle as CircleGeom } from 'ol/geom'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import { OSM } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Modify, Select, Translate } from 'ol/interaction'
import { Style, Fill, Stroke, Circle, Text } from 'ol/style'
import Collection from 'ol/Collection'
import { containsCoordinate, getCenter } from 'ol/extent'
import { all, never, primaryAction } from 'ol/events/condition'
import { ref, onMounted, useTemplateRef, computed } from 'vue'
import { Edit, Delete, Crop, DataAnalysis } from '@element-plus/icons-vue'
import ContextMenu from '@/components/ContextMenu.vue'

/*
  1. 设置编辑时的样式
    1.1 为多边形的顶点添加 点 
    1.2 为多边形每条边中点 添加点
    1.3 为多边形的中点添加点
  2. 设置约束
    1.1 只有 顶点与中点 的点可以编辑
    1.2 多边形中点 不可以编辑 只能拖动
  3. 右键点击时
    3.1 弹出操作栏
        未编辑状态
        - 开始编辑对象
        - 删除对象
        - 计算周长
        - 计算面积
        已编辑状态
        - 结束编辑对象
        - 还原编辑（初始）
        - 还原编辑（上一步）
        - 删除对象
        - 计算周长
        - 计算面积
*/

defineOptions({
  name: 'ModifyIndex'
})

const mapEleRef = useTemplateRef('mapEleRef')
let olMap

const baseLayer = new TileLayer({
  source: new OSM()
})

const initStyle = new Style({
  stroke: new Stroke({
    color: '#f00',
    width: 2
  }),
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  
})

const vectorLayer = new VectorLayer({
  id: 'vectorLayer',
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
          ],
          [
            [12124998.780721856, 4066063.4144506813],
            [12125015.45477714, 4062920.355029693],
            [12130092.704611044, 4062937.0290849763],
            [12130076.03055576, 4066130.1106718164],
            [12124998.780721856, 4066063.4144506813]
          ]
        ])
      }),
      new Feature({
        geometry: new Point(getCenter(new Polygon([
          [
            [12124674.766263325, 4066218.0592459845],
            [12124779.867177218, 4062778.3929731515],
            [12130226.005442536, 4062768.838344616],
            [12130245.114699608, 4066323.1601598766],
            [12124674.766263325, 4066218.0592459845]
          ],
          [
            [12124998.780721856, 4066063.4144506813],
            [12125015.45477714, 4062920.355029693],
            [12130092.704611044, 4062937.0290849763],
            [12130076.03055576, 4066130.1106718164],
            [12124998.780721856, 4066063.4144506813]
          ]
        ]).getExtent()))
      })
    ]
  }),
  style: initStyle
})

window.transform = transform
window.olMap = olMap

const initMap = () => {
  olMap = new Map({
    target: mapEleRef.value,
    layers: [baseLayer, vectorLayer],
    view: new View({
      center: transform([108.94231123668638, 34.260992867468005], 'EPSG:4326', 'EPSG:3857'),
      zoom: 14
    })
  })
}

let currentModifyFeature = null

const beforeShowContextMenu = (event) => {
  const pixel = olMap.getEventPixel(event)
  const features = olMap
    .getFeaturesAtPixel(pixel, {
      layerFilter: (layer) => {
        return layer.get('id') === 'vectorLayer'
      }
    })
    .filter((e) => e.getGeometry().getType() === 'Polygon')
  console.log(`features---`, features)
  currentModifyFeature = features[0]
  return !!currentModifyFeature
}

const init = () => {
  initMap()
}
onMounted(init)

const menuList = [
  { icon: Edit, text: '开始编辑对象', command: 'start-edit' },
  { icon: Edit, text: '结束编辑对象', command: 'end-edit' },
  { icon: Delete, text: '删除对象', command: 'delete' },
  { icon: Crop, text: '计算周长', command: 'calc-length' },
  { icon: DataAnalysis, text: '计算面积', command: 'calc-area' }
]

const contextMenuList = computed(() => {
  if (isEditing.value) {
    return menuList.filter((item) => item.command !== 'start-edit')
  } else {
    return menuList.filter((item) => item.command !== 'end-edit')
  }
})

const isEditing = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let modify
const modifyCoordinates = []

function getAllCoordinateByPolygon(polygon) {
  const getMiddleCoordinate = (coordinate1, coordinate2) => {
    var x1 = coordinate1[0]
    var y1 = coordinate1[1]
    var x2 = coordinate2[0]
    var y2 = coordinate2[1]
    return [(x1 + x2) / 2, (y1 + y2) / 2]
  }

  const vertexs = []
  const mids = []

  polygon.getLinearRings().forEach((linearRing) => {
    const coordinates = linearRing.getCoordinates()
    coordinates.forEach((e, i) => {
      e.type = 'vertex'
      vertexs.push(e)

      if (i > 0) {
        const mid = getMiddleCoordinate(coordinates[i - 1], e)
        mid.type = 'middle'
        mids.push(mid)
      }
    })
  })

  // return [...vertexs, ...mids]
  return [...vertexs]
}

function getCenterCoordinateByPolygon(polygon) {
  return getCenter(polygon.getExtent())
}

const createPointStyle = (coordinate, color) => {
  return new Style({
    geometry: new Point(coordinate),
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: color
      })
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let select

let translate

const onStartEdit = () => {
  isEditing.value = true

  currentModifyFeature.setStyle((feature) => {
    modifyCoordinates.length === 0

    const styles = [].concat(initStyle)

    if (feature.getGeometry().getType() !== 'Polygon') {
      return styles
    }

    // 中心点
    const centerCoordinate = getCenterCoordinateByPolygon(feature.getGeometry())
    styles.push(createPointStyle(centerCoordinate, 'black'))

    // 添加顶点与边的中心点
    getAllCoordinateByPolygon(feature.getGeometry()).forEach((coordinate) => {
      styles.push(createPointStyle(coordinate, coordinate.type === 'middle' ? 'blue' : 'green'))
    })

    return styles
  })

  // 添加 modify
  modify = new Modify({
    features: new Collection([currentModifyFeature]),
    pixelTolerance: 10,
    // insertVertexCondition: never,
    // // deleteCondition: never,
    style: (feature) => {
      const isHasCoordinate = () => {
        const coordinates = getAllCoordinateByPolygon(currentModifyFeature.getGeometry())
        return coordinates.some(e => e.toString() === feature.getGeometry().getCoordinates().toString())
      }
      
      return new Style({
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
        }),
        text: new Text({
          text: isHasCoordinate() ? '拖动该点后 修改位置' : '拖动该点后 新增点',
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          padding: [2, 2, 2, 2],
          textAlign: 'left',
          offsetX: 15,
        }),
      })
    }
  })
  function isCoordinateInCircle(coordinate, center, radius) {
        // 计算坐标和圆心之间的距离
        var dx = coordinate[0] - center[0];
        var dy = coordinate[1] - center[1];
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果距离小于或等于半径，那么坐标在圆内
        return distance <= radius;
      }
  translate = new Translate({
    features: new Collection([currentModifyFeature]),
    hitTolerance: 10,
    style: (feature) => {
      const centerCoordinate = getCenterCoordinateByPolygon(currentModifyFeature.getGeometry())
      if (feature.getGeometry().getCoordinates().toString() === centerCoordinate.toString()) {
        return new Style({
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
        }),
        text: new Text({
          text: '拖动该点后 整体平移',
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          padding: [2, 2, 2, 2],
          textAlign: 'left',
          offsetX: 15,
        }),
      })
      } else {
        return
      }
    },
    condition: (event) => {
      const centerCoordinate = getCenterCoordinateByPolygon(currentModifyFeature.getGeometry())
      const feature = new Feature({
        geometry: new Point(centerCoordinate),
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        })
      })
      console.log(`containsCoordinate(feature.getGeometry().getExtent(), event.coordinate)`, feature.getGeometry().getExtent(), event.coordinate, containsCoordinate(feature.getGeometry().getExtent(), event.coordinate))
      return primaryAction(event)
    }
  })

  olMap.addInteraction(translate)

  olMap.addInteraction(modify)
}

const onEndEdit = () => {
  isEditing.value = false
  currentModifyFeature.setStyle(initStyle)
  currentModifyFeature = null
  olMap.removeInteraction(modify)
}

const onCommand = (command) => {
  console.log(`command---`, command)
  switch (command) {
    case 'start-edit':
      onStartEdit()
      break
    case 'end-edit':
      onEndEdit()
      break
  }
}
</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
    <ContextMenu
      v-if="mapEleRef"
      :menuList="contextMenuList"
      :parentElement="mapEleRef"
      :beforeShowContextMenu="beforeShowContextMenu"
      @command="onCommand"
    >
    </ContextMenu>
  </div>
</template>

<style scoped></style>
