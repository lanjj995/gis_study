<script setup>
import { onMounted, useTemplateRef } from 'vue';

defineOptions({ name: 'TestIndex' })

const canvasRef = useTemplateRef('canvasRef');
const initCanvas = () => {
  const image = new Image()
  image.src = 'https://openlayers.org/theme/img/logo-dark.svg'
  image.onload = function() {
    console.log(`width, height`, image.width, image.height)
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    const pattern = ctx.createPattern(canvas, 'repeat')

    const ctx2 = canvasRef.value.getContext('2d')
    ctx2.fillStyle = pattern
    ctx2.fillRect(0, 0, 400, 400)
  }
}

onMounted(initCanvas)

</script>

<template>
  <div>
    <canvas ref="canvasRef" width="400" height="400"></canvas>
  </div>
</template>

<style lang="css" scoped>
  canvas {
    border: 1px solid #f0f0f0;
  }
</style>