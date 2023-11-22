import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

enum CesiumImageryEnum {
  Url = 'URL',
  Wms = 'WMS',
  Wmts = 'WMTS',
  ArcGis = 'ArcGIS',
}

interface Layer {
  label: string,
  value: string;
  visible: boolean;
}

// 影像图层，字段后续扩充
interface ImageryLayer extends Layer {
  id?: string;
  url: string;
  type: CesiumImageryEnum;
}

interface TianDiTuImageryLayer extends ImageryLayer {
  layer: string;
}

// 倾斜摄影图层，字段后续扩充
interface TilesetLayer extends Layer {
  visible: boolean;
}

// 矢量图层，字段后续扩充，暂多为Datasource
interface VectorLayer extends Layer {
  visible: boolean;
}

// 图层组件
interface LayerTree extends Layer {
  icon?: string,
  // 图层图例，子图层
  legend?: LayerTree[];
  children?: LayerTree[];
  // 图层显示隐藏， 控制所有子图层显示隐藏
  parent?: string;
  // 图层 check-box 涉及父级
  active?: boolean;
  // 图层选中
  pitch?: boolean;
  // 图层要素数量
  featureCount?: number
}

// 所有图层value值枚举
enum LayerValue {
  FuelGas = "fuelGas",
  Bridge = "bridge",
  Road = "road",
  WaterSupply = "waterSupply",
  // DrainWater = "drainWater",
  // 雨水
  RainWater = 'rainWater',
  // 污水
  Sewage = 'sewage',
  UndergroundPipeline = "undergroundPipeline",
  ThirdPartyConstruction = "thirdPartConstruction",
  LongDistanceOilGas = "longDistanceOilGas",
  RiskAndOlderHouse = 'riskAndOlderHouse',
  // 应急资源
  EmergencyResouce = 'emergencyResource',
  // 重点防护目标
  ForemostProtectionObject = 'foremostProtectionObject',
  // 风险点位
  RiskPoint = 'riskPoint',
  RiskPointGas = 'gasRiskPoint',
  RiskPointWaterSupply = 'waterSupplyRiskPoint',
  RiskPointWaterDrain = 'waterDrainRiskPoint',
  RiskPointBridge = 'bridgeRiskPoint',
  RiskPointRoad = 'riskRoadPoint',
  // 监测设备
  MonitorDevice = 'monitorDevice',
  MonitorDeviceGas = 'warningDeviceGas',
  MonitorDeviceBridge = 'warningDeviceBridge',
  MonitorDeviceDrainWater = 'warningDeviceWaterDrain',
  MonitorDeviceWaterSupply = 'warningDeviceWaterSupply',
  MonitorDeviceOilGas = 'warningDeviceLongOli',
  MonitorDeviceHouse = 'warningDeviceDangerHouse',
  MonitorDeviceThirdParty = 'warningDeviceThirdPart',
  // 预警点位
  AlarmPoint = 'alarmPoint'
}

// 默认加载的图层
// export const DefaultLoadLayers: Array<string> = [LayerValue.FuelGas,  LayerValue.Bridge, LayerValue.Road, LayerValue.RiskAndOlderHouse, LayerValue.ThirdPartyConstruction, LayerValue.WaterSupply, LayerValue.ForemostProtectionObject, LayerValue.EmergencyResouce]
const DefaultLoadLayers: Array<string> = [LayerValue.FuelGas]


// /**
//  * 递归获取图层信息，返回数组
//  * @param layerName
//  * @param layerData
//  * @returns Array<LayerTree>
//  */
// const recursionGetLayerInfoByName = (result: LayerTree[] = [], layerName: string, layerData: Array<LayerTree> = LayerTree) => {
//   if (!layerData) {
//     return null;
//   }

//   for (const layer of layerData) {
//     const { value, children } = layer;
//     if (value && value === layerName) {
//       if (layer.children) {
//         result.push(...layer.children)
//       } else {
//         result.push(layer);
//       }
//     } else if (layer.children) {
//       recursionGetLayerInfoByName(result, layerName, layer.children)
//     }
//   }
// };

