/**
 * 覆盖物编辑器
 * 如果是新建，创建完成后，就从地图上消失。应用如果想继续显示，就重新画。
 * 如果是编辑已经有的，修改完成后，仍然显示在地图上。
 * 编辑过程允许取消编辑，如果是新建，取消后，没有完成的内容从地图上消失，退出编辑状态；
 * 如果是修改，取消后，恢复到编辑前的状态，退出编辑状态。
 */
import GMap from './GMap'
import * as Types from './Types'

let win: any = window
let AMap: any = win.AMap
let AMapUI: any = win.AMapUI

export default class Editer {
  amap: any
  posPicker: any
  polyEditor: any
  circleEditor: any
  rectangleEditor: any

  // 被编辑的Marker及其位置
  marker: any
  markerPosition: any
  // 被编辑的Polyline或Polygon
  poly: any
  polyPath: any
  // 被编辑的Circle
  circle: any
  circleCenter: any
  circleRadius: number
  // 被编辑的Rectangle
  rectangle: any
  rectangleBounds: any

  constructor (private gmap: GMap, private handler: any) {
    this.amap = gmap.getAMap()
  }

  // 创建新Marker
  createMarker (marker: Types.EditMarkerOptions, position?: any) {
    let _this = this
    this.cancelEdit()

    let options: any = { map: this.amap }
    options.mode = marker.mode ? marker.mode : 'dragMap'
    if (marker.icon) {
      options.iconStyle = {
        url: marker.icon,
        ancher: marker.ancher,
        size: marker.size
      }
    }

    AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
      let positionPicker = new PositionPicker(options)
      positionPicker.on('success', function (e) {
        _this.markerPosition = e.position
        _this.handler(e)
      })
      positionPicker.start(position)
      _this.posPicker = positionPicker
    })
  }

  // 编辑原有Marker
  editMarker (markerId: string, marker: Types.EditMarkerOptions) {
    this.cancelEdit()

    this.marker = this.gmap.getMarker(markerId)
    if (!this.marker) {
      console.error('Can not find Marker[id: ' + markerId + ']')
      return
    }

    this.marker.hide()
    this.createMarker(marker, this.marker.getPosition())
  }

  createPolyline (options: any) {
    this.cancelEdit()

    let data = this.getInitData()
    options.path = [data.sw, data.ne]
    options.map = this.amap
    this.poly = new AMap.Polyline(options)
    this.polyPath = null
    this.editPoly(this.poly)
  }

  editPolyline (lineId: string) {
    this.cancelEdit()

    this.poly = this.gmap.getPolyline(lineId)
    if (!this.poly) {
      console.error('Can not find Polyline[id: ' + lineId + ']')
      return
    }
    this.polyPath = []
    for (let pos of this.poly.getPath()) {
      this.polyPath.push([pos.getLng(), pos.getLat()])
    }
    this.editPoly(this.poly)
  }

  createPolygon (options: any) {
    this.cancelEdit()

    let data = this.getInitData()
    let swLng = data.sw.getLng()
    let swLat = data.sw.getLat()
    let neLng = data.ne.getLng()
    let neLat = data.ne.getLat()
    options.path = [[swLng, swLat], [swLng, neLat], [neLng, neLat], [neLng, swLat]]
    options.map = this.amap
    this.poly = new AMap.Polygon(options)
    this.polyPath = null
    this.editPoly(this.poly)
  }

  editPolygon (gonId: string) {
    this.cancelEdit()

    this.poly = this.gmap.getPolygon(gonId)
    if (!this.poly) {
      console.error('Can not find Polygon[id: ' + gonId + ']')
      return
    }
    this.polyPath = []
    for (let pos of this.poly.getPath()) {
      this.polyPath.push([pos.getLng(), pos.getLat()])
    }
    this.editPoly(this.poly)
  }

  editPoly (poly: any) {
    this.polyEditor = new AMap.PolyEditor(this.amap, poly)
    this.polyEditor.on('addnode', this.handler)
    this.polyEditor.on('adjust', this.handler)
    this.polyEditor.on('removenode', this.handler)
    this.polyEditor.on('end', this.handler)
    this.polyEditor.open()
    this.polyEditor.emit('adjust', { target: poly })
  }

  createCircle (options: any) {
    this.cancelEdit()

    let data = this.getInitData()
    options.map = this.amap
    options.center = this.amap.getCenter()
    options.radius = data.radius
    this.circle = new AMap.Circle(options)
    this.circleCenter = null
    this.circleRadius = 0
    this.editCircle_(this.circle)
  }

  editCircle (circleId: string) {
    this.cancelEdit()

    this.circle = this.gmap.getCircle(circleId)
    if (!this.circle) {
      console.error('Can not find Circle[id: ' + circleId + ']')
      return
    }
    let center = this.circle.getCenter()
    this.circleCenter = new AMap.LngLat(center.getLng(), center.getLat())
    this.circleRadius = this.circle.getRadius()
    this.editCircle_(this.circle)
  }

  editCircle_ (circle: any) {
    this.circleEditor = new AMap.CircleEditor(this.amap, circle)
    this.circleEditor.on('move', this.handler)
    this.circleEditor.on('adjust', this.handler)
    this.circleEditor.on('end', this.handler)
    this.circleEditor.open()
    this.circleEditor.emit('adjust', { target: circle })
  }

  createRectangle (options: any) {
    this.cancelEdit()

    let data = this.getInitData()
    options.map = this.amap
    options.bounds = new AMap.Bounds(data.sw, data.ne)
    this.rectangle = new AMap.Rectangle(options)
    this.rectangleBounds = null
    this.editRectangle_(this.rectangle)
  }

  editRectangle (rectangleId: string) {
    this.cancelEdit()

    this.rectangle = this.gmap.getRectangle(rectangleId)
    if (!this.rectangle) {
      console.error('Can not find Rectangle[id: ' + rectangleId + ']')
      return
    }
    let b = this.rectangle.getBounds()
    let sw = b.getSouthWest()
    let ne = b.getNorthEast()
    let sw1 = new AMap.LngLat(sw.getLng(), sw.getLat())
    let ne1 = new AMap.LngLat(ne.getLng(), ne.getLat())
    this.rectangleBounds = new AMap.Bounds(sw1, ne1)
    this.editRectangle_(this.rectangle)
  }

  editRectangle_ (rectangle: any) {
    this.rectangleEditor = new AMap.RectangleEditor(this.amap, rectangle)
    this.rectangleEditor.on('adjust', this.handler)
    this.rectangleEditor.on('end', this.handler)
    this.rectangleEditor.open()
    this.rectangleEditor.emit('adjust', { target: rectangle })
  }

  getInitData () {
    let amap: any = this.gmap.getAMap()
    let center = amap.getCenter()
    let zoom = amap.getZoom()
    let cenPixel = amap.lnglatToPixel(center, zoom)
    let x = cenPixel.getX()
    let y = cenPixel.getY()
    let swPixel = new AMap.Pixel(x - 100, y + 60)
    let nePixel = new AMap.Pixel(x + 100, y - 60)
    let sw = amap.pixelToLngLat(swPixel, zoom)
    let ne = amap.pixelToLngLat(nePixel, zoom)
    return { sw: sw, ne: ne, radius: Math.round(center.distance(ne)) }
  }

  cancelEdit () {
    this.stopEditMarker(false)
    this.stopEditPoly(false)
    this.stopEditCircle(false)
    this.stopEditRectangle(false)
  }

  finishEdit () {
    this.stopEditMarker(true)
    this.stopEditPoly(true)
    this.stopEditCircle(true)
    this.stopEditRectangle(true)
  }

  stopEditMarker (toNew: boolean) {
    if (this.posPicker) {
      this.posPicker.stop()
      delete this.posPicker

      // 如果编辑Marker，将其移到新位置
      if (this.marker) {
        this.marker.show()
        toNew && this.marker.setPosition(this.markerPosition)
        this.marker = null
      }
    }
  }

  stopEditPoly (finished: boolean) {
    if (this.polyEditor) {
      this.polyEditor.close()
      delete this.polyEditor

      // 如果是对原来图形的编辑
      if (this.polyPath) {
        !finished && this.poly.setPath(this.polyPath) // 若取消编辑则将其恢复为原状
      } else {
        this.poly.setMap(null)
      }
      this.poly = null
    }
  }

  stopEditCircle (finished: boolean) {
    if (this.circleEditor) {
      this.circleEditor.close()
      delete this.circleEditor

      // 如果是对原来图形的编辑
      if (this.circleCenter) {
        if (!finished) {
          this.circle.setCenter(this.circleCenter) // 若取消编辑则将其恢复为原状
          this.circle.setRadius(this.circleRadius)
        }
      } else {
        this.circle.setMap(null)
      }
      this.circle = null
    }
  }

  stopEditRectangle (finished: boolean) {
    if (this.rectangleEditor) {
      this.rectangleEditor.close()
      delete this.rectangleEditor

      // 如果是对原来图形的编辑
      if (this.rectangleBounds) {
        if (!finished) {
          try { // 不知道这儿为什么会有异常，但实际没什么影响 
            this.rectangle.setBounds(this.rectangleBounds) // 若取消编辑则将其恢复为原状
          } catch (e) {
            console.warn(e)
          }
        }
      } else {
        this.rectangle.setMap(null)
      }
      this.rectangle = null
    }
  }
}
