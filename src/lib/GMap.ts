/**
 * 高德地图封装组件
 */
import * as Types from './Types'
import Painter from './Painter'

let win: any = window
let AMap: any = win.AMap

export default class GMap {
  defaultOptions: any = {
    resizeEnable: true,
    scale: true,
    scalePosition: 'LB',
    toolBar: true,
    toolBarPosition: 'RB',
    toolBarDirection: false,
    typeBar: true
  }
  amap: any
  
  // 已经画好的覆盖物
  overlays: any = {
    [Types.TYPE_MARKER]: {},
    [Types.TYPE_POLYLINE]: {},
    [Types.TYPE_POLYGON]: {},
    [Types.TYPE_CIRCLE]: {},
    [Types.TYPE_RECTANGLE]: {},
    [Types.TYPE_TEXT]: {},
    [Types.TYPE_IMAGELAYER]: {}
  }
    
  // 覆盖物分组，便于控制
  overlayGroups: any = {}

  constructor (el, options) {
    let ops = this.defaultOptions
    if (options) {
      for (let k in options) ops[k] = options[k]
    }
    
    /**
     * 地图选项支持：
     * zoom
     * center
     * scale: boolean
     * scaleOffset: [x:number,y:yumber]
     * scalePosition: string,LT/RT/LB/RB
     * toolBar: boolean
     * toolBarOffset: [x:number,y:yumber]
     * toolBarPosition: string,LT/RT/LB/RB
     * toolBarDirection: boolean
     * typeBar: boolean
     * mapType: number, 0-默认底图，1-卫星图
     */
    this.amap = new AMap.Map(el, ops)
    
    if (AMap.Scale && ops.scale) {
      let scaleOps: any = {
        position: ops.scalePosition
      }
      if (ops.scaleOffset) scaleOps.offset = new AMap.Pixel(ops.scaleOffset[0], ops.scaleOffset[1])
      this.amap.addControl(new AMap.Scale(scaleOps))
    }
    
    if (AMap.ToolBar && ops.toolBar) {
      let toolBarOps: any = { 
        direction: ops.toolBarDirection,
        position: ops.toolBarPosition
      }
      if (ops.toolBarOffset) toolBarOps.offset = new AMap.Pixel(ops.toolBarOffset[0], ops.toolBarOffset[1])
      this.amap.addControl(new AMap.ToolBar(toolBarOps))
    }

    if (AMap.MapType && (ops.typeBar || ops.mapType)) {
      let mapTypeOps: any = { }
      if (options.mapType) mapTypeOps.defaultType = options.mapType
      this.amap.addControl(new AMap.MapType(mapTypeOps))
    }
    
    /* 保留这段加载谷歌地图的例子代码
    let googleLayer = new AMap.TileLayer({
      zIndex: 2,
      getTileUrl: function (x, y, z) {
        return 'http://mt1.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=' + x + '&y=' + y + '&z=' + z + '&s=Galil'
      }
    })
    googleLayer.setMap(this.amap)
    */
  }
  
  addOverlay = (type: string, overlay: any, option: any) => {
    overlay.gmap_id = option.id ? option.id : 'gmap_' + overlay.getId()
    overlay.gmap_group = option.group
    
    let ol = this.overlays[type][overlay.gmap_id]
    if (ol && ol !== overlay) this.removeOverlayById(type, ol.gmap_id)
      
    if (overlay.gmap_group) this.addToOverlayGroup(overlay, overlay.gmap_group)
    this.overlays[type][overlay.gmap_id] = overlay
    overlay.setMap(this.amap)
  }

  removeOverlayById (type: string, gmapId: string) {
    let overlay = this.getOverlays(type)[gmapId]
    if (!overlay) {
      console.warn(type + '[gmap_id: ' + gmapId + '] is not found.')
      return
    }
    
    overlay.setMap(null)
    overlay.gmap_group && this.delFromOverlayGroup(overlay)
    delete this.getOverlays(type)[overlay.gmap_id]
  }
  
  getOverlays = (type: string) => this.overlays[type]
  
