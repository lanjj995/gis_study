<script setup lang="ts">
import { useTemplateRef, ref, onMounted } from 'vue'
import { GAODE } from '../constant/map-services';
import { transform4326To3857, calcResolution, getTileImageUrl, calcTilePosition, calcPXByCoordinates } from '../util/index'

const canvasRef = useTemplateRef('canvasRef')

const zoom = ref(18)
const resolution = ref(0)
const center = [116.397713,39.904683]
const center3857 = transform4326To3857(center)
const tileSize = 256

const getTileImage = async () => {
  const z = zoom.value
  const [ x, y ] = calcTilePosition(center3857, z)
  const imageUrl = getTileImageUrl(GAODE, x, y, z)
  console.log(`imageUrl`, imageUrl)
}

const initResolution = () => {
  resolution.value = calcResolution(zoom.value)
}

const init = () => {
  initResolution()
  if (canvasRef.value) {
    const { width, height } = canvasRef.value.getBoundingClientRect()
    console.log(`width`, width, height)
    // 计算center tilePosition
    const [ x, y ] = calcTilePosition(center3857, zoom.value)

    // 当前 tilePosition px
    const tilePosition = [x * tileSize, y * tileSize]
    const centerPosition = calcPXByCoordinates(center3857, resolution.value)
    let offset = [
      centerPosition[0] - tilePosition[0],
      centerPosition[1] - tilePosition[1]
    ]

    const context = canvasRef.value.getContext('2d')
    if (context) {
      context.translate(width / 2, height / 2)
      const image = new Image()
      image.width = tileSize
      image.height = tileSize
      image.src = getTileImageUrl(GAODE, x,y,zoom.value)
      image.onload = () => {
        console.log(`image--`, image, offset)
        context.drawImage(image, -offset[0], -offset[1])
      }
    }

  }
}

onMounted(init)

</script>

<template>
  <div class="map">
    <canvas ref="canvasRef" id="map-render"></canvas>
    <div class="map-control">
      <button class="btn-primary">Button</button>
    </div>

    <!-- 十字 -->
  </div>
</template>

<style scoped>
.map {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.map::before,
.map::after {
  content: '';
  position: absolute;
  background-color: #888;
}
.map::before {
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
}
.map::after {
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
}

.map #map-render {
  width: 100%;
  height: 100%;
}

.map .map-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>