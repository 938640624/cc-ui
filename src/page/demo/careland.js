import "./index.scss"
import BaseCrossController from "../base"
import { MODE_MAPS, EVENT_MAPS } from "../../constants"
import { TYPE_MAPS } from "@/api/modules/cross"
import hat from "hat"
import { requestAnimationFrame, cancelAnimationFrame } from "@/utils/bom"
import Circle from "./circle"
import LayerTranslateController from "@/utils/careland-gl-layer-translate-controller"

import {
  addEvent,
  removeEvent,
} from "@/utils/dom"

const isUseCanvas = true
const CIRCLE_DURATION = 1500
const CIRCLE_RADIUS = isUseCanvas ? 110 : 30
export default class CarelandCrossController extends BaseCrossController {
  initLayer () {
    this.initCircleLayer()
    this.initPointLayer()
  }

  initPointLayer () {
    this.layerId = "careland-cross-controller-layer"
    this.layer = new this.map.Careland.Layer("point", this.layerId)
    this.map.addLayer(this.layer)
  }

  initCircleLayer () {
    this.circleHandleZoom = () => {
      const zoom = this.map.getZoom()
      if (isUseCanvas) {
        this.circleRadius = CIRCLE_RADIUS / Math.pow(2, zoom - 14)
      } else {
        this.circleRadius = CIRCLE_RADIUS * zoom / 14
      }
    }
    this.circleHandleZoom()
    this.mapZoomendEventId = addEvent(this.map, "zoomend", this.circleHandleZoom)

    if (isUseCanvas) {
      this.circleLayerId = "careland-cross-controller-circle-layer"
      this.circleLayer = new this.map.Careland.Layer("polygon", this.circleLayerId)
      const point = new this.map.Careland.Point(411027338, 81411840)
      this.rect = new this.map.Careland.Circle()
      const styleRect = new this.map.Careland.PolyStyle({
        fillColor: "#0D1C35",
        opacity: 40,
        outlineColor: "transparent"
      })
      this.rect.setRect({
        center: point,
        radius: this.circleRadius
      })
      this.rect.setStyle(styleRect)
      this.circleLayer.add(this.rect)
      this.circleLayer.setVisible(false)
      this.map.addLayer(this.circleLayer)
    } else {
      this.circle = new Circle({
        map: this.map,
        center: new this.map.Careland.Point(411027338, 81411840),
        radius: 0,
        opacity: 0.4,
        fillColor: "#0D1C35"
      })
      this.circle.hide()
    }
  }

  refresh () {
    for (const feature of this.decreaseFeatures) {
      this.markerRemove(feature)
    }

    for (const feature of this.increaseFeatures) {
      this.markerCreate(feature)
    }
  }

  initSelectEvent () {
    this.containerClickEventId = addEvent(this.container, "click", (event) => {
      if (this.mode === MODE_MAPS.actived) {
        return
      }
      if (this.isDrag) {
        return
      }

      const srcElement = event.srcElement
      let id
      if (srcElement instanceof Image) {
        const parentNode = srcElement.parentNode
        id = parentNode.id.split("_")[1]
      }

      if (!id) {
        this.clearSelectFeature()
        this.emit(EVENT_MAPS["blank-select"])
        return
      }
      event.preventDefault()

      const marker = this.layer.getItemById(id)
      const point = marker.point
      const coordinates = [point.x, point.y]
      const featureId = marker.id
      const feature = this.featureMaps[featureId]
      feature.geometry.coordinates = coordinates
      feature.properties.coordSystem = "CARELAND"
      this.selectFeature(id)
    }, true)
  }