  clearOverlays (type: string) {
    for (let id in this.overlays[type]) {
      this.removeOverlayById(type, id)
    }
  }
  
  addToOverlayGroup (ol: any, groupName: string) {
    let group = this.overlayGroups[groupName]
    if (!group) {
      group = new AMap.OverlayGroup()
      this.overlayGroups[groupName] = group
    }
    group.addOverlay(ol)
  }
  
  delFromOverlayGroup (overlay: any) {
    let group = this.overlayGroups[overlay.gmap_group]
    group && group.removeOverlay(overlay)
  }
  
  dispalyOverlay = (type: string, gmapId: string, visible: boolean) => {
    let ol = this.getOverlays(type)[gmapId]
    if (!ol) return
    if (visible) ol.show() 
    else ol.hide()
  }
  
  getAMap = () => this.amap
  getMarker = (gmapId: string) => this.getOverlays(Types.TYPE_MARKER)[gmapId]
  getPolyline = (gmapId: string) => this.getOverlays(Types.TYPE_POLYLINE)[gmapId]
  getPolygon = (gmapId: string) => this.getOverlays(Types.TYPE_POLYGON)[gmapId]
  getCircle = (gmapId: string) => this.getOverlays(Types.TYPE_CIRCLE)[gmapId]
  getRectangle = (gmapId: string) => this.getOverlays(Types.TYPE_RECTANGLE)[gmapId]
  getText = (gmapId: string) => this.getText(Types.TYPE_TEXT)[gmapId]
  getImageLayer = (gmapId: string) => this.getOverlays(Types.TYPE_IMAGELAYER)[gmapId]
  
  removeMarker = (gmapId: string) => this.removeOverlayById(Types.TYPE_MARKER, gmapId)
  removePolyline = (gmapId: string) => this.removeOverlayById(Types.TYPE_POLYLINE, gmapId)
  removePolygon = (gmapId: string) => this.removeOverlayById(Types.TYPE_POLYGON, gmapId)
  removeCircle = (gmapId: string) => this.removeOverlayById(Types.TYPE_CIRCLE, gmapId)
  removeRectangle = (gmapId: string) => this.removeOverlayById(Types.TYPE_RECTANGLE, gmapId)
  removeText = (gmapId: string) => this.removeOverlayById(Types.TYPE_TEXT, gmapId)
  removeImageLayer = (gmapId: string) => this.removeOverlayById(Types.TYPE_IMAGELAYER, gmapId)
  
  dispalyMarker = (gmapId: string, visible: boolean) => this.dispalyOverlay(Types.TYPE_MARKER, gmapId, visible)
  dispalyPolyline = (gmapId: string, visible: boolean) => this.dispalyOverlay(Types.TYPE_POLYLINE, gmapId, visible)
  dispalyPolygon = (gmapId: string, visible: boolean) => this.dispalyOverlay(Types.TYPE_POLYGON, gmapId, visible)
  dispalyCircle = (gmapId: string, visible: boolean) => this.dispalyOverlay(Types.TYPE_CIRCLE, gmapId, visible)
  dispalyRectangle = (gmapId: string, visible: boolean) => this.dispalyOverlay(Types.TYPE_RECTANGLE, gmapId, visible)
  dispalyText = (gmapId: string, visible: boolean) => this.dispalyOverlay(Types.TYPE_TEXT, gmapId, visible)
  dispalyImageLayer = (gmapId: string, visible: boolean) => this.dispalyOverlay(Types.TYPE_IMAGELAYER, gmapId, visible)
  
  destroy = () => this.amap && this.amap.destroy()
  setZoom = (zoom: number) => this.amap.setZoom(zoom)
  getZoom = () => this.amap.getZoom()
  setCenter = (center: number[]) => this.amap.setCenter(center)
  getCenter = () => this.amap.getCenter()
  on = (eventName: string, callback) => this.amap.on(eventName, callback)
  showOverlayGroup = groupName => this.overlayGroups[groupName] && this.overlayGroups[groupName].show()
  hideOverlayGroup = groupName => this.overlayGroups[groupName] && this.overlayGroups[groupName].hide()
}
