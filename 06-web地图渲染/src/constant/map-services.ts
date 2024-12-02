import { ServiceType } from './gis'

export interface MapService {
  baseUrl: string,
  key: string,
  serviceType: ServiceType,
  params: Record<string, string>,
  getUrl: (x: number, y: number, z: number) => string
}

// 天地图
export const TIAN_DI: MapService = {
  baseUrl: 'http://t0.tianditu.gov.cn/vec_c/wmts',
  key: '73edd9ad4809147c692e178f0b192260',
  serviceType: ServiceType.WMTS,
  params: {
    SERVICE: 'WMTS',
    REQUEST: 'GetTile',
    VERSION: '1.0.0',
    LAYER: 'img',
    STYLE: 'default',
    TILEMATRIXSET: 'w',
    FORMAT: 'tiles',
    tk: '73edd9ad4809147c692e178f0b192260'
  } as Record<string, string>,
  getUrl(x: number, y: number, z: number) {
    const url = new URL(this.baseUrl)

    for (const key in this.params) {
      const value = this.params[key]
      url.searchParams.append(key, value)
    }

    url.searchParams.append('TILEROW', x.toString())
    url.searchParams.append('TILECOL', y.toString())
    url.searchParams.append('TILEMATRIX', z.toString())
    return url.href
  }
}

// 高德地图
export const GAODE: MapService = {
  baseUrl: 'https://webst02.is.autonavi.com/appmaptile',
  key: '',
  serviceType: ServiceType.XYZ,
  params: {
    style: '6'
  } as Record<string, string>,
  getUrl(x: number, y: number, z: number) {
    const url = new URL(this.baseUrl)

    for (const key in this.params) {
      const value = this.params[key]
      url.searchParams.append(key, value)
    }

    url.searchParams.append('x', x.toString())
    url.searchParams.append('y', y.toString())
    url.searchParams.append('z', z.toString())
    return url.href
  }
}
