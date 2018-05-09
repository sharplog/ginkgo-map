import Map from './Map.vue' // 导入组件

const ginkgoMap = {
  install (Vue, options) {
    Vue.component('ginkgo-map', Map)
  }
}
    
let win: any = window
if (typeof win !== 'undefined' && win.Vue) {
  win.Vue.use(ginkgoMap)
}

export default ginkgoMap // 导出..
