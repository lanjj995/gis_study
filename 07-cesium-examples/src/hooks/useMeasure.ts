import { CustomDataSource, Viewer, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium'

export class MeasureTool {

  private viewer: Viewer

  constructor(viewer: Viewer) {
    if (!viewer) {
      throw new TypeError('viewer is required')
    }

    const measureDataSource = new CustomDataSource('measureDataSource')

    viewer.dataSources.add(measureDataSource)

    this.viewer = viewer
  }

  /**
   * 测距 
   * 
   */
  public measureLine() {
    const onLeftClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      console.log(`onLeftClick`, event)
    }
    const onMouseMove = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      console.log(`onMouseMove`, event)
    }
    const onRightClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      console.log(`onRightClick`, event)
    }

    const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas)
    // 左键开始测量
    handler.setInputAction(onLeftClick, ScreenSpaceEventType.LEFT_CLICK)
    // 计算距离
    handler.setInputAction(onMouseMove, ScreenSpaceEventType.MOUSE_MOVE)
    // 结束测量
    handler.setInputAction(onRightClick, ScreenSpaceEventType.RIGHT_CLICK)
  }
}
