import './style.css';
import 'ol/ol.css'
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as Control from 'ol/control'


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

const map = new Map({
  target: 'map',
  controls: [
    new CustomControl(),
    new Control.ScaleLine(),
    new Control.OverviewMap({
      collapsed: false,
      rotateWithView: false,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ]
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
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
    rotation: 1
  })
});
