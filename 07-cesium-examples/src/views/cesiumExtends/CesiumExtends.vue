<script lang="ts" setup>
import { Compass, ZoomControl, Measure, Drawer } from 'cesium-extends'
import * as Cesium from 'cesium'
import { onMounted } from 'vue'
import { Card, Form, FormItem, Button } from 'ant-design-vue'

let viewer: Cesium.Viewer
const init = async () => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
  
  viewer = new Cesium.Viewer('cesiumContainer')

  // 指南针
  new Compass(viewer)

  // 放大缩小
  new ZoomControl(viewer)

  // 测量

  // 绘制

  
}

onMounted(init)
</script>

<template>
  <div class="map-box">
    <Card class="map-box-operation">
      <Form layout="vertical">
        <FormItem label="绘制">
          <Button>点</Button>
          <Button>线</Button>
          <Button>面</Button>
          <Button>面</Button>
        </FormItem>
        <FormItem label="测量">
        </FormItem>
      </Form>

    </Card>
    <div id="credit-container"></div>
    <div id="base-layer-picker"></div>
    <div id="cesiumContainer"></div> 
  </div>
</template>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.map-box-operation {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 300px;
}

#cesiumContainer {
  width: 100%;
  height: 919px;
  overflow: hidden;
}
</style>
