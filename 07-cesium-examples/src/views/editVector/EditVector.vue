<script setup>
import { Ion, Viewer as CesiumViewer, CustomDataSource, GeoJsonDataSource, Color, SceneMode, CallbackProperty } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { ref, onMounted } from 'vue'
import { Form, FormItem, RadioGroup } from 'ant-design-vue'
import { useImageryLayer, useDraw, useSelect, useHistory } from './hooks'


const Earth = {
  viewer: null
}
let Viewer
let dataSource = new CustomDataSource('edit-vector')


// 历史
const { toolbar: undoAndRedoToolbar, historyManager } = useHistory(Earth)

// 切片底图
const { changeImageryLayer } = useImageryLayer(Earth)

// 绘制
const { drawToolbar } = useDraw(Earth, dataSource, historyManager)

// 选择
const { selectToolbar } = useSelect(Earth)

const initCesium = async () => {
  Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

  viewer = new CesiumViewer('cesiumContainer', {
    animation: false, // 动画
    baseLayerPicker: true, // baseLayerPicker
    fullscreenButton: true, // 全屏按钮
    geocoder: true, // 地理编码
    homeButton: true, // 首页按钮
    sceneModePicker: false, // 场景模式选择器
    sceneMode: SceneMode.SCENE2D,
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

  Earth.viewer = viewer
}

const loadGeojson = async () => {
  const geojsonDataSource = await GeoJsonDataSource.load('/test.geojson', {
    stroke: Color.RED,
    fill: Color.fromAlpha(Color.RED, 0.5),
    strokeWidth: 3
  })
  geojsonDataSource.entities.values.forEach(entity => {
    entity.polyline = {
      positions: entity.polygon.hierarchy.getValue().positions.concat(entity.polygon.hierarchy.getValue().positions[0]),
      material: Color.RED,
      width: 3,
      clampToGround: true, // 根据需求设置是否贴地
    }
    dataSource.entities.add(entity)
  })
  viewer.flyTo(dataSource)
}

const initCustomDataSource = () => {
  viewer.dataSources.add(dataSource)
}

const init = () => {
  initCesium()

  initCustomDataSource()

  // 加载geojson
  loadGeojson()
}


onMounted(init)

const operationToolbar = ref([
  ...selectToolbar,
  ...drawToolbar
])
const currentToolbar = ref(operationToolbar.value[0])

const operationGroups = computed(() => {
  return operationToolbar.value.reduce((acc, item) => {
    const group = acc.find(e => e.name === item.group)
    if (group) {
      group.toolbars.push(item)
    } else {
      acc.push({
        name: item.group,
        toolbars: [
          item
        ]
      })
    }
    return acc
  }, [])
})

const onToolbarAction = (item) => {
  currentToolbar.value.removeAction()
  nextTick(() => {
    currentToolbar.value = item
    item.action()
  })
}
</script>

<template>
  <div class="map-box">
    <header class="asi-header">
      <!-- 操作 -->
      <div
        v-for="group in operationGroups"
        :key="group.name"
        class="asi-toolbar-group-item"
      >
        <div
          v-for="item in group.toolbars"
          :key="item.id"
          class="asi-toolbar-item"
          :class="{ 'asi-toolbar-item--active': item === currentToolbar }"
          @click="onToolbarAction(item)"
        >
          <div class="asi-toolbar-item-icon">
            <ElIcon>
              <Plus />
            </ElIcon>
          </div>
          <div class="asi-toolbar-item-text">{{ item.name }}</div>
        </div>
      </div>

      <!-- 撤回、恢复 -->
      <div class="asi-toolbar-group-item ml-auto">
        <div
          v-for="item in undoAndRedoToolbar"
          :key="item.id"
          class="asi-toolbar-item"
          :class="{ 'asi-toolbar-item--disabled': item.disable }"
          @click="onToolbarAction(item)"
        >
          <div class="asi-toolbar-item-icon">
            <ElIcon>
              <Plus />
            </ElIcon>
          </div>
          <div class="asi-toolbar-item-text">{{ item.name }}</div>
        </div>
      </div>
    </header>
    
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

.annotate-sample-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.asi-header {
  height: 64px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #1c1e21;
  border-bottom: 1px solid #000;
}

.asi-main {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.asi-aside {
  width: 240px;
  flex-shrink: 0;
  background-color: #1c1e21;
  border-right: 1px solid #000;
}

.asi-toolbar-group-item {
  display: flex;
  flex-direction: row;
}

.asi-toolbar-group-item + .asi-toolbar-group-item {
  margin-left: 6px;
}

.asi-toolbar-group-item.ml-auto {
  margin-left: auto;
}

.asi-toolbar-item {
  min-width: 80px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
}

.asi-toolbar-item--disabled {
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

.asi-toolbar-item.asi-toolbar-item--disabled:hover {
  color: rgba(255, 255, 255, 0.3);
}

.asi-toolbar-item:hover, .asi-toolbar-item--active {
  color: #fff;
}

.asi-toolbar-item + .asi-toolbar-item {
  margin-left: 2px;
}

.asi-toolbar-item .asi-toolbar-item-icon{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.15);
}

.asi-toolbar-item .asi-toolbar-item-text {
  font-size: 14px;
  text-align: center;
  margin-top: 4px;
}

.asi-content {
  width: 100%;
  height: 100%;
  overflow: hidden;

}


.asi-map {
  height: calc(100% - 60px);
  overflow: hidden;
}

.asi-btns {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1c1e21;
}

.asi-aside-top {
  height: 100%;
}

.asi-image {
  margin: 20px 16px 20px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 100%;
  overflow-y: auto;
}

.asi-image .asi-image-item {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  margin: 4px;
  background-color: #000;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
}

.asi-image .asi-image-item.asi-image-item--active {
  border-color: var(--el-color-primary);
}

.asi-image .asi-image-item .asi-image-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asi-image .asi-image-item .asi-image-item-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  background-color: rgba(0, 0, 0, 0.5);
}

.asi-image .asi-image-item .asi-image-item-status {
  position: absolute;
  right: 6px;
  top: 6px;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.asi-image .asi-image-item .asi-image-item-status::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color);
  margin-right: 4px;
}

</style>