  initCreateEvent () {
    this.mapClickEventId = addEvent(this.map, "click", (event) => {
      // 让container的click先触发
      window.setTimeout(() => {
        if (this.mode !== MODE_MAPS.actived) {
          return
        }

        this.changeMode(MODE_MAPS.inactived)

        const { x, y } = event
        const coordinates = [x, y]

        const id = hat()
        const feature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates,
          },
          properties: {
            name: "",
            id,
            type: TYPE_MAPS.unsave,
            src: "/static/images/map-icon/unsave.png",
            isUnsave: true,
            visibility: true,
            coordSystem: "CARELAND",
          }
        }
        this.featureCollection.features.push(feature)
        this.featureMaps[id] = feature
        this.markerCreate(feature)
        this.selectFeature(id)
        this.emit(EVENT_MAPS.create, feature)
      }, 200)
    })
  }

  // 地图拖拽不会影响到图标高亮
  initMousemoveEvent () {
    this.layerTranslateController = new LayerTranslateController(this.map, this.container, this.layerId)

    this.layerTranslateController.on("move-start", (event) => {
      if (isUseCanvas) {
        this.circleLayer.setVisible(false)
      } else {
        this.circle.hide()
      }
      this.cancelCircleAnimationFrame()
    })

    this.layerTranslateController.on("move", (event) => {
      this.isDrag = true
    })

    this.layerTranslateController.on("move-end", (id, event) => {
      window.clearTimeout(this.dragTimeoutId)
      this.dragTimeoutId = window.setTimeout(() => {
        this.isDrag = false
      }, 100 / 3)

      const layer = this.map.getLayerById(this.layerId)
      if (layer) {
        const marker = layer.getItemById(id)
        const point = marker.point
        const coordinates = [point.x, point.y]
        const featureId = marker.id
        const feature = this.featureMaps[featureId]
        feature.geometry.coordinates = coordinates
        feature.properties.coordSystem = "CARELAND"
        this.emit(EVENT_MAPS.dragend, feature)
        this.selectFeature(featureId)
      }
    })
    // this.containerMousedownEventId = addEvent(this.container, "mousedown", (event) => {
    //   removeEvent(document, "mousemove", this.containerMousemoveEventId)
    //   this.containerMousemoveEventId = addEvent(document, "mousemove", () => {
    //     this.isDrag = true
    //   })

    //   this.containerMouseupEventId = addEvent(document, "mouseup", async () => {
    //     removeEvent(document, "mousemove", this.containerMousemoveEventId)
    //     removeEvent(document, "mouseup", this.containerMouseupEventId)
    //     window.clearTimeout(this.dragTimeoutId)
    //     this.dragTimeoutId = window.setTimeout(() => {
    //       this.isDrag = false
    //     }, 100 / 3)
    //   })
    // }, false)

    // if (this.isDraggable) {
    //   this.markerDragAddEvent()
    // }
  }

  markerCreate (feature) {
    const { properties, geometry } = feature
    const { id, coordSystem, src } = properties
    const { coordinates } = geometry

    const marker = new this.map.Careland.Marker("image")
    marker.setId(id)
    const style = new this.map.Careland.PointStyle({
      src,
      selectedSrc: src,
      width: 20,
      height: 20,
    })
    marker.setStyle(style)
    const point = this.map.convertCoordinatesToCarelandPoint(coordSystem, coordinates)
    marker.setPoint(point)
    marker.setCursor("move")
    this.layer.add(marker)

    // if (this.isDraggable) {
    //   marker.enableDragging()
    // }
  }

  markerRemove (feature) {
    const { id } = feature.properties
    this.layer.remove(id)
  }

  // markerDragAddEvent () {
  //   this.mapDrawchartstartEventId = addEvent(this.map, "drawchartstart", () => {
  //     if (isUseCanvas) {
  //       this.circleLayer.setVisible(false)
  //     } else {
  //       this.circle.hide()
  //     }
  //     this.cancelCircleAnimationFrame()
  //   })

  //   this.mapDrawchartendEventId = addEvent(this.map, "drawchartend", (obj) => {
  //     const layer = this.map.getLayerById(obj.layerid)
  //     if (layer) {
  //       const marker = layer.getItemById(obj.id)
  //       const point = marker.point
  //       const coordinates = [point.x, point.y]
  //       const featureId = marker.id
  //       const feature = this.featureMaps[featureId]
  //       feature.geometry.coordinates = coordinates
  //       feature.properties.coordSystem = "CARELAND"
  //       this.emit(EVENT_MAPS.dragend, feature)
  //       this.selectFeature(featureId)
  //     }
  //   })
  // }

  // markerDragRemoveEvent () {
  //   removeEvent(this.map, "drawchartend", this.mapDrawchartendEventId)
  //   removeEvent(this.map, "drawchartstart", this.mapDrawchartstartEventId)
  // }

  selectFeature (featureId) {
    this.selectedFeatureId = featureId
    const feature = this.featureMaps[featureId]
    if (!feature) {
      return
    }
    const { properties, geometry } = feature
    const { coordSystem } = properties
    const { coordinates } = geometry

    const point = this.map.convertCoordinatesToCarelandPoint(coordSystem, coordinates)

    this.startCircleAnimationFrame(point)
    this.emit(EVENT_MAPS.select, feature)
  }

  deleteFeature (id) {
    const index = this.findIndex(id)
    if (index === -1) {
      return
    }
    if (this.selectedFeatureId === id) {
      this.clearSelectFeature()
    }
    const feature = this.featureCollection.features.splice(index, 1)[0]
    this.markerRemove(feature)
  }

  clearSelectFeature () {
    this.selectedFeatureId = ""
    if (isUseCanvas) {
      this.circleLayer.setVisible(false)
    } else {
      this.circle.hide()
    }
    this.cancelCircleAnimationFrame()
  }

  startCircleAnimationFrame (point) {
    this.selectedStartTime = performance.now()
    this.circlePoint = point

    if (isUseCanvas) {
      this.circleLayer.setVisible(true)
    } else {
      this.circle.show()
    }

    this.loop()
  }

  loop () {
    this.requestAnimationFrameId = requestAnimationFrame(() => {
      this.animationFrame()
      this.loop()
    })
  }

  animationFrame () {
    const now = performance.now()
    const time = now - this.selectedStartTime
    // 周期反转函数
    const rest = time % CIRCLE_DURATION
    const k = 2 / CIRCLE_DURATION
    const y = rest <= CIRCLE_DURATION / 2 ? k * rest : -k * rest + 2
    const radius = this.circleRadius + this.circleRadius * y

    if (isUseCanvas) {
      this.rect.setRect({
        center: this.circlePoint,
        radius,
      })
    } else {
      this.circle.setRect({
        center: this.circlePoint,
        radius,
      })
    }
  }

  cancelCircleAnimationFrame () {
    cancelAnimationFrame(this.requestAnimationFrameId)
  }

  show () {
    this.map.getLayerById(this.layerId).setVisible(true)
  }

  hide () {
    this.map.getLayerById(this.layerId).setVisible(false)
  }

  enableDrag () {
    if (!this.isDraggable) {
      // for (const feature of this.featureCollection.features) {
      //   const { id } = feature.properties
      //   const marker = this.layer.getItemById(id)
      //   marker.enableDragging()
      // }
      this.layerTranslateController.enable()
    }
    this.isDraggable = true
    // this.markerDragAddEvent()
  }

  disableDrag () {
    if (this.isDraggable) {
      // for (const feature of this.featureCollection.features) {
      //   const { id } = feature.properties
      //   const marker = this.layer.getItemById(id)
      //   marker.disableDragging()
      // }
      this.layerTranslateController.disable()
    }
    this.isDraggable = false
    // this.markerDragRemoveEvent()
  }

  destroy () {
    this.eventer.off()
    this.cancelCircleAnimationFrame()
    removeEvent(this.map, "zoomend", this.mapZoomendEventId)
    removeEvent(this.container, "click", this.containerClickEventId)
    removeEvent(this.map, "click", this.mapClickEventId)
    this.layerTranslateController.destory()
    // removeEvent(this.container, "mousedown", this.containerMousedownEventId)

    if (isUseCanvas) {
      this.map.removeLayer(this.circleLayerId)
    } else {
      this.circle.destroy()
    }

    // if (this.isDraggable) {
    //   this.markerDragRemoveEvent()
    // }
  }
}
