// 地球半径
export const EARTH_RADIUS = 6378137

// 地球周长
export const EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS

export enum ServiceType {
  WMS = 'WMS',
  WMTS = 'WMTS',
  XYZ = 'XYZ'
}