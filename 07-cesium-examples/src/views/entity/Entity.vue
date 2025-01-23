<script setup lang="ts">
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { ref, onMounted } from 'vue'
import { Form, FormItem, RadioGroup, type RadioChangeEvent } from 'ant-design-vue'

interface EntityVisible {
  point: boolean,
  polyline: boolean,
  polygon: boolean,
  polygonheight: boolean,
  ellipse: boolean,
  ellipsoid: boolean,
  box: boolean,
  rectangle: boolean,
  corridor: boolean,
  cylinder: boolean,
  wall: boolean,
  model: boolean,
}

const entityVisible = ref<EntityVisible>({
  point: false,
  polyline: false,
  polygon: false,
  polygonheight: false,
  ellipse: false,
  ellipsoid: false,
  box: false,
  rectangle: false,
  corridor: false,
  cylinder: false,
  wall: false,
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
            106.397477, 39.708692
          ]),
          width: 2,
          material: Cesium.Color.RED,
          // clampToGround: true
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
            116.397477, 29.708692,
            106.397477, 29.908692,
            106.357477, 39.908692
          ]),
          material: Cesium.Color.RED
        })
      })
    }
  },
  {
    label: 'polygonheight',
    value: 'polygonheight',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'polygonheight',
        name: '面',
        polygon: new Cesium.PolygonGraphics({
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            116.357477, 39.708692,
            116.397477, 29.708692,
            106.397477, 29.908692,
            106.357477, 39.908692
          ]),
          extrudedHeight: 200000.0,
          material: Cesium.Color.RED
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
        position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
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
    label: 'rectangle',
    value: 'rectangle',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'rectangle',
        name: '矩形',
        // position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
        rectangle: new Cesium.RectangleGraphics({
          coordinates: Cesium.Rectangle.fromDegrees(
            106.357477, 29.708692,
            116.357477, 39.708692
          ),
          extrudedHeight: 200000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
        })
      })
    }
  },
  {
    label: 'ellipse',
    value: 'ellipse',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'ellipse',
        name: '椭圆柱体',
        position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
        ellipse: new Cesium.EllipseGraphics({
          semiMajorAxis: 300000.0,
          semiMinorAxis: 100000.0,
          extrudedHeight: 500000.0,
          granularity: Cesium.Math.RADIANS_PER_DEGREE,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        })
      })
    }
  },
  {
    label: 'corridor',
    value: 'corridor',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'corridor',
        name: '通道',
        position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
        corridor: new Cesium.CorridorGraphics({
          positions: Cesium.Cartesian3.fromDegreesArray([
            116.367477, 39.708692, 106.367477, 39.708692, 106.367477, 29.708692,
          ]),
          width: 200000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
        })
      })
    }
  },
  {
    label: 'cylinder',
    value: 'cylinder',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'cylinder',
        name: '圆柱体',
        position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
        cylinder: new Cesium.CylinderGraphics({
          length: 100000.0,
          topRadius: 200000.0,
          bottomRadius: 200000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        })
      })
    }
  },
  {
    label: 'cone',
    value: 'cone',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'cone',
        name: '圆锥体',
        position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
        cylinder: new Cesium.CylinderGraphics({
          length: 100000.0,
          topRadius: 0,
          bottomRadius: 200000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        })
      })
    }
  },
  {
    label: 'ellipsoid',
    value: 'ellipsoid',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'ellipsoid',
        name: '椭圆体',
        position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
        ellipsoid: new Cesium.EllipsoidGraphics({
          radii: new Cesium.Cartesian3(200000.0, 200000.0, 200000.0),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        })
      })
    }
  },
  {
    label: 'wall',
    value: 'wall',
    createEntity: () => {
      return new Cesium.Entity({
        id: 'wall',
        name: '墙',
        position: Cesium.Cartesian3.fromDegrees(116.357477, 39.708692, 200),
        wall: new Cesium.WallGraphics({
          positions: Cesium.Cartesian3.fromDegreesArray([
            116.357477, 39.708692,
            115.357477, 38.708692,
            114.357477, 37.708692,
            113.357477, 36.708692,
            112.357477, 35.708692,
          ]),
          maximumHeights: [
            100000,
            100000,
            100000,
            100000,
            100000,
          ],
          minimumHeights: [
            0,
            0,
            0,
            0,
            0
          ],
          material: Cesium.Color.RED,
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
