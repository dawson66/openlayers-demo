/*
 * @Description: 地图相关接口
 * @Author: wangmeng
 * @Date: 2023-09-26 14:48:41
 * @LastEditTime: 2023-11-15 15:24:15
 */


import { Layer } from 'ol/layer';
import service, { mockService } from './index'
import { LayerValue } from '@/map/Layer'

// 接口对应关系
const LayerRequestMap = new Map([
  [LayerValue.FuelGas, {
    // 'fuel-gas-pipeline':'fuel-gas-pipeline',
    'fuel-gas-station': 'fuelGas',
    // 'fuel-gas-valve-chest': 'fuel-gas-valve-chest'
  }],
  [LayerValue.Bridge, {
    'bridge': 'bridge',
  }],
  [LayerValue.Road, {
    // 'fast-road':'fast-road',
    // 'arterial-road':'arterial-road',
    // 'secondary-road':'secondary-road',
    // 'sub-road':'sub-road',
    // 'other-road':'other-road',
  }],
  [LayerValue.WaterSupply, {
    'water-supply-factory': 'water-supply-factory',
    'water-source': 'water-source',
    'pump-house': 'pump-house',
    'second-pump-house': 'second-pump-house',
    'supercharge-pump-house': 'supercharge-pump-house',
  }],
  [LayerValue.RainWater, {

  }]
])

/**
 * 根据图层名称获取矢量数据
 */
export const getVectorFeaturesByLayerName = async (layerName: string, params?: Record<string, any>) => {
  if (!layerName) {
    return null;
  }

  const res = await service({
    method: 'get',
    url: `/dashboard/gis/${layerName}`,
    params: params
  }).catch(error => {
    console.log(error);
  })
  return res?.data;
}