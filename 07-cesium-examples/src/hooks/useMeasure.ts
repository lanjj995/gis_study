import { CustomDataSource, Viewer, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian3, PolylineGraphics, CallbackProperty, Color, Entity, Cartographic, EllipsoidGeodesic, PolygonGeometry, PolygonHierarchy } from 'cesium'
import type { AriaAttributes } from 'vue'

export class MeasureTool {

  private viewer: Viewer

  private measureDataSource: CustomDataSource

  constructor(viewer: Viewer) {
    if (!viewer) {
      throw new TypeError('viewer is required')
    }

    const measureDataSource = new CustomDataSource('measureDataSource')

    viewer.dataSources.add(measureDataSource)

    this.measureDataSource = measureDataSource
    this.viewer = viewer
  }

  /**
   * 计算两点之间的距离
   * @param positions 
   * @returns 
   */
  public calcPositionsDistance(positions: Array<Cartesian3>) {
    let distance = 0
    for (let index = 0; index < positions.length - 1; index++) {
      const current = Cartographic.fromCartesian(positions[index]) 
      const next = Cartographic.fromCartesian(positions[index + 1])
      const geodesic = new Cesium.EllipsoidGeodesic(current, next)
      const d = Math.sqrt(Math.pow(geodesic.surfaceDistance, 2) + Math.pow(next.height - current.height, 2))
      distance += d
    }
    return distance
  }
  
  /**
   * 格式化距离
   * @param distance 
   * @returns 
   */
  public parseDistance(distance: number) {
    if (distance < 1000) {
      return `${distance.toFixed(2)}m`
    } else {
      return `${(distance / 1000).toFixed(2)}km`
    }
  }

  /**
   * 计算两点之间的距离
   * @param positions 
   * @returns 
   */
  public calcPositionsArea(positions: Array<Cartesian3>) {
    let area = 0
    if (positions.length < 3) {
      return area
    }

    const vertexes = positions.concat(positions[0])
    // 计算三角形面积
    const calcTriangleArea = (vertexes: [Cartesian3, Cartesian3, Cartesian3]) => {
      const [A, B, C] = vertexes.map(cartesian => Cartographic.fromCartesian(cartesian));

      // 使用海伦公式计算三角形面积
      const a = new EllipsoidGeodesic(A, B).surfaceDistance;
      const b = new EllipsoidGeodesic(B, C).surfaceDistance;
      const c = new EllipsoidGeodesic(A, C).surfaceDistance;

      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return area
    }

    // 计算多边形面积
    while (vertexes.length >= 3) {
      area += calcTriangleArea([vertexes[0], vertexes[1], vertexes[2]])
      vertexes.splice(0, 2)
    }
    return area
  }

  /**
   * 格式化距离
   * @param distance 
   * @returns 
   */
  public parseArea(area: number) {
    return `${(area / 1000000).toFixed(2)}平方公里`
  }

  public clear() {
    this.measureDataSource.entities.removeAll()
  }

  /**
   * 测距 
   * 
   */
  public measureLine() {
    const positions: Array<Cartesian3> = []
    const addDistanceLabel = (positions: Array<Cartesian3>) => {
      const distanceLabel = new Entity({
        position: positions[positions.length - 1],
        label: {
          text: `${this.parseDistance(this.calcPositionsDistance(positions))}`,
          font: '20px sans-serif',
          showBackground: true,
          pixelOffset: new Cartesian3(20, -20)
        }
      })
      this.measureDataSource.entities.add(distanceLabel)
    }
    const onLeftClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      const position = this.viewer.scene.pickPosition(event.position)
      positions.push(position.clone())
      if (positions.length >= 2) {
        // 添加当前点的距离
        addDistanceLabel(positions)
      }
    }
    const onMouseMove = (event: ScreenSpaceEventHandler.MotionEvent) => {
      const position = this.viewer.scene.pickPosition(event.endPosition)
      if (positions.length >= 1) {
        if (positions.length >= 2) {
          positions.pop()
        }
        positions.push(position.clone())
      }
    }
    const onRightClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
      handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
      handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK)
      handler.destroy()
      const position = this.viewer.scene.pickPosition(event.position)
      positions.push(position.clone())
      if (positions.length >= 2) {
        // 添加当前点的距离
        addDistanceLabel(positions)
      }
    }
    const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas)
    // 左键开始测量
    handler.setInputAction(onLeftClick, ScreenSpaceEventType.LEFT_CLICK)
    // 根据鼠标移动修改当前点位置
    handler.setInputAction(onMouseMove, ScreenSpaceEventType.MOUSE_MOVE)
    // 结束测量
    handler.setInputAction(onRightClick, ScreenSpaceEventType.RIGHT_CLICK)

    // 创建line
    const measureLine = new PolylineGraphics({
      positions: new CallbackProperty(() => {
        return positions
      }, false),
      material: Color.RED,
      width: 5,
    })
    const measureLineEntity = new Entity({
      polyline: measureLine
    })
    this.measureDataSource.entities.add(measureLineEntity)
  }

  /**
   * 测面
   * 
   */
  public measureArea() {
    const positions: Array<Cartesian3> = []
    let polygonLineEntity: Entity | undefined
    let polygonEntity: Entity | undefined
    let isEnd = false
    const addAreaLabel = (positions: Array<Cartesian3>) => {
      const distanceLabel = new Entity({
        position: positions[positions.length - 1],
        label: {
          text: `${this.parseArea(this.calcPositionsArea(positions))}`,
          font: '20px sans-serif',
          showBackground: true,
          pixelOffset: new Cartesian3(20, -20)
        }
      })
      this.measureDataSource.entities.add(distanceLabel)
    }
    const addPolygonLine = () => {
      if (polygonLineEntity) return
      // 创建area
      polygonLineEntity = new Entity({
        polyline: {
          positions: new CallbackProperty(() => {
            return isEnd ? positions.concat(positions[0]) : positions
          }, false),
          material: Color.RED,
          width: 5,
        }
      })
      this.measureDataSource.entities.add(polygonLineEntity)
    }
    // 添加面
    const addPolygon = () => {
      if (polygonEntity) return

      // 创建area
      polygonEntity = new Entity({
        polygon: {
          material: Color.WHITE.withAlpha(0.5),
          hierarchy: new CallbackProperty(() => {
            return new PolygonHierarchy(positions.concat(positions[0]))
          }, false)
        }
      })
      this.measureDataSource.entities.add(polygonEntity)
    }
    const onLeftClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      const position = this.viewer.scene.pickPosition(event.position)
      positions.push(position.clone())
      
      if (positions.length > 2) {
        addPolygon()
      }
    }
    const onMouseMove = (event: ScreenSpaceEventHandler.MotionEvent) => {
      const position = this.viewer.scene.pickPosition(event.endPosition)
      if (positions.length === 1) {
        positions.push(position.clone())
      }
      if (positions.length >= 2) {
        positions.splice(positions.length - 1, 1, position.clone())
      }
    }
    const onRightClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
      handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
      handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK)
      handler.destroy()
      isEnd = true
      const position = this.viewer.scene.pickPosition(event.position)
      positions.push(position.clone())
      if (positions.length >= 3) {
        addAreaLabel(positions)
      }
    }
    const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas)
    // 左键开始测量
    handler.setInputAction(onLeftClick, ScreenSpaceEventType.LEFT_CLICK)
    // 根据鼠标移动修改当前点位置
    handler.setInputAction(onMouseMove, ScreenSpaceEventType.MOUSE_MOVE)
    // 结束测量
    handler.setInputAction(onRightClick, ScreenSpaceEventType.RIGHT_CLICK)

    addPolygonLine()
  }
}
