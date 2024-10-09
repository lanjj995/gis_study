<script setup>
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { transform } from 'ol/proj'
import { onMounted, onUnmounted, useTemplateRef, ref, watch } from 'vue';
import { getRenderPixel } from 'ol/render.js';
const TIAN_DI_TU_KEY = 'b58e95b35830cd576df218d62abedbdd'

defineOptions({
  name: 'SwipeIndex'
})

const layers = {
  arcgis: new TileLayer({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    }),
    zIndex: 3
  }),
  vec_w: new TileLayer({
    source: new XYZ({
      url: `http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
    }),
    zIndex: 1
  }),
  // 天地图矢量标注
  cva_w: new TileLayer({
    source: new XYZ({
      url: `http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TIAN_DI_TU_KEY}`
    }),
    zIndex: 2
  }),
}

const mapEleRef = useTemplateRef('mapEleRef')

let map
const init = () => {
  map = new Map({
    target: mapEleRef.value,
    layers: Object.values(layers),
    view: new View({
      center: transform([108.44973102562304, 34.75684882738713], 'EPSG:4326', 'EPSG:3857'),
      zoom: 12.53,
      minZoom: 2,
      maxZoom: 18
    })
  })
  layers['arcgis'].on('prerender', (event) => {
    const ctx = event.context;
    const mapSize = map.getSize();
    const width = mapSize[0] * (left.value / 100);
    const tl = getRenderPixel(event, [0, 0]);
    const tr = getRenderPixel(event, [width, 0]);
    const bl = getRenderPixel(event, [0, mapSize[1]]);
    const br = getRenderPixel(event, [width, mapSize[1]]);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.closePath();
    ctx.clip();
  })
  layers['arcgis'].on('postrender', (event) => {
    const ctx = event.context;
    ctx.restore();
  })
}

const sliderRef = useTemplateRef('sliderRef')

const left = ref(50)

watch(left, () => {
  map.render()
})
const onMouseMove = (event) => {
  if (!moveAction) return
  const x = event.movementX

  left.value = (sliderRef.value.offsetLeft + x) / sliderRef.value.parentElement.offsetWidth * 100.0; 
  sliderRef.value.style.left = `${left.value}%`
}
const addMouseMoveEvent = () => {
  document.addEventListener('mousemove', onMouseMove)
}
onMounted(addMouseMoveEvent)

const removeMouseMoveEvent = () => {
  document.removeEventListener('mousemove', onMouseMove)
}
onUnmounted(removeMouseMoveEvent)

let moveAction = false
const onMouseDownSlider = () => {
  moveAction = true
}

const onMouseUpSlider = () => {
  moveAction = false
}

onMounted(init)

</script>

<template>
  <div class="page">
    <div ref="mapEleRef" class="map"></div>
    <div ref="sliderRef" class="slider" @mousedown="onMouseDownSlider" @mouseup="onMouseUpSlider"></div>
  </div>
</template>

<style scoped>
  .page {
    position: relative;
  }

  .slider {
    position: absolute;
    top: 0px;
    width: 5px;
    height: 100%;
    left: 50%;
    background-color: #d3d3d3;
    z-index: 6;
  }

  .slider:hover {
    cursor: ew-resize;
  }
</style>