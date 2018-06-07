# ginkgo-map

一个高德地图的Vue插件。具有如下功能：
- 在地图上画点、线、面，包括包括Marker、Polyline、Polygon、Circle、Rectangle、ImageLayer
- 分组控制显示
- 从地图上删除显示的点、线、面
- 可用作图的方式在地图上创建点、线、面，包括Marker、Polyline、Polygon、Circle、Rectangle，编辑完成后返回其顶点坐标（圆还要返回半径）
- 可进行轨迹的回放及其回放过程的控制

## Install

``` bash
npm install ginkgo-map
```

## Demo

[demo代码](https://github.com/sharplog/ginkgo-map-demo)
[在线演示](http://nsapp.applinzi.com/gmapdemo/)

## 使用
#### index.html中引入API
在index.html中引入高德地图的JS API：
```html
<script language="javascript" src="http://webapi.amap.com/maps?v=1.4.5&key=a6a80a41a8543e348e6497b1bd0e7821&plugin=AMap.Scale,AMap.MapType,AMap.ToolBar,AMap.Geocoder,AMap.PolyEditor,AMap.CircleEditor,AMap.RectangleEditor"></script>
<script src="//webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>
```
#### main.js中引入地图插件
```javascript
import GinkgoMap from 'ginkgo-map'
Vue.use(GinkgoMap)
```

#### Vue组件中使用
直接用标签形式使用：
```html
<ginkgo-map ref="map" class="gingo-map" :gmapObj.sync="gmap" :options="mapOptions" :zoom.sync="zoom" :center.sync="center"></ginkgo-map>
```

