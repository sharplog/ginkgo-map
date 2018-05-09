/**
 * 地图的类型定义
 */
export const TYPE_MARKER = 'Marker'
export const TYPE_POLYLINE = 'Polyline'
export const TYPE_POLYGON = 'Polygon'
export const TYPE_CIRCLE = 'Circle'
export const TYPE_RECTANGLE = 'Rectangle'
export const TYPE_TEXT = 'Text'
export const TYPE_IMAGELAYER = 'ImageLayer'

// 地图采用的坐标系
export const COOR_WGS84 = 1
export const COOR_GCJ02 = 2
export const COOR_BD09 = 3

export interface MarkerOptions {
  // 最好要有id，且id不能重复
  id?: string
  
  // 数组元素依次是经度、纬度
  position: number[]
  
  // icon图片的底部中心在坐标位置点上
  icon?: string
  
  // 点击Marker之后弹出的信息
  message?: any
  
  // label的左上角在坐标位置点上
  label?: string
  
  // 鼠标移动到Marker上时浮动显示的信息
  title?: string
  
  // 所属分组，同一个组内的覆盖物可以同时显示或隐藏
  group?: string
  
  // 供画Marker时使用
  _refreshed?: boolean
}

export interface PolylineOptions {
  // 最好要有id，且id不能重复
  id?: string
  
  // 每个数组元素是一对经纬度
  path: number[][]
  
  // 线条颜色
  strokeColor: string
  
  // 线条宽度
  strokeWeight: number
  
  // 线条透明度
  strokeOpacity?: number
  
  // 线条风格，实线:solid，虚线:dashed
  strokeStyle?: string
  
  /**
   * 勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在ie9+浏览器有效 取值： 
   * 实线：[0,0,0] 
   * 虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
   * 点画线：[10,2,2,2]，表示10个像素的实线和2个像素的空白 + 2个像素的实线和2个像素的空白 （如此反复）组成的虚线
   */
  strokeDasharray?: number[]
  
  // 是否延路径显示白色方向箭头,默认false。Canvas绘制时有效，建议折线宽度大于6时使用
  showDir?: boolean
  
  // 鼠标悬停时的鼠标样式
  cursor?: string
  
  // 折线覆盖物的叠加顺序
  zIndex?: string
  
  // 描边的宽度，默认为1。描边的宽度与颜色有一项赋值时，就会有描边
  borderWeight?:	number
  
  // 线条描边颜色，默认：#000000
  outlineColor?: string

  // 线条是否带描边，默认false。一般不需要设置
  isOutline?: boolean
  
  // 点击Marker之后弹出的信息
  message?: any
  
  // 所属分组，同一个组内的覆盖物可以同时显示或隐藏
  group?: string
}

export interface PolygonOptions {
  // 最好要有id，且id不能重复
  id?: string
  
  // 每个数组元素是一对经纬度。再加一维数据来表示环形的区域，第一个数组元素表示外圈
  // 坐标，后面的数组元素表示内部各岛的坐标
  path: number[][] | number[][][]
  
  // 多边形填充颜色
  fillColor: string
  
  // 多边形填充透明度
  fillOpacity?:	number
  
  // 轮廓线条颜色
  strokeColor?: string
  
  // 轮廓线条宽度
  strokeWeight: number
  
  // 轮廓线条透明度
  strokeOpacity?: number
  
  // 轮廓线条风格，实线:solid，虚线:dashed
  strokeStyle?: string
  
  /**
   * 勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在ie9+浏览器有效 取值： 
   * 实线：[0,0,0] 
   * 虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
   * 点画线：[10,2,2,2]，表示10个像素的实线和2个像素的空白 + 2个像素的实线和2个像素的空白 （如此反复）组成的虚线
   */
  strokeDasharray?: number[]
  
  // 鼠标悬停时的鼠标样式
  cursor?: string
  
  // 鼠标经过时的透明度
  lightenOpacity?: number
  
  // 鼠标经过时的颜色
  lightenColor?: string
  
  // 多边形覆盖物的叠加顺序
  zIndex?: string
  
  // 显示在多边形中心位置
  label?: string
  
  // 点击多边形之后弹出的信息
  message?: any
  
  // 所属分组，同一个组内的覆盖物可以同时显示或隐藏
  group?: string
}

export interface CircleOptions {
  // 最好要有id，且id不能重复
  id?: string
  
  // 圆心坐标
  center: number[]
  
  // 圆半径，单位：米
  radius: number
  
  // 圆填充颜色
  fillColor: string
  
  // 圆填充透明度
  fillOpacity?:	number
  
  // 轮廓线条颜色
  strokeColor?: string
  
  // 轮廓线条宽度
  strokeWeight: number
  
  // 轮廓线条透明度
  strokeOpacity?: number
  
  // 轮廓线条风格，实线:solid，虚线:dashed
  strokeStyle?: string
  
  /**
   * 勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在ie9+浏览器有效 取值： 
   * 实线：[0,0,0] 
   * 虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
   * 点画线：[10,2,2,2]，表示10个像素的实线和2个像素的空白 + 2个像素的实线和2个像素的空白 （如此反复）组成的虚线
   */
  strokeDasharray?: number[]
  
  // 鼠标悬停时的鼠标样式
  cursor?: string
  
  // 鼠标经过时的透明度
  lightenOpacity?: number
  
  // 鼠标经过时的颜色
  lightenColor?: string
  
  // 圆覆盖物的叠加顺序
  zIndex?: string
  
  // 显示在圆中心位置
  label?: string
  
  // 点击圆之后弹出的信息
  message?: any
  
