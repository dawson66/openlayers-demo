/*
 * @Description: 非地图接口
 * @Author: wangmeng
 * @Date: 2023-09-26 14:59:25
 * @LastEditTime: 2023-09-26 16:09:30
 */

import service from "./index";

/**
 * @description: TODO: 大屏所有接口被写在一个方法中，并且在各个组件中定义，需集中到一个文件中并注明注释！
 * @return {*}
 * @param {string} url
 * @param {string} method
 * @param {any} data
 */
export function requestAlllist(url: string, method?: string, data?: any) {
  return service({
    url: `/dashboard/${url}`,
    method: method || "get",
    data,
  });
}

/**
 * @description: requestAlllist 的 get 版本
 * @return {*}
 * @param {string} url
 * @param {string} method
 * @param {any} params
 */
export function get(url: string, params: any = {}) {
  return service({
    url: `/dashboard/${url}`,
    method: "get",
    params,
  });
}
