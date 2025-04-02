import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()

// 创建box
const geometry = new THREE.BoxGeometry(100, 100, 100)
const material = new THREE.MeshLambertMaterial({
  color: new THREE.Color('orange')
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 0, 0)
scene.add(mesh)

// 创建gui 调试 box
const gui = new GUI()
const meshFolder = gui.addFolder('立方体')
meshFolder.addColor(mesh.material, 'color')
meshFolder.add(mesh.position, 'x').step(10)
meshFolder.add(mesh.position, 'y').step(10)
meshFolder.add(mesh.position, 'z').step(10)

// 创建坐标系辅助
{
  const axesHelper = new THREE.AxesHelper(200)
  scene.add(axesHelper)
}

// 创建点光源
const pointLight = new THREE.PointLight(0xffffff, 10000)
pointLight.position.set(80, 80, 80)
scene.add(pointLight)

// 调试点光源
const pointLightFolder = gui.addFolder('点光源')
pointLightFolder.add(pointLight.position, 'x').step(10)
pointLightFolder.add(pointLight.position, 'y').step(10)
pointLightFolder.add(pointLight.position, 'z').step(10)
pointLightFolder.add(pointLight, 'intensity').step(1000)

// 自定义的
const customFolder = gui.addFolder('自定义')
const customObject = {
  name: 'liukn',
  age: 18,
  sex: 0, // 0 女，1男
  isMarried: false,
  hot: '羽毛球',
  sayHello: function () {
    console.log('hello')
  }
}
customFolder.add(customObject, 'name')
customFolder.add(customObject, 'age').min(0).max(120).step(1)
customFolder.add(customObject, 'sex', { 女: 0, 男: 1 })
customFolder.add(customObject, 'isMarried')
customFolder.add(customObject, 'hot', ['羽毛球', '篮球', '足球'])
customFolder.add(customObject, 'sayHello')


// 创建渲染器
{
  const width = window.innerWidth
  const height = window.innerHeight

  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
  camera.position.set(200, 200, 200)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  function render() {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  render()

  document.body.append(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
}