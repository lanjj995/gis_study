<script setup>
import { Feature, Map, View } from 'ol'
import { Polygon } from 'ol/geom'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import { OSM } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Modify } from 'ol/interaction'
import { Circle } from 'ol/style'
import Collection from 'ol/Collection'
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
          ]
        ])
      })
    ]
  })
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
  const features = olMap.getFeaturesAtPixel(pixel, {
    layers: (layer) => {
      return layer.get('id') === 'vectorLayer'
    }
  })
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
  { icon: DataAnalysis, text: '计算面积', command: 'calc-area' },
]

const contextMenuList = computed(() => {
  if (isEditing.value) {
    return menuList.filter(item => item.command !== 'start-edit')
  } else {
    return menuList.filter(item => item.command !== 'end-edit')
  }
})

const isEditing = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let modify
const onStartEdit = () => {
  isEditing.value = true

  // 添加 modify
  modify = new Modify({
    features: new Collection([currentModifyFeature]),
    style: (feature) => {
      console.log(`feature-------`, feature)
      const styles = []
      if (feature.getGeometry().getType() !== 'Polygon') {
        return styles
      }

      feature.getGeometry().getCoordinates().forEach(coordinate => {
        styles.push(new Style({
          geometry: new Point(coordinate),
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: '#f00',
            }),
            stroke: new Stroke({
              color: "rgba(0, 0, 0, 0.5)",
              width: 1,
            }),
          }),
        }))
      })
    }
  })

  olMap.addInteraction(modify)
}

const onEndEdit = () => {
  isEditing.value = false
  olMap.removeInteraction(modify)
}

const onCommand = (command) => {
  console.log(`command---`, command)
  switch (command) {
    case 'start-edit':
      onStartEdit();
      break;
    case 'end-edit':
      onEndEdit();
      break;
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

<style scoped>
</style>