  // 所属分组，同一个组内的覆盖物可以同时显示或隐藏
  group?: string
}

export interface RectangleOptions {
  // 最好要有id，且id不能重复
  id?: string
  
  // 西南角坐标
  southWest: number[]
  
  // 东北角坐标
  northEast: number[]
  
  // 矩形填充颜色
  fillColor: string
  
  // 矩形填充透明度
  fillOpacity?:	number
  
  // 轮廓线条颜色
  strokeColor?: string
  
  // 轮廓线条宽度
  strokeWeight: number
  
  // 轮廓线条透明度
  strokeOpacity?: number
  
  // 轮廓线条风格，实线:solid，虚线:dashed
  strokeStyle?: string
  
  /**
   * 勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在ie9+浏览器有效 取值： 
   * 实线：[0,0,0] 
   * 虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
   * 点画线：[10,2,2,2]，表示10个像素的实线和2个像素的空白 + 2个像素的实线和2个像素的空白 （如此反复）组成的虚线
   */
  strokeDasharray?: number[]
  
  // 鼠标悬停时的鼠标样式
  cursor?: string
  
  // 鼠标经过时的透明度
  lightenOpacity?: number
  
  // 鼠标经过时的颜色
  lightenColor?: string
  
  // 矩形覆盖物的叠加顺序
  zIndex?: string
  
  // 显示在矩形中心位置
  label?: string
  
  // 点击矩形之后弹出的信息
  message?: any
  
  // 所属分组，同一个组内的覆盖物可以同时显示或隐藏
  group?: string
}

export interface TextOptions {
  // 最好要有id，且id不能重复
  id?: string
  
  // 文本内容
  text: string
  
  // 位置
  position: number[]
  
  // 横向上position位于text的位置，'left' 'right', 'center'，默认center
  textAlign?: string
  
  // 纵向position位于text的位置，'top' 'middle', 'bottom'，默认middle
  verticalAlign?: string
  
  // 旋转角度
  angle?: number
  
  // 样式
  style?: any
  
  // 鼠标悬停时的鼠标样式
  cursor?: string
  
  // 文本覆盖物的叠加顺序
  zIndex?: string
  
  // 点击文本之后弹出的信息
  message?: any
  
  // 所属分组，同一个组内的覆盖物可以同时显示或隐藏
  group?: string
}

export interface ImageLayerOptions {
  // 最好要有id，且id不能重复
  id?: string
  
  // 西南角坐标
  southWest: number[]
  
  // 东北角坐标
  northEast: number[]

  // 图片地址
  url: string

  // 图层的透明度，[0,1]
  opacity: number

  // 层级，缺省为12
  zIndex: number

  // 可见级别，[最小级别，最大级别]
  zooms: number[]
}

// 轨迹线上每个点的数据
export interface TrackPointData {
  // 位置
  position: number[]
  
  // 时间
  time: string
  
  // 速度，公里/小时
  speed: number
  
  // 除了时间和速度之外的显示信息
  message?: string
}

// 轨迹线数据
export interface TrackPath {
  // 本轨迹线的名字，比如叫：已洒水路段
  name: string
  
  // 轨迹线样式，没有自己的就用轨迹的样式
  lineStyle: any
  
  // 走过的轨迹线的样式，没有自己的就用轨迹的样式
  linePassedStyle: any
  
  // 数据
  path: TrackPointData[]
}

/**
 * 轨迹数据。
 * 可有多条轨迹线，合成一条轨迹。比如行车过程中的超速行驶的路段，就需要用单独的轨迹线。
 * 回放时，所有轨迹线连在一起，依次回放
 */
export interface TrackData {
  // 轨迹线
  paths: TrackPath[]
}

/**
 * 回放器配置
 */
export interface TrackerOptions {
  // 轨迹线的样式
  lineStyle: any
  
  // 走过的轨迹线的样式
  linePassedStyle: any
  
  // 回放器的样式
  navigatorStyle: any
    
  // 循环播放，默认为false
  loop?: boolean
  
  // 巡航速度，单位千米/小时
  speed: number
  
  // 加载了数据后是否自动进行回放，默认自动回放
  autoStart?: boolean
}

/**
 * Marker的编辑器配置
 */
export interface EditMarkerOptions {
  // 起始坐标
  position?: number[]

  // 图标
  icon?: string

  // 图标的锚点
  ancher?: number[]

  // 图标的大小
  size?: number[]

  // 模式：dragMarker/dragMap
  mode?: string
}

/**
 * 除Marker外的编辑器配置
 */
export interface EditNoMarkerOptions {
  // 填充颜色
  fillColor?: string
  
  // 填充透明度
  fillOpacity?:	number
  
  // 轮廓线条颜色
  strokeColor?: string
  
  // 轮廓线条宽度
  strokeWeight?: number
  
  // 轮廓线条透明度
  strokeOpacity?: number
  
  // 轮廓线条风格，实线:solid，虚线:dashed
  strokeStyle?: string
  
  /**
   * 勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在ie9+浏览器有效 取值： 
   * 实线：[0,0,0] 
   * 虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
   * 点画线：[10,2,2,2]，表示10个像素的实线和2个像素的空白 + 2个像素的实线和2个像素的空白 （如此反复）组成的虚线
   */
  strokeDasharray?: number[]
}

/**
 * 双向传递编辑数据
 */
export interface EditData {
  // Marker的起始坐标，圆的圆心位置
  position?: number[]

  // 折线、多边形、矩形的顶点坐标
  path?: number[][]

  // 圆的半径
  radius?: number

  // 选择Marker位置后，返回的地址
  address?: string
}
