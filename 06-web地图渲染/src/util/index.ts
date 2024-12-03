import { EARTH_CIRCUMFERENCE, EARTH_RADIUS } from '../constant/gis'
import type { MapService } from '../constant/map-services'

/**
 * @description: 4326 转 3857
 * @param {Array} coordinates
 * @return {*}
 */
export function transform4326To3857(coordinates: Array<number>) {
  let [lng, lat] = coordinates
  lng = (lng * Math.PI) / 180
  lat = (lat * Math.PI) / 180
  const x = EARTH_RADIUS * lng
  const y = EARTH_RADIUS * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lat))
  return [x, y]
}


const radToAngle = (rad: number) => {
  return rad * (180 / Math.PI)
}
export function transform3857To4326(coordinates: Array<number>) {
  const [x, y] = coordinates;
  let lng = radToAngle(x) / EARTH_RADIUS
  let lat = radToAngle((2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - (Math.PI / 2)))
  return [lng, lat]
}

/**
 * @description: 获取分辨率
 * @param {number} zoom 当前缩放级别 eq:1
 * @param {number} tileSize 瓦片大小 eq:256
 * @return {number}
 */
export function calcResolution(zoom: number = 0, tileSize: number = 256) {
  const tileNumber = Math.pow(2, zoom)
  return EARTH_CIRCUMFERENCE / tileNumber / tileSize
}

/**
 * @description: 根据 coordinates（EPSG:3857） 计算出当前瓦片的 col row
 * @param {Array} coordinates
 * @param {number} zoom
 * @return {*}
 */
export function calcTilePosition(coordinates: Array<number>, zoom: number, tileSize: number = 256) {
  let [x, y] = coordinates
  x += (EARTH_CIRCUMFERENCE / 2)
  y = (EARTH_CIRCUMFERENCE / 2) - y
  const resolution = calcResolution(zoom, tileSize)
  const row = Math.floor(x / resolution / tileSize)
  const col = Math.floor(y / resolution / tileSize)
  return [row, col]
}

/**
 * @description: 获取 TileImageUrl
 * @param {MapService} service
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {*}
 */
export function getTileImageUrl(service: MapService, x: number, y: number, z: number) {
  return service.getUrl(x, y, z);
}

export function calcPXByCoordinates(coordinates: Array<number>, resolution: number) {
  let [x, y] = coordinates;
  x += (EARTH_CIRCUMFERENCE / 2)
  y = (EARTH_CIRCUMFERENCE / 2) - y

  const row = Math.floor(x / resolution)
  const col = Math.floor(y / resolution)
  
  return [row, col]
}