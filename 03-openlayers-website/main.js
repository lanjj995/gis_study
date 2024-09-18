import './style.css';
import 'ol/ol.css'
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import * as Control from 'ol/control'
import { transform } from 'ol/proj';
const TIANDITU_KEY = 'b58e95b35830cd576df218d62abedbdd'

class CustomControl extends Control.Control {
  constructor(options = {}) {
    const div = document.createElement('div')
    const addRotate = document.createElement('button')
    addRotate.innerHTML = '+'
    const reduceRotate = document.createElement('button') 
    reduceRotate.innerHTML = '-'
    div.className = 'ol-custom-control ol-control'
    div.appendChild(addRotate)
    div.appendChild(reduceRotate)

    super({
      element: div
    });

    addRotate.addEventListener('click', this.onAddRotate.bind(this), false)
    reduceRotate.addEventListener('click', this.onReduceRotate.bind(this), false)
  }

  onAddRotate() {
    this.getMap().getView().setRotation(this.getMap().getView().getRotation() + .1)
  }

  onReduceRotate() {
    this.getMap().getView().setRotation(this.getMap().getView().getRotation() - .1)
  }
  
}

const layers_4326 = [
  new TileLayer({
    name: '天地图影像底图',
    source: new XYZ({
      projection: 'EPSG:4326',
      url: 'http://t{0-7}.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=' + TIANDITU_KEY
    })
  }),
  new TileLayer({
    name: '天地图矢量注记',
    source: new XYZ({
      projection: 'EPSG:4326',
      url: 'http://t{0-7}.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=' + TIANDITU_KEY
    })
  }),
]

const layers_3857 = [
  new TileLayer({
    name: '天地图影像底图',
    source: new XYZ({
      projection: 'EPSG:3857',
      url: 'http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + TIANDITU_KEY
    })
  }),
  new TileLayer({
    name: '天地图矢量注记',
    source: new XYZ({
      projection: 'EPSG:3857',
      url: 'http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + TIANDITU_KEY
    })
  }),
]

const map = new Map({
  target: 'map',
  controls: [
    new CustomControl(),
    new Control.ScaleLine(),
    new Control.OverviewMap({
      collapsed: false,
      rotateWithView: false,
      // layers
    }), // 鹰眼
    // new Control.MousePosition(),
    new Control.Attribution(),
    new Control.FullScreen(),
    new Control.Zoom(),
    new Control.ZoomSlider(),
    new Control.Rotate({
      autoHide: false
    })
  ],
  layers: layers_3857,
  view: new View({
    // projection: 'EPSG:4326',
    // center: [116.397428, 39.90923],
    projection: 'EPSG:3857',
    center: transform([116.397428, 39.90923], 'EPSG:4326', 'EPSG:3857'),
    zoom: 8,
    minZoom: 8,
    maxZoom: 18
  })
});

loadLayers(map)

function loadLayers(map) {
  const layers = map.getLayers().getArray()
  const layersCheckboxWrap = document.createElement('ul')
  layersCheckboxWrap.className = 'layers-checkbox-wrap'
  layers.forEach(layer => {
    const layerCheckbox = document.createElement('input')
    layerCheckbox.type = 'checkbox'
    layerCheckbox.id = layer.get('name')
    layerCheckbox.checked = layer.getVisible()
    layerCheckbox.addEventListener('change', function(e) {
      layer.setVisible(e.target.checked)
    })
    const layerCheckboxLabel = document.createElement('label')
    layerCheckboxLabel.htmlFor = layer.get('name')
    layerCheckboxLabel.innerHTML = layer.get('name')
    const li = document.createElement('li')
    li.appendChild(layerCheckbox)
    li.appendChild(layerCheckboxLabel)
    layersCheckboxWrap.appendChild(li)
  })
  document.querySelector('.map').appendChild(layersCheckboxWrap)
}