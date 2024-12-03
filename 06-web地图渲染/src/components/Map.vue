<script setup lang="ts">
import Plus from '../assets/icon/Plus.vue'
import { useTemplateRef, ref, onMounted } from 'vue'
import { GAODE } from '../constant/map-services';
import { transform3857To4326, transform4326To3857, calcResolution, getTileImageUrl, calcTilePosition, calcPXByCoordinates } from '../util/index'
import { throttle, debounce } from 'lodash-es'

const mapRef = useTemplateRef('mapRef')
const canvasRef = useTemplateRef('canvasRef')

const zoom = ref(15)
const resolution = ref(0)
const center = ref([116.397713,39.904683])
const center3857 = ref(transform4326To3857(center.value))
const tileSize = 256

const initResolution = () => {
  resolution.value = calcResolution(zoom.value)
}

const initCanvasSize = () => {
  if (mapRef.value && canvasRef.value) {
    const { width, height } = mapRef.value.getBoundingClientRect()
    canvasRef.value.width = width
    canvasRef.value.height = height
  }
}

const initCenterCoordinates = () => {
  const [ x, y ] = calcTilePosition(center3857.value, zoom.value)

  const tilePosition = [x * tileSize, y * tileSize]
  const centerPosition = calcPXByCoordinates(center3857.value, resolution.value)

  return [tilePosition[0] - centerPosition[0], tilePosition[1] - centerPosition[1]]
}


const clear = () => {
  const canvasContext = canvasRef.value!.getContext('2d')!
  canvasContext.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

const renderTile = () => {
  const [ centerTileX, centerTileY ] = calcTilePosition(center3857.value, zoom.value)
  const [ centerX, centerY ] = initCenterCoordinates()
  const maxX = canvasRef.value!.width / 2
  const maxY = canvasRef.value!.height / 2
  const canvasContext = canvasRef.value!.getContext('2d')!
  const offset = tileSize
  canvasContext.translate(maxX, maxY)
  const getImageSrc = (x: number, y: number, z: number = zoom.value) => {
    return getTileImageUrl(GAODE, x, y, z)
  }
  const renderTileImage = (src: string, dx: number, dy: number) => {
    const image = new Image()
    image.src = src
    image.onload = () => {
      canvasContext.drawImage(image, dx, dy)
    }
  }
  const minRowNum = -Math.ceil(maxX / tileSize) - 1
  const maxRowNum = Math.ceil(maxX / tileSize) + 1
  const minColNum = -Math.ceil(maxY / tileSize) - 1
  const maxColNum = Math.ceil(maxY / tileSize) + 1

  for (let i = minRowNum; i < maxRowNum; i++) {
    for (let j = minColNum; j < maxColNum; j++) {
      const src = getImageSrc(i + centerTileX, j + centerTileY)
      let x = i * offset + centerX
      let y = j * offset + centerY

      renderTileImage(src, x, y)
    }
  }
}

let isMouseDown = false
const initMouseEvent = () => {
  document.addEventListener('mousedown', () => {
    isMouseDown = true
  })
  document.addEventListener('mouseup', () => {
    isMouseDown = false
  })
  document.addEventListener('mousemove', (event) => {
    if (!isMouseDown) return
    const resolution = calcResolution(zoom.value)
    let mx = event.movementX * resolution;
    let my = event.movementY * resolution;
    center3857.value = [center3857.value[0] += mx, center3857.value[1] + my]
    center.value = transform3857To4326(center3857.value)
    clear()
    renderTile()
  })
}


const init = () => {
  initMouseEvent()
  initResolution()
  initCanvasSize()
  renderTile()
}

onMounted(init)

const onZoomIn = () => {

}

const onZoomOut = () => {

}

</script>

<template>
  <div class="map" ref="mapRef">
    <canvas ref="canvasRef" id="map-render"></canvas>
    <div class="map-control flex flex-col">
      <button class="btn btn-primary btn-square btn-sm" @click="onZoomIn">+</button>
      <button class="btn btn-primary btn-square btn-sm" @click="onZoomOut">-</button>
    </div>

    <div class="map-bottom flex flex-row bg-slate-50 p-1">
      <p class="text-sm text-black">层级:{{ zoom }}, 中心经纬度: {{ center }}</p>
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

/* .map #map-render {
  width: 100%;
  height: 100%;
} */

.map .map-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.map .map-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>