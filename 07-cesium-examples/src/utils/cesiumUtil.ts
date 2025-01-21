import type { ImageryLayer, ImageryLayerCollection } from 'cesium'

export function findImageryLayer(imageryLayers: ImageryLayerCollection, find: string | number | ((e: ImageryLayer) => boolean)): ImageryLayer | undefined {
  let finder: (e: ImageryLayer) => boolean
  if (typeof find === 'string' || typeof find === 'number') {
    finder = (e: ImageryLayer) => Reflect.get(e, 'id') === find
  } else {
    finder = find
  }
  for (let i = 0; i < imageryLayers.length; i++) {
    const item = imageryLayers.get(i)
    if (finder(item)) {
      return item
    }
  }
  return undefined
}