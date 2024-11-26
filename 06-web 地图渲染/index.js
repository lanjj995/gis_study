// 高德地图

const XYZ_TILE_URL = 'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile'

const CENTER = []

const ZOOM = 16

// 地球半径
const EARTH_RADIUS = 6378137

// 地球周长
const EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS

function getXYZByCenter([lng, lat]) {
  // 转换 EPSG:3857 坐标
}

function getResolution(zoom, tileSize = 256) {
  const tileNumber = Math.pow(2, zoom)
}

// 通过EPSG:3857获取XYZ
function getXYZBy3857(x, y) {
  x += (EARTH_CIRCUMFERENCE / 2)
  y = (EARTH_CIRCUMFERENCE / 2) - y


}

// 经纬度转换EPSG:3857 坐标
function lnglatToMercator(lng, lat) {
  const R = 6378137; // 地球半径，单位：米
  // 角度转弧度
  lat = (lat * Math.PI) / 180;
  lng = (lng * Math.PI) / 180;
  const x = R * lng;
  const y = R * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lat));
  return { x, y };
}