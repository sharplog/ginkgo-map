/**
 * 坐标转换的方法
 * 传入和返回的坐标都是如下对象：
 * {lat: 36, lng: 117}
 */

import * as Types from './Types'

function round (num: number, precision: number) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
}

/**
 * _coorStandard：目标GPS的坐标系，原本的坐标系为wgs84
 */
export default class CoorConverter {
  constructor (private _coorStandard: number) {
  }

  /**
   * 转换为目标体系（this._coorStandard）坐标，参数为数组
   */
  fromWGS84A (pos: number[]) {
    let p = this.fromWGS84({ lng: pos[0], lat: pos[1] })
    return [p.lng, p.lat]
  }

  /**
   * 从目标体系（this._coorStandard）坐标转换为原本坐标，参数为数组
   */
  toWGS84A (pos: number[]) {
    let p = this.toWGS84({ lng: pos[0], lat: pos[1] })
    return [p.lng, p.lat]
  }

  /**
   * 从目标体系（this._coorStandard）坐标转换为原本坐标，四舍五入
   */
  toWGS84R (pos) {
    let p = this.toWGS84(pos)
    return { lng: round(p.lng, 7), lat: round(p.lat, 7) }
  }

  /**
   * 转换为目标体系（this._coorStandard）坐标
   */
  fromWGS84 (pos) {
    // TODO 需要实现
    return pos
  }

  /**
   * 从目标体系（this._coorStandard）坐标转换为原本坐标
   */
  toWGS84 (pos) {
    // TODO 需要实现
    return pos
  }
}
