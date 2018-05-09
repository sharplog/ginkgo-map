/**
 * 轨迹回放器
 */
import GMap from './GMap'
import * as Types from './Types'

let win: any = window
let AMapUI: any = win.AMapUI
let map: any

let emptyLineStyle = {
  lineWidth: 0,
  fillStyle: null,
  strokeStyle: null,
  borderStyle: null
}

function copy (from, to) {
  if (from && typeof to !== 'undefined' && to !== null) {
    for (let k in from) {
      to[k] = from[k]
    }
  }
}
        
export default class Tracker {
  pathSimplifierIns: any
  navigators: any[] = []
  curNavigator: any
  isManulPaused: boolean = false

  // 轨迹线的数量
  lineNumber: number
  
  // 轨迹线的样式，默认不显示
  lineStyle: any = {}
  
  // 走过的轨迹线的样式
  linePassedStyle: any = {}
  
  // 回放器的样式
  navigatorStyle: any = {}
  
  // 加载了数据后是否自动进行回放，默认自动回放
  autoStart: boolean = true
  
  // 循环播放
  loop: boolean = false
  
  // 巡航速度，单位千米/小时
  speed: number = 1000

  hideNavi = { width: 0, height: 0 }
  showNavi = { width: 0, height: 0 }
  
  constructor (options: Types.TrackerOptions, private amap: any, data?: Types.TrackData) {
    copy(options.lineStyle, this.lineStyle)
    copy(options.linePassedStyle, this.linePassedStyle)
    copy(options.navigatorStyle, this.navigatorStyle)
    this.navigatorStyle.pathLinePassedStyle = this.linePassedStyle
    this.autoStart = !(options.autoStart === false)
    this.loop = (options.loop === true)
    if (options.speed > 0) this.speed = options.speed
    this.showNavi = { width: this.navigatorStyle.width, height: this.navigatorStyle.height }
    
    AMapUI.load('ui/misc/PathSimplifier', PathSimplifier => {
      if (!PathSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！')
        return
      }
    
      this.initPage(PathSimplifier)

      if (data) {
        this.playback(data)
      }
    })
  }
 
  onIconLoad () {
    let this0 = this
    return function () {
      // 如果没有设置icon的大小
      if (!this0.showNavi.width) {
        this0.showNavi = { width: this.width, height: this.height }
      }
      this0.pathSimplifierIns.renderLater()
    }
  }

  onIconError (e) {
    alert('轨迹回放图标载失败！')
  }

  initPage (PathSimplifier) {
    if (this.navigatorStyle.icon) {
      this.navigatorStyle.content = PathSimplifier.Render.Canvas.getImageContent(this.navigatorStyle.icon,
        this.onIconLoad(), this.onIconError)
    }

    let this0 = this
    this.pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      map: this.amap, 

      getPath: function (pathData: Types.TrackPath, pathIndex: number) {
        let path: number[][] = []
        for (let i in pathData.path) {
          path.push(pathData.path[i].position)
        }
        return path
      },
      
      getHoverTitle: function (pathData: Types.TrackPath, pathIndex: number, pointIndex: number) {
        if (pointIndex >= 0) {
          let pointData = pathData.path[pointIndex]
          let msg = '时间:' + pointData.time + '，速度:' + pointData.speed
          if (pointData.message) msg += '<br/>' + pointData.message
          return msg
        } 
        
        return pathData.name
      },
      
      renderOptions: {
        pathLineStyle: this.lineStyle,
        pathLineHoverStyle: emptyLineStyle,
        renderAllPointsIfNumberBelow: 100, // 绘制路线节点，如不需要可设置为-1
        pathNavigatorStyle: this.navigatorStyle,

        // 每条轨迹线可能会有自己的样式
        getPathStyle: function (pathItem, zoom) {
          let style: any = {
            pathLineStyle: pathItem.pathData.lineStyle ? pathItem.pathData.lineStyle : {}, 
            pathNavigatorStyle: {
              pathLinePassedStyle: pathItem.pathData.linePassedStyle ? pathItem.pathData.linePassedStyle : {}
            }
          }
          let kps = this0.pathSimplifierIns.getRenderOption('keyPointStyle')
          if (pathItem.pathIndex > 0) style.startPointStyle = kps
          if (pathItem.pathIndex < this0.lineNumber - 1) style.endPointStyle = kps
          return style
        }
      }
    })
  }
  
  playback (data: Types.TrackData) {
    this.pathSimplifierIns.clearPathNavigators()

    if (!data || !data.paths) {
      this.pathSimplifierIns.setData(null)
      return
    }

    // 设置数据
    this.pathSimplifierIns.setData(data.paths)
    this.lineNumber = data.paths.length

    // 对每一条线路创建一个巡航器
    this.navigators[0] = this.pathSimplifierIns.createPathNavigator(0, {
      loop: this.loop, speed: this.speed, pathNavigatorStyle: this.showNavi
    })
    for (let i = 1; i < this.lineNumber; i++) {
      this.navigators[i] = this.pathSimplifierIns.createPathNavigator(i, {
        loop: this.loop, speed: this.speed, pathNavigatorStyle: this.hideNavi
      })
    }
    this.startNextNavi(0)

    this.autoStart && this.start()
  }

  startNextNavi (curIndex: number) {
    if (curIndex === this.lineNumber - 1) return

    this.navigators[curIndex].on('pause', event => {
      console.log('navi pause: ' + curIndex + ' ' + event.type)
      // 如果是手动暂停的，不自动回放下一条轨迹
      if (this.isManulPaused) return

      this.navigators[curIndex + 1].setOption('pathNavigatorStyle', this.showNavi)
      this.navigators[curIndex].setOption('pathNavigatorStyle', this.hideNavi)
      this.startNextNavi(curIndex + 1)

      this.curNavigator = this.navigators[curIndex + 1]
      this.navigators[curIndex + 1].start()
    })
  }

  start () {
    this.isManulPaused = false

    if (this.curNavigator && this.curNavigator !== this.navigators[0]) {
      this.curNavigator.setOption('pathNavigatorStyle', this.hideNavi)
      this.navigators[0].setOption('pathNavigatorStyle', this.showNavi)
    }

    this.curNavigator = this.navigators[0]
    this.navigators[0].start()
  }

  pause () {
    this.isManulPaused = true
    this.curNavigator.pause()
  }

  resume () {
    this.isManulPaused = false
    this.curNavigator.resume()
  }

  stop () {
    this.isManulPaused = false
    for (let i = 0; i < this.lineNumber; i++) {
      this.navigators[i].stop()
    }
  }

  restart () {
    this.stop()
    this.start()
  }

  setSpeed (speed: number) {
    for (let i = 0; i < this.lineNumber; i++) {
      this.navigators[i].setOption('speed', speed)
    }
  }

  clear () { this.playback(null) }
}
