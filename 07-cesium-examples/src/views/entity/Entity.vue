<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { ref, onMounted } from 'vue'
import { Form, FormItem, RadioGroup, type RadioChangeEvent } from 'ant-design-vue'

interface EntityVisible {
  point: boolean,
  polyline: boolean,
  polygon: boolean,
  model: boolean,
}

const entityVisible = ref<EntityVisible>({
  point: false,
  polyline: false,
  polygon: false,
  model: false,
})

interface Entity {
  label: string,
  value: keyof EntityVisible,
  createEntity: () => Cesium.Entity | Promise<Cesium.Entity>
}

const entities = [
  {
    label: 'point',
    value: 'point',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'point',
        name: '点',
        position: Cesium.Cartesian3.fromDegrees(116.367477, 39.808692, 200),
        point: new Cesium.PointGraphics({
          color: Cesium.Color.RED,
          pixelSize: 10
        })
      })
    }
  },
  {
    label: 'polyline',
    value: 'polyline',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'polyline',
        name: '线',
        // positions: [Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200)],
        polyline: new Cesium.PolylineGraphics({
          positions: Cesium.Cartesian3.fromDegreesArray([
            116.357477, 39.708692,
            116.397477, 39.908692
          ]),
          width: 2,
          material: Cesium.Color.RED
        })
      })
    }
  },
  {
    label: 'polygon',
    value: 'polygon',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'polygon',
        name: '面',
        polygon: new Cesium.PolygonGraphics({
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            116.357477, 39.708692,
            116.397477, 39.708692,
            116.397477, 39.908692,
            116.357477, 39.908692
          ])
        })
      })
    }
  },
  {
    label: 'box',
    value: 'box',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'box',
        name: '面',
        box: new Cesium.BoxGraphics({
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        })
      })
    }
  },
  {
    label: 'model',
    value: 'model',
    createEntity: async () => {
      return new Cesium.Entity({
        id: 'model',
        name: '飞机模型',
        position: Cesium.Cartesian3.fromDegrees(116.397477, 39.908692, 200),
        model: new Cesium.ModelGraphics({
          uri: await Cesium.IonResource.fromAssetId(2975495),
          minimumPixelSize: 64,
          maximumScale: 20000
        })
      })
    }
  }
] as Entity[]

const radioVisibleOptions = [
  { label: '显示', value: true },
  { label: '隐藏', value: false },
]

let viewer: Cesium.Viewer
const initCesium = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
  
  viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false, // 动画
    baseLayerPicker: true, // baseLayerPicker
    fullscreenButton: true, // 全屏按钮
    geocoder: true, // 地理编码
    homeButton: true, // 首页按钮
    sceneModePicker: false, // 场景模式选择器
    selectionIndicator: false, // 选择指示器
    infoBox: false, // 信息框
    navigationHelpButton: true, // 导航帮助按钮
    navigationInstructionsInitiallyVisible: false, // 导航帮助按钮
    scene3DOnly: false, // 3D模式
    timeline: false, // 时间轴
  })

  // credit 隐藏
  viewer.creditDisplay.container.style.display = 'none'
  // 隐藏 月
  viewer.scene.moon.show = false
  // 隐藏 太阳
  viewer.scene.sun.show = false
  // 隐藏 大气层
  viewer.scene.skyAtmosphere.show = false
  // 隐藏 天空盒
  viewer.scene.skyBox.show = false
}

const coordinate = ref<[number, number]>([0, 0])
const initMousePosition = () => {
  const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  screenSpaceEventHandler.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
    const cartesian = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.ellipsoid)
    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian, viewer.scene.ellipsoid)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
      coordinate.value = [parseFloat(longitude), parseFloat(latitude)]
    } else {
      coordinate.value = [0, 0]
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

const onChange = async (event: RadioChangeEvent, item: Entity) => {
  let entity = viewer.entities.getById(item.value)
  if (!entity) {
    entity = await item.createEntity()
    entity.show = false
    viewer.entities.add(entity)
  }
  if (event.target.value) {
    entity.show = true
    viewer.flyTo(entity)
  } else {
    entity.show = false
  }
}

const init = () => {
  initCesium()
  initMousePosition()
}

onMounted(init)

</script>

<template>
  <div class="map-box">
    <div class="map-box-operation">
      <Form>
        <FormItem label="坐标：">
          {{ coordinate.join(',') }}
        </FormItem>
        <FormItem v-for="item in entities" :key="item.value" :label="item.label">
          <RadioGroup v-model:value="entityVisible[item.value]" :options="radioVisibleOptions" @change="onChange($event, item)"></RadioGroup>
        </FormItem>
      </Form>
    </div>
    <div id="cesiumContainer"></div> 
  </div>
</template>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-box-operation {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 300px;
  padding: 10px;
  background-color: #fff;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
}
</style>
