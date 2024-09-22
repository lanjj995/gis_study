import { Control } from 'ol/control'
import EventType from 'ol/events/EventType'
import { CLASS_CONTROL, CLASS_UNSELECTABLE } from 'ol/css'

/**
 * @typedef {Object} Options
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {string} [className='my-home-control'] CSS class name.
 * @property {string} [homeClassName=className + '-home'] CSS class name for the home button.
 * @property {string|HTMLElement} [label='h'] Text label to use for the home
 * @property {string} [tipLabel='Home'] Text label to use for the button tip.
 * @property {HTMLElement|string} [target] Specify a target if you want the control to be
 * @property {View} [initialView] initial view state.
 * rendered outside of the map's viewport.
 */

/**
 * @classdesc
 * A control with 1 button, the button for home.
 *
 * @api
 */
class HomeControl extends Control {
  /**
   * @param {Options} options Home control options.
   * */
  constructor(options) {
    options = options || {}

    if (typeof options.initialView === void 0) {
      throw new Error('Missing initialView option')
    }

    super({
      element: document.createElement('div'),
      target: options.target
    })

    const className = options.className || 'my-home-control'
    const homeClassName = options.homeClassName || className + '-home'
    const duration = options.duration || 250
    const label = options.label || 'h'
    const tipLabel = options.tipLabel || 'Home'

    const homeElement = document.createElement('button')
    homeElement.className = homeClassName
    homeElement.title = tipLabel
    homeElement.appendChild(typeof label === 'string' ? document.createTextNode(label) : label)
    homeElement.addEventListener(EventType.CLICK, this.handleClick_.bind(this), false)

    const cssClasses = className + ' ' + CLASS_UNSELECTABLE + ' ' + CLASS_CONTROL
    const element = this.element
    element.className = cssClasses
    element.appendChild(homeElement)

    this.duration_ = duration
    this.initialViewState = options.initialView.getState()
  }

  handleClick_(e) {
    e.preventDefault()
    this.handleHome_()
  }

  handleHome_() {
    const map = this.getMap()
    const view = map.getView()
    if (this.duration_ > 0) {
      if (view.getAnimating()) {
        view.cancelAnimations()
      }
      view.animate({
        center: this.initialViewState.center,
        zoom: this.initialViewState.zoom,
        duration: this.duration_
      })
    } else {
      view.setCenter(this.initialViewState.center)
      view.setZoom(this.initialViewState.zoom)
    }
  }
}

export default HomeControl
