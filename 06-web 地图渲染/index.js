// 高德地图

const XYZ_TILE_URL = 'https://webst02.is.autonavi.com/appmaptile'

const ARG_TILE_URL = 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile'

// const CENTER = [116.397604, 39.907694]
const CENTER = [116.397713,39.904683]

const ZOOM = 18

const TILE_SIZE = 256

// 地球半径
const EARTH_RADIUS = 6378137

// 地球周长
const EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS

function getXYZBy4326(coordinates) {
  // 转换 EPSG:3857 坐标
  return getXYZBy3857(...lnglatToMercator(coordinates))
}

function getResolution(zoom) {
  const tileNumber = Math.pow(2, zoom)
  const tileTotalPX = tileNumber * TILE_SIZE
  return EARTH_CIRCUMFERENCE / tileTotalPX
}

// 通过EPSG:3857获取XYZ
function getXYZBy3857(x, y) {
  x += (EARTH_CIRCUMFERENCE / 2)
  y = (EARTH_CIRCUMFERENCE / 2) - y
  const resolution = getResolution(ZOOM)
  const row = Math.floor(x / resolution / TILE_SIZE)
  const col = Math.floor(y / resolution / TILE_SIZE)
  return [row, col]
}

// 经纬度转换EPSG:3857 坐标
function lnglatToMercator([lng, lat]) {
  const R = 6378137; // 地球半径，单位：米
  // 角度转弧度
  lat = (lat * Math.PI) / 180;
  lng = (lng * Math.PI) / 180;
  const x = R * lng;
  const y = R * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lat));
  return [x, y];
}

function getSrc() {
  const [x, y] = getXYZBy4326(CENTER)
  const z = ZOOM
  return `${XYZ_TILE_URL}?style=6&x=${x}&y=${y}&z=${z}`
  // return `${ARG_TILE_URL}/${z}/${y}/${x}`
}

window.addEventListener('load', () => {
  const imgEle = document.createElement('img')
  imgEle.src = getSrc()
  imgEle.style.width = '256px'
  imgEle.style.height = '256px'
  imgEle.style.position = 'absolute'
  imgEle.style.left = '100px'
  imgEle.style.top = '100px'
  document.body.appendChild(imgEle)
})