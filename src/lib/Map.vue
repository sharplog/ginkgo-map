<template>
  <div class="ginkgo-gmap">
  </div>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
import * as Types from './Types'
import GMap from './GMap'
import Painter from './Painter'
import Tracker from './Tracker'
import Editer from './Editer'
import CoorConverter from './CoorConverter'

let win: any = window
let AMap: any = win.AMap

// 坐标转换器
let converter: CoorConverter = new CoorConverter(Types.COOR_GCJ02)

@Component
export default class GinkgoMap extends Vue {
  name: string = 'ginkgo-gmap'
  gmap: GMap
  painter: Painter
  _tracker: any
  _editer: any
  
  @Prop() gmapObj: GMap
  @Prop() options: any
  @Prop() zoom: number
  @Prop() center: number[]
  @Prop() markers: any[]
  @Prop() polylines: any[]
  @Prop() polygons: any[]
  @Prop() circles: any[]
  @Prop() rectangles: any[]
  @Prop() texts: any[]
  @Prop() imageLayers: any[]
  @Prop() trackData: any
  @Prop() trackOptions: any
  @Prop() tracker: Tracker
  @Prop() editData: any
  @Prop() editer: Editer
  
  mounted () {
    let options = this.options ? this.options : {}
    if (this.zoom) options.zoom = this.zoom
    if (this.center) options.center = this.center
    
    this.gmap = new GMap(this.$el, options)
    this.$emit('update:gmapObj', this.gmap)
    
    // 把地图当前的中心位置和zoom返回到父组件中
    this.gmap.on('zoomend', () => { this.$emit('update:zoom', this.gmap.getZoom()) })
    this.gmap.on('moveend', () => {
      let c = this.gmap.getCenter()
      this.$emit('update:center', [c.lng, c.lat])
    })
    
    this.painter = new Painter(this.gmap)

    this.drawImageLayers()
    this.drawPolygons()
    this.drawCircles()
    this.drawRectangles()
    this.drawPolylines()
    this.drawMarkers()
    this.drawTexts()
    
    this.playback()

    if (this.editData) {
      this._editer = new Editer(this.gmap, this.syncEditData)
      this.$emit('update:editer', this._editer)
    }
  }
  
  destroyed () {
    this.gmap && this.gmap.destroy()
  }

  // 把编辑的数据返回给应用
  syncEditData (result) {
    let data: any = {}
    if (result.position) {
      let p = converter.toWGS84R(result.position)
      data.position = [p.lng, p.lat]
    }
    if (result.address) data.address = result.address

    let target = result.target
    if (target instanceof AMap.Circle) {
      let center = converter.toWGS84R(target.getCenter())
      data.position = [center.lng, center.lat]
      data.radius = target.getRadius()
    } else if (target instanceof AMap.Rectangle) {
      let sw = converter.toWGS84R(target.getBounds().getSouthWest())
      let ne = converter.toWGS84R(target.getBounds().getNorthEast())
      data.path = []
      data.path.push([sw.lng, sw.lat])
      data.path.push([ne.lng, ne.lat])
    } else if (target instanceof AMap.Polyline || target instanceof AMap.Polygon) {
      let path = target.getPath()
      data.path = []
      for (let p of path) {
        let pos = converter.toWGS84R(p)
        data.path.push([pos.lng, pos.lat])
      }
    }

    this.$emit('update:editData', data)
  }
  
  @Watch('trackData')
  playback () {
    convertFromWGS84(this.trackData)
    if (!this._tracker) {
      let opts: any = this.trackOptions ? this.trackOptions : {}
      this._tracker = new Tracker(opts, this.gmap.getAMap(), this.trackData)
      this.$emit('update:tracker', this._tracker)
    } else {
      this._tracker.playback(this.trackData)
    }
  }
  
  @Watch('markers')
  drawMarkers () {
    convertFromWGS84(this.markers)
    this.painter.drawMarkers(this.markers)
  }
  
  @Watch('polylines')
  drawPolylines () {
    convertFromWGS84(this.polylines)
    this.painter.drawPolylines(this.polylines)
  }
   
  @Watch('polygons')
  drawPolygons () {
    convertFromWGS84(this.polygons)
    this.painter.drawPolygons(this.polygons)
  }
  
  @Watch('circles')
  drawCircles () {
    convertFromWGS84(this.circles)
    this.painter.drawCircles(this.circles)
  }
  
  @Watch('rectangles')
  drawRectangles () {
    convertFromWGS84(this.rectangles)
    this.painter.drawRectangles(this.rectangles)
  }
  
  @Watch('texts')
  drawTexts () {
    convertFromWGS84(this.texts)
    this.painter.drawTexts(this.texts)
  }
  
  @Watch('imageLayers')
  drawImageLayers () {
    convertFromWGS84(this.imageLayers)
    this.painter.drawImageLayers(this.imageLayers)
  }
  
  @Watch('zoom')
  setZoom () {
    this.gmap.setZoom(this.zoom)
  }
 
  @Watch('center')
  setCenter () {
    let c = this.gmap.getCenter()

    // 如果位置变化很小就不再调整了，否则会跟触发的update:center事件形成无限循环
    if (Math.abs(c.lng - this.center[0]) < 0.00000001 && Math.abs(c.lat - this.center[1]) < 0.00000001) return
    
    this.gmap.setCenter(this.center)
  }
}

function convertFromWGS84 (obj: any) {
  if (obj === null || typeof obj !== 'object' || obj instanceof Element) return

  if (!obj.sort) {
    for (let i in obj) {
      if (i === 'position' || i === 'center' ||
          i === 'southWest' || i === 'northEast') {
        obj[i] = converter.fromWGS84A(obj[i])
      } else if (i === 'path' && obj[i].sort && obj[i].length > 0 &&
          typeof obj[i][0][0] === 'number') { // 坐标数组
        for (let j = 0; j < obj[i].length; j++) {
          obj[i][j] = converter.fromWGS84A(obj[i][j])
        }
      } else if (i === 'path' && obj[i].sort && obj[i].length > 0 &&
          obj[i][0].sort && typeof obj[i][0][0][0] === 'number') { // 坐标数组的数组
        for (let j = 0; j < obj[i].length; j++) {
          for (let k = 0; k < obj[i][j].length; k++) {
            obj[i][j][k] = converter.fromWGS84A(obj[i][j][k])
          }
        }
      } else if (obj[i]) {
        convertFromWGS84(obj[i])
      }
    }
  } else {
    for (let i = 0; i < obj.length; i++) {
      convertFromWGS84(obj[i])
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* Marker Label的样式 */
.amap-marker-label {
  border: 1px solid #b8b8b8;
  color: #646464;
  border-radius: 0px 4px 4px 4px;
}
/* 信息框内容的样式 */
.amap-info-content {
}
</style>
