/*
 * @Description: 全局axios实例，请求、响应拦截。。。
 * @Author: wangmeng
 * @Date: 2023-09-26 13:55:16
 * @LastEditTime: 2023-11-14 16:07:12
 */

import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";

const service = axios.create({
  timeout: 10000,
  baseURL: import.meta.env.VITE_APP_BASE_API,
});

service.interceptors.request.use((config) => {
  return config;
});

service.interceptors.response.use(
  (config: AxiosResponse) => config,
  (error: AxiosError) => console.log("response error", error)
);

export default service;