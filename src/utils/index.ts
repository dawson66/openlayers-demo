import { getScaleRatio, baseSize } from "./rem";

/**
 * @param {date} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 * @returns {String}
 */
export const formatTime = (
  time: string | number | Date,
  fmt: string
): string => {
  if (!time) return ''
  const date = new Date(time)
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        // @ts-ignore: Unreachable code error
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function debounce(fn: Function, delay: Number | any) {
  const delays = delay || 500;
  let timer: any;
  return function () {
    const th = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, delays);
  };
}

/**
 * @description: 获取非public目录下的静态资源，一般用于非vue文件中需要导入静态资源场景
 * @return {*}
 * @param {string} url
 */
export const getAssetsFile = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href
}

/**
 * 生成苏州市区范围内随机坐标
 * @returns 
 */
export const getRandomCoord = () => {
  // 120.347574,31.361566
  // 120.910416,31.114065
  let longitude = Math.random() * 1 + 120.347;
  let latitude = Math.random() * 1 + 31.100065;
  return [longitude, latitude]
}

/**
 * @param {Number} size 需要转换的尺寸大小
 * @returns {Number}
 */
export function computedSize(
  size: number
) {
  const ratio = getScaleRatio();

  return Math.trunc(size * ratio);  
}

export function px2rem(px: string) {
  return /%/ig.test(px) ? px : `${parseFloat(px) / baseSize}rem`;
}

/**
 * 生成 uuid
 *
 * @returns {String}
 */
export function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}
