// 卷帘 imageLayers hook
import { Viewer, ScreenSpaceEventHandler, ImageryLayer, SplitDirection, ScreenSpaceEventType } from 'cesium'

interface UseSplitImageryLayerOptions {
  splitImageryLayer: ImageryLayer,
  viewer: Viewer,
  slider: HTMLElement
}

export const useSplitPosition = () => {
  let viewer: Viewer | null = null
  const setViewer = (v: Viewer | null) => {
    viewer = v
  }
  let slider: HTMLElement | null = null
  const setSlider = (s: HTMLElement | null) => {
    slider = s
  }
  let handler: ScreenSpaceEventHandler | null = null

  let moveActive = false
  const setMoveActiveTrue = () => {
    moveActive = true
  }

  const setMoveActiveFalse = () => {
    moveActive = false
  }

  const onMove = (movement: ScreenSpaceEventHandler.MotionEvent) => {
    if (!moveActive || !slider || !viewer) {
      return;
    }
  
    const relativeOffset = movement.endPosition.x;
    const splitPosition =
      (slider.offsetLeft + relativeOffset) / slider.parentElement!.offsetWidth;
    slider.style.left = `${100.0 * splitPosition}%`;
    viewer.scene.splitPosition = splitPosition;
  }

  const initHandler = () => {
    if (!slider) return

    handler = new ScreenSpaceEventHandler(slider as HTMLCanvasElement)
    handler.setInputAction(setMoveActiveTrue, ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction(setMoveActiveTrue, ScreenSpaceEventType.PINCH_START)
    handler.setInputAction(onMove, ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(setMoveActiveFalse, ScreenSpaceEventType.LEFT_UP)
    handler.setInputAction(setMoveActiveFalse, ScreenSpaceEventType.PINCH_END)
  }

  const init = (v: Viewer, sliderElement: HTMLElement) => {
    setViewer(v)
    setSlider(sliderElement)
    initHandler()
    console.log('sliderElement', sliderElement, sliderElement.offsetLeft / sliderElement.parentElement!.offsetWidth)
    v.scene.splitPosition = sliderElement.offsetLeft / sliderElement.parentElement!.offsetWidth;
  }

  const cleanup = () => {
    setViewer(null)
    setSlider(null)
    handler && handler.destroy()
  }

  return {
    init,
    cleanup
  }

}

export const useSplitImageryLayer = (splitDirection: SplitDirection = SplitDirection.LEFT) => {
  let viewer: Viewer | null = null
  const setViewer = (v: Viewer | null) => {
    viewer = v
  }
  let options: UseSplitImageryLayerOptions | null = null
  const setOptions = (o: UseSplitImageryLayerOptions | null) => {
    options = o
  }

  const { init: initSplitPosition, cleanup: cleanupSplitPosition } = useSplitPosition()

  // 添加左右两个图层
  const initLayers = () => {
    if (!viewer || !options) return
    options.splitImageryLayer.splitDirection = splitDirection
    viewer.imageryLayers.contains(options.splitImageryLayer) || viewer.imageryLayers.add(options.splitImageryLayer)
  }

  // 移除左右两个图层
  const removeImageryLayer = (imageryLayer: ImageryLayer) => {
    if (!viewer) return
    viewer.imageryLayers.contains(imageryLayer) && viewer.imageryLayers.remove(imageryLayer)
  }

  const init = (options: UseSplitImageryLayerOptions) => {
    setViewer(options.viewer)
    setOptions(options)
    initLayers()
    initSplitPosition(options.viewer, options.slider)
  }

  const cleanup = () => {
    setViewer(null)
    cleanupSplitPosition()
    if (!options) return
    removeImageryLayer(options.splitImageryLayer)
  }

  return {
    init,
    cleanup
  }
}