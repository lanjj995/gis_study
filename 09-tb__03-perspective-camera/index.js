import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'

const scene = new THREE.Scene()

// 创建坐标系辅助
const axesHelper = new THREE.AxesHelper(200)
// scene.add(axesHelper)

// 创建渲染器
const width = window.innerWidth
const height = window.innerHeight

// 创建相机
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
camera.position.set(200, 200, 200)
camera.lookAt(0, 0, 0)

// 相机Helper
const camera2 = new THREE.PerspectiveCamera(20, 16 / 9, 100, 300);
const cameraHelper = new THREE.CameraHelper(camera2)
scene.add(cameraHelper)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)

function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()

document.body.append(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)