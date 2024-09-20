import * as olStyle from 'ol/style'
import { Vector as OlSourceVector } from 'ol/source'
import { Vector as OlLayerVector } from 'ol/layer'
import OlInteractionDraw from 'ol/interaction/Draw'
import OlObservable from 'ol/Observable'
import OlOverlay from 'ol/Overlay'
import OlGeomPloygon from 'ol/geom/Polygon'
import OlGeomLineString from 'ol/geom/LineString'
import * as OlSphere from 'ol/sphere'

class MeasureTools {
  constructor(map) {
    this.map = map
    this.helpTooltipElement = undefined
    this.helpTooltip = undefined
    this.measureTooltipElement = undefined
    this.measureTooltip = undefined
    this.sketch = undefined
    this.continuePolygonMsg = '单机鼠标左键以继续绘制面'
    this.continueLineMsg = '单机鼠标左键以继续绘制线'

    this.draw = undefined

    this.style = new olStyle.Style({
      fill: new olStyle.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new olStyle.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new olStyle.Circle({
        radius: 5,
        stroke: new olStyle.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new olStyle.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })

    this.source = new OlSourceVector()
    this.vector = new OlLayerVector({
      source: this.source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33'
      }
    })
    this.map.addLayer(this.vector)
  }

  // 测距
  getLength() {
    let m = this
    m.clearMeasure()

    m.createHelpTooltip()
    m.createMeasureTooltip()
    this.map.on('pointermove', m.pointerMoveHandler)

    m.draw = new OlInteractionDraw({
      source: m.source,
      type: 'LineString',
      style: function (feature) {
        const geometryType = feature.getGeometry().getType()
        if (geometryType === 'LineString' || geometryType === 'Point') {
          return m.style
        }
      }
    })
    m.map.addInteraction(m.draw)
    let listener
    m.draw.on('drawstart', function (evt) {
      m.sketch = evt.feature
      let tooltipCoord = evt.coordinate
      listener = m.sketch.getGeometry().on('change', function (evt) {
        const geom = evt.target
        let output = m.formatLength(geom)
        tooltipCoord = geom.getLastCoordinate()
        m.measureTooltipElement.innerHTML = output
        m.measureTooltip.setPosition(tooltipCoord)
      })
    })

    m.draw.on('drawend', function () {
      m.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
      m.measureTooltip.setOffset([0, -7])
      m.sketch = null
      m.measureTooltipElement = null
      m.createMeasureTooltip()
      OlObservable.unByKey(listener)
    })
  }

  getArea() {
    let m = this
    m.clearMeasure()

    m.createHelpTooltip()
    m.createMeasureTooltip()
    this.map.on('pointermove', m.pointerMoveHandler)

    m.draw = new OlInteractionDraw({
      source: m.source,
      type: 'Polygon',
      style: function (feature) {
        const geometryType = feature.getGeometry().getType()
        if (geometryType === 'Polygon' || geometryType === 'Point') {
          return m.style
        }
      }
    })
    m.map.addInteraction(m.draw)
    let listener
    m.draw.on('drawstart', function (evt) {
      m.sketch = evt.feature
      let tooltipCoord = evt.coordinate
      listener = m.sketch.getGeometry().on('change', function (evt) {
        const geom = evt.target
        let output = m.formatArea(geom)
        tooltipCoord = geom.getInteriorPoint().getCoordinates()
        m.measureTooltipElement.innerHTML = output
        m.measureTooltip.setPosition(tooltipCoord)
      })
    })

    m.draw.on('drawend', function () {
      m.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
      m.measureTooltip.setOffset([0, -7])
      m.sketch = null
      m.measureTooltipElement = null
      m.createMeasureTooltip()
      OlObservable.unByKey(listener)
    })
  }

  // 创建帮助工具提示
  createHelpTooltip = () => {
    let m = this
    if (m.helpTooltipElement) {
      m.helpTooltipElement.remove()
    }
    m.helpTooltipElement = document.createElement('div')
    m.helpTooltipElement.className = 'ol-tooltip hidden'
    m.helpTooltip = new OlOverlay({
      element: m.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    })
    m.map.addOverlay(m.helpTooltip)
  }

  // 创建测量工具提示
  createMeasureTooltip = () => {
    let m = this
    if (m.measureTooltipElement) {
      m.measureTooltipElement.remove()
    }
    m.measureTooltipElement = document.createElement('div')
    m.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    m.measureTooltip = new OlOverlay({
      element: m.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false
    })
    m.map.addOverlay(m.measureTooltip)
  }

  // 鼠标移动事件
  pointerMoveHandler = (evt) => {
    let m = this
    if (evt.dragging) {
      return
    }
    let helpMsg = '点击开始绘制'
    if (m.sketch) {
      const geom = m.sketch.getGeometry()
      if (geom instanceof OlGeomPloygon) {
        helpMsg = m.continuePolygonMsg
      } else if (geom instanceof OlGeomLineString) {
        helpMsg = m.continueLineMsg
      }
    }
    m.helpTooltipElement.innerHTML = helpMsg
    m.helpTooltip.setPosition(evt.coordinate)
    m.helpTooltipElement.classList.remove('hidden')
  }

  // 获取距离
  formatLength = (line) => {
    const length = OlSphere.getLength(line)
    let output
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm'
    }
    return output
  }

  // 获取面积
  formatArea = (polygon) => {
    const area = OlSphere.getArea(polygon)
    let output
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
    }
    return output
  }

  // 清除的方法
  clearMeasure = () => {
    let m = this
    m.map.removeInteraction(m.draw)
    m.draw = undefined
    m.map.un('pointermove', m.pointerMoveHandler)
    if (m.measureTooltipElement) {
      m.measureTooltipElement.remove()
      m.measureTooltipElement = null
    }
    if (m.helpTooltipElement) {
      m.helpTooltipElement.remove()
      m.helpTooltipElement = null
    }
  }
}

export default MeasureTools