// /**
//  * 根据图层名称获取图层 Tree 信息
//  * @param layerName 
//  * @returns 
//  */
// const getTreeDataByName = (layerName: string): LayerTree[] => {
//   const result: LayerTree = [];
//   recursionGetLayerInfoByName(result, layerName, LayerTreeData);
//   if (!result.length) {
//     recursionGetLayerInfoByName(result, layerName, WarningInfoTree);
//   }
//   return result;
// }

const LayerTreeData: Array<LayerTree> = [
  {
    label: "基础设施",
    value: "base",
    children: [
      {
        label: "燃气",
        value: LayerValue.FuelGas,
        icon: 'svg/fuel-gas.svg',
        legend: [
          {
            label: '管线',
            value: 'fuel-gas-pipeline',
            icon: 'fuel-gas-pipeline',
            visible: true,
          },
          {
            label: '管点',
            value: 'fuel-gas-point',
            icon: 'fuel-gas-point',
            visible: false,
          },
          {
            label: '场站',
            value: 'fuel-gas-station',
            icon: 'fuel-gas-station',
            visible: false,
            featureCount: 0,
          },
          {
            label: '阀室',
            value: 'fuel-gas-valve-chest',
            icon: 'fuel-gas-valve-chest',
          },
          {
            label: '监测点位',
            value: 'fuel-gas-monitoring-point',
            icon: 'water-supply-monitoring-point',
            visible: false,
            featureCount: 0,
          },
        ]
      },
      {
        label: "桥梁",
        value: LayerValue.Bridge,
        icon: "svg/bridge-blue.svg",
        legend: [
          {
            label: '桥梁',
            value: LayerValue.Bridge,
            icon: 'bridge',
            visible: false,
            featureCount: 0,
          }
        ]
      },
      {
        label: "道路",
        value: LayerValue.Road,
        icon: 'svg/road.svg',
        legend: [
          {
            label: '快速路',
            value: 'fast-road',
            icon: 'fast-road',
            visible: false,
            featureCount: 0,
            dataMap: '1'
          },
          {
            label: '主干路',
            value: 'arterial-road',
            icon: 'arterial-road',
            visible: false,
            featureCount: 0,
            dataMap: '2'
          },
          {
            label: '次干路',
            value: 'secondary-road',
            icon: 'secondary-road',
            visible: false,
            featureCount: 0,
            dataMap: '3'
          },
          {
            label: '支路',
            value: 'sub-road',
            icon: 'sub-road',
            visible: false,
            featureCount: 0,
            dataMap: '4'
          },
          {
            label: '其他',
            value: 'other-road',
            icon: 'other-road',
            visible: false,
            featureCount: 0,
            dataMap: '0'
          }
        ]
      },
      {
        label: "供水",
        value: LayerValue.WaterSupply,
        icon: 'water-supply-factory',
        legend: [
          {
            label: '供水厂',
            value: 'water-supply-factory',
            icon: 'water-supply-factory'
          },
          {
            label: '水源地',
            value: 'water-source',
            icon: 'water-source'
          },
          {
            label: '泵房',
            value: 'pump-house',
            icon: 'pump-house'
          },
          {
            label: '二供泵房',
            value: 'second-pump-house',
            icon: 'second-pump-house'
          },
          {
            label: '增压泵房',
            value: 'supercharge-pump-house',
            icon: 'supercharge-pump-house'
          },
          {
            label: '场站',
            value: 'water-supply-station',
            icon: 'water-supply-station',
            visible: false,
            featureCount: 0,
          },
          {
            label: '监测点位',
            value: 'water-supply-monitoring-point',
            icon: 'supercharge-pump-house',
            visible: false,
            featureCount: 0,
          }
        ]
      },
      {
        label: "雨水",
        value: LayerValue.RainWater,
        icon: 'svg/drain-water.svg',
        legend: [
          {
            label: '主要河道',
            value: 'main-riverway',
            icon: 'main-riverway'
          },
          {
            label: '排放口',
            value: 'discharge-outlet',
            icon: 'discharge-outlet'
          },
          {
            label: '调蓄池',
            value: 'rainwater-pond',
            icon: 'rainwater-pond'
          },
          {
            label: '排水泵站',
            value: 'drainwater-pump-station',
            icon: 'drainwater-pump-station'
          },
          {
            label: '雨水管网',
            value: 'rainwater-pipeline',
            icon: 'rainwater-pipeline',
            visible: false,
          },
          {
            label: '检查井',
            value: 'inspection-shaft',
            icon: 'inspection-shaft'
          }
        ]
      },
      {
        label: "污水",
        value: LayerValue.Sewage,
        icon: 'svg/drain-water.svg',
        legend: [
          {
            label: '污水管网',
            value: 'sewage-pipeline',
            icon: 'sewage-pipeline',
            visible: false
          },
          {
            label: '检查井',
            value: 'sewage-inspection-shaft',
            icon: 'sewage-inspection-shaft'
          },
          {
            label: '截流设施-泵',
            value: 'cut-off-device-pump',
            icon: 'cut-off-device-pump'
          },
          {
            label: '截流设施-堰',
            value: 'cut-off-device-weir',
            icon: 'cut-off-device-weir'
          },
          {
            label: '截流设施-闸',
            value: 'cut-off-device-floodgate',
            icon: 'cut-off-device-floodgate'
          },
          {
            label: '截流设施-阀',
            value: 'cut-off-device-valve',
            icon: 'cut-off-device-valve'
          },
          {
            label: '截流设施-其他',
            value: 'cut-off-device-other',
            icon: 'cut-off-device-other'
          },
          {
            label: '污水处理厂',
            value: 'sewage-disposal-works',
            icon: 'sewage-disposal-works'
          }
        ]
      },
      {
        //third_part_construction
        label: "第三方施工",
        value: LayerValue.ThirdPartyConstruction,
        icon: 'svg/third-part-construction.svg',
        legend: [
          {
            label: '施工项目',
            value: 'construction-project',
            icon: 'construction',
            visible: false,
            featureCount: 0,
          }
        ]
      },
      {
        label: "油气长输",
        value: LayerValue.LongDistanceOilGas,
        icon: 'svg/third-part-construction.svg',
        legend: [
          {
            label: '西气东输管道',
            value: 'west-east-gas-pipeline',
            icon: 'west-east-gas-pipeline'
          },
          {
            label: '省天然气管道',
            value: 'province-natural-gas-pipeline',
            icon: 'province-natural-gas-pipeline'
          },
          {
            label: '原油及成品油管道',
            value: 'crude-oil-gas-pipeline',
            icon: 'crude-oil-gas-pipeline'
          },
          {
            label: '场站',
            value: 'oil-gas-station',
            icon: 'oil-gas-station'
          },
          {
            label: '阀室',
            value: 'oil-gas-valve-chest',
            icon: 'oil-gas-valve-chest'
          }
        ]
      },
      {
        label: "危旧房屋",
        value: LayerValue.RiskAndOlderHouse,
        icon: 'svg/risk-and-older-house.svg',
        legend: [
          {
            label: 'C级',
            value: 'house-c-level',
            icon: 'house-c-level',
            visible: false,
            featureCount: 0,
          },
          {
            label: 'D级',
            value: 'house-d-level',
            icon: 'house-d-level',
            visible: false,
            featureCount: 0,
          },
          {
            label: '其他',
            value: 'house-other-level',
            icon: 'house-other-level',
            visible: false,
            featureCount: 0,
          }
        ]
      },
    ],
  },
  {
    label: "风险点位",
    value: LayerValue.RiskPoint,
    icon: 'svg/risk-and-older-house.svg',
    children: [
      {
        label: '燃气专项',
        value: LayerValue.RiskPointGas,
        icon: 'protect-school',
        legend: [
          {
            label: '重大风险',
            value: 'risk-point-gas-major',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '较大风险',
            value: 'risk-point-gas-larger',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '一般风险',
            value: 'risk-point-gas-general',
            icon: 'risk-general',
            visible: false,
          },
          {
            label: '低风险',
            value: 'risk-point-gas-lower',
            icon: 'risk-lower',
          }
        ]
      },
      {
        label: '道路专项',
        value: LayerValue.RiskPointRoad,
        icon: 'protect-hospital',
        legend: [
          {
            label: '重大风险',
            value: 'risk-point-road-major',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '较大风险',
            value: 'risk-point-road-larger',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '一般风险',
            value: 'risk-point-road-general',
            icon: 'risk-general',
            visible: false,
          },
          {
            label: '低风险',
            value: 'risk-point-road-lower',
            icon: 'risk-lower',
          }
        ]
      },
      {
        label: '桥梁专项',
        value: LayerValue.RiskPointBridge,
        icon: 'protect-building',
        legend: [
          {
            label: '重大风险',
            value: 'risk-point-bridge-major',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '较大风险',
            value: 'risk-point-bridgelarger',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '一般风险',
            value: 'risk-point-bridge-general',
            icon: 'risk-general',
            visible: false,
          },
          {
            label: '低风险',
            value: 'risk-point-bridge-lower',
            icon: 'risk-lower',
          }
        ]
      },
      {
        label: '内涝专项',
        value: LayerValue.RiskPointWaterDrain,
        icon: 'protect-object',
        legend: [
          {
            label: '重大风险',
            value: 'risk-point-drain-water-major',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '较大风险',
            value: 'risk-point-drain-water-larger',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '一般风险',
            value: 'risk-point-drain-water-general',
            icon: 'risk-general',
            visible: false,
          },
          {
            label: '低风险',
            value: 'risk-point-drain-water-lower',
            icon: 'risk-lower',
          }
        ]
      },
      {
        label: '供水专项',
        value: LayerValue.RiskPointWaterSupply,
        icon: 'protect-object',
        legend: [
          {
            label: '重大风险',
            value: 'risk-point-drain-water-major',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '较大风险',
            value: 'risk-point-drain-water-larger',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '一般风险',
            value: 'risk-point-drain-water-general',
            icon: 'risk-general',
            visible: false,
          },
          {
            label: '低风险',
            value: 'risk-point-drain-water-lower',
            icon: 'risk-lower',
          }
        ]
      }
    ]
  },
  {
    label: "应急资源",
    value: LayerValue.EmergencyResouce,
    icon: 'svg/emergency-houseware.svg',
    legend: [
      {
        label: '应急队伍',
        value: 'emergency-team',
        icon: 'emergency-team',
        visible: false,
      },
      {
        label: '应急专家',
        value: 'emergency-expert',
        icon: 'emergency-expert',
        visible: false,
      },
      {
        label: '应急仓库',
        value: 'emergency-houseware',
        icon: 'emergency-houseware',
        visible: false,
      },
      {
        label: '避难场所',
        value: 'emergency-refuge',
        icon: 'emergency-refuge',
        visible: false,
      },
      {
        label: '大型装备',
        value: 'emergency-large-equip',
        icon: 'emergency-large-equip',
        visible: false,
      }
    ]
  },
  {
    label: "重点防护目标",
    value: LayerValue.ForemostProtectionObject,
    icon: 'svg/protected-object.svg',
    legend: [
      {
        label: '学校',
        value: 'protect-school',
        icon: 'protect-school',
        visible: false,
      },
      {
        label: '医院',
        value: 'protect-hospital',
        icon: 'protect-hospital',
        visible: false,
      },
      {
        label: '超高层建筑',
        value: 'protect-building',
        icon: 'protect-building',
        visible: false,
      },
      {
        label: '重点保护对象',
        value: 'protect-object',
        icon: 'protect-object',
        visible: false,
      }
    ]
  },
];


// 监测预警
const WarningInfoTree: Array<LayerTree> = [
  {
    label: "监测设备",
    value: LayerValue.MonitorDevice,
    icon: 'svg/major-warning.svg',
    children: [
      {
        label: '燃气专项',
        value: LayerValue.MonitorDeviceGas,
        icon: 'protect-school',
        legend: [
          {
            label: '在线',
            value: 'monitor-device-gas-online',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '离线',
            value: 'monitor-device-gas-offline',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '报警',
            value: 'monitor-device-gas-warning',
            icon: 'risk-general',
            visible: false,
          }
        ]
      },
      {
        label: '桥梁专项',
        value: LayerValue.MonitorDeviceBridge,
        icon: 'protect-building',
        legend: [
          {
            label: '在线',
            value: 'monitor-device-bridge-online',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '离线',
            value: 'monitor-device-bridge-offline',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '报警',
            value: 'monitor-device-bridge-warning',
            icon: 'risk-general',
            visible: false,
          }
        ]
      },
      {
        label: '内涝专项',
        value: LayerValue.MonitorDeviceDrainWater,
        icon: 'protect-object',
        legend: [
          {
            label: '在线',
            value: 'monitor-device-drain-water-online',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '离线',
            value: 'monitor-device-drain-water-offline',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '报警',
            value: 'monitor-device-drain-water-warning',
            icon: 'risk-general',
            visible: false,
          }
        ]
      },
      {
        label: '供水专项',
        value: LayerValue.MonitorDeviceWaterSupply,
        icon: 'protect-object',
        legend: [
          {
            label: '在线',
            value: 'monitor-device-water-supply-online',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '离线',
            value: 'monitor-device-water-supply-offline',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '报警',
            value: 'monitor-device-water-supply-warning',
            icon: 'risk-general',
            visible: false,
          }
        ]
      },
      {
        label: '油气长输专项',
        value: LayerValue.MonitorDeviceOilGas,
        icon: 'protect-hospital',
        legend: [
          {
            label: '在线',
            value: 'monitor-device-oil-gas-online',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '离线',
            value: 'monitor-device-oil-gas-offline',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '报警',
            value: 'monitor-device-oil-gas-warning',
            icon: 'risk-general',
            visible: false,
          }
        ]
      },
      {
        label: '危旧房屋专项',
        value: LayerValue.MonitorDeviceHouse,
        icon: 'protect-hospital',
        legend: [
          {
            label: '在线',
            value: 'monitor-device-house-online',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '离线',
            value: 'monitor-device-house-offline',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '报警',
            value: 'monitor-device-house-warning',
            icon: 'risk-general',
            visible: false,
          }
        ]
      },
      {
        label: '第三方施工专项',
        value: LayerValue.MonitorDeviceThirdParty,
        icon: 'protect-hospital',
        legend: [
          {
            label: '在线',
            value: 'monitor-device-third-party-online',
            icon: 'risk-major',
            visible: false,
          },
          {
            label: '离线',
            value: 'monitor-device-third-party-offline',
            icon: 'risk-higher',
            visible: false,
          },
          {
            label: '报警',
            value: 'monitor-device-third-party-warning',
            icon: 'risk-general',
            visible: false,
          }
        ]
      },
    ]
  },
  {
    label: "预警点位",
    value: LayerValue.AlarmPoint,
    icon: 'svg/major-warning.svg',
    legend: [
      {
        label: '重大预警',
        value: 'major-alarm',
        icon: 'risk-major',
        visible: false,
      },
      {
        label: '重要预警',
        value: 'larger-alarm',
        icon: 'risk-higher',
        visible: false,
      },
      {
        label: '一般预警',
        value: 'general-alarm',
        icon: 'risk-general',
        visible: false,
      },
    ]
  }
]

// 图层数据扁平化
const FlatLayerTree: Array<LayerTree> = [...LayerTreeData[0].children, ...LayerTreeData[1].children, LayerTreeData[2], LayerTreeData[3], ...WarningInfoTree[0].children, WarningInfoTree[1]]

// 将图层数据处理为响应式，方便地图实例方法中更改图层信息后视图直接更新
const RefFlatLayerTree = ref(FlatLayerTree)

// 图层与后台接口映射
interface ServerInfo {
  type: string,
  url: string,
  // wms cql_filter
  filter?: string
}

/**
 * 每一个图层的数据与后端接口的映射，涉及到数据类型（矢量/服务）、接口url
 * 数据为wms，wmts等服务时，url为图层名称
 */




/**
 * 获取图层TreeData
 * @param layerName 
 * @returns 
 */
const getTreeDataByName = (layerName: string): Tree | undefined => {
  return RefFlatLayerTree.value.find((layer: Tree) => layerName === layer.value)
}

// 倾斜数据图层，含倾斜摄影和白模
const TilesetLayers: Array<TilesetLayer> = [
  {
    id: uuidv4(),
    label: '苏州市白模',
    value: 'SuZhou-QX-baimo',
    visible: false,
    url: '/TILE_3D_MODEL/baimo/gusu1/tileset.json'
  },
  {
    id: uuidv4(),
    label: '苏州市地形',
    value: 'SuZhou-dem',
    visible: false,
    url: '/COMMON/dem/SZ_dem/'
  },
  {
    id: uuidv4(),
    label: '19.2m²倾斜三维模型',
    value: 'SuZhou-QX-19.2',
    visible: false,
    url: '/TILE_3D_MODEL/QX/gushengQX/1-1/1-1-out/tileset.json'
  },
  {
    id: uuidv4(),
    label: '420m²倾斜三维模型(东方之门-2020)',
    value: 'SuZhou-QX-DFZM-400',
    visible: true,
    url: '/TILE_3D_MODEL/QX/400QX/400_QX_202207/400_QX/DFZM/tileset.json'
  },
  {
    id: uuidv4(),
    label: '420m²倾斜三维模型(古城-2020)',
    value: 'SuZhou-QX-GC-400',
    visible: false,
    url: '/TILE_3D_MODEL/QX/400QX/400_QX_202207/400_QX/19.2_GC/tileset.json'
  },
  {
    id: uuidv4(),
    label: '600m²手工精模(东方之门)',
    value: 'SuZhou-QX-DFZM-600',
    visible: false,
    url: '/TILE_3D_MODEL/fbx/600-fbx/DFZM/tileset.json'
  },
  {
    id: uuidv4(),
    label: '600m²手工精模(古城)',
    value: 'SuZhou-QX-GC-600',
    visible: false,
    url: '/TILE_3D_MODEL/fbx/600-fbx/19.2_GC/tileset.json'
  }
]

// 中国影像图，含电子地图和遥感影像
const GlobalImageryLayers: Array<TianDiTuImageryLayer> = [
  {
    id: uuidv4(),
    label: '天地图遥感',
    value: 'tianditu-img',
    visible: true,
    url: '',
    layer: 'img',
    type: CesiumImageryEnum.Wmts
  },
  
  {
    id: uuidv4(),
    label: '天地图矢量',
    value: 'tianditu-vector',
    visible: false,
    url: '',
    layer: 'vec_w',
    type: CesiumImageryEnum.Wmts
  },
  {
    id: uuidv4(),
    label: '全国深色底图',
    value: 'global-dark',
    visible: false,
    url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
    layer: 'vec_w',
    type: CesiumImageryEnum.Url
  },
]

// 全局标记图层
const GlobalAnnotationImageryLayers: Array<TianDiTuImageryLayer> = [
  {
    id: uuidv4(),
    label: '天地图遥感注记',
    value: 'tianditu-cia',
    visible: false,
    url: '',
    layer: 'cia',
    type: CesiumImageryEnum.Wmts
  },
  {
    id: uuidv4(),
    label: '天地图矢量注记',
    value: 'tianditu-cva',
    visible: false,
    url: '',
    layer: 'cva',
    type: CesiumImageryEnum.Wmts
  },
]

// 苏州影像图，含电子地图和遥感影像
const SZImageryLayers: Array<ImageryLayer> = [
  {
    id: uuidv4(),
    label: '苏州市遥感',
    value: 'SuZhou-yg',
    visible: true,
    url: '/ESRI/server/rest/services/HKIMG/IMAGE2021_20CM/MapServer/',
    type: CesiumImageryEnum.ArcGis
  },
  {
    id: uuidv4(),
    label: '苏州市电子地图',
    value: 'SuZhou-dz',
    visible: false,
    url: '/ESRI/server/rest/services/CGCS2000/SZ2000_W/MapServer/',
    type: CesiumImageryEnum.ArcGis
  },
  {
    id: uuidv4(),
    label: '苏州市深色底图',
    value: 'SuZhou-dark',
    visible: false,
    url: '/ESRI/server/rest/services/XZQH/SZ20000_B/MapServer/',
    type: CesiumImageryEnum.ArcGis
  },
]

export type { ImageryLayer, TianDiTuImageryLayer, TilesetLayer, VectorLayer, LayerTree, ServerInfo }
export { DefaultLoadLayers, LayerTreeData, WarningInfoTree, getTreeDataByName, RefFlatLayerTree, LayerValue, TilesetLayers, GlobalImageryLayers, GlobalAnnotationImageryLayers, SZImageryLayers, CesiumImageryEnum }
