// EventEmitter
import EventEmitter from './EventEmitter'

// map
import OlMap from 'ol/Map'
import View from 'ol/View'
import { Coordinate } from 'ol/coordinate.js'

// layer
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer, Vector, Layer } from 'ol/layer'

// source
import { OSM, Vector as VectorSource, XYZ, TileWMS, Tile as TileSource, TileImage, WMTS, Cluster, Raster } from 'ol/source'
import { optionsFromCapabilities } from 'ol/source/WMTS.js';

// format
import GeoJSON from 'ol/format/GeoJSON'
import WFS from 'ol/format/WFS'
import WMTSCapabilities from "ol/format/WMTSCapabilities";

import { all } from 'ol/loadingstrategy'

// interaction
import { Select, DragBox, Pointer as PointerInteraction, Draw, Interaction } from 'ol/interaction'
import MeasureInteracion from './Tool/MeassureTool'

// style
import { Style, Stroke, Fill, Circle as CircleStyle, Text, Icon } from 'ol/style'
// import StyleMap from './Style'

// keyboard
import { platformModifierKeyOnly } from 'ol/events/condition'

import { Feature, Overlay } from 'ol'

// geometry
import { LineString, Point, Polygon } from 'ol/geom'

// proj4
import Proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { addProjection, Projection, toLonLat } from 'ol/proj.js';

// extent
import * as extent from "ol/extent";

// event
// import { vectorSourceEvent } from 'ol/source/vector'

import WMTSTileGrid from "ol/tilegrid/WMTS";
import TileGrid from 'ol/tilegrid/TileGrid'

import { getVectorFeaturesByLayerName } from '@/request/map'

import { DefaultLoadLayers, getLayerInfo, LayerValues } from '@/map/Layer'

import { getRandomCoord } from "@/utils/index";

import LifeMapEvent from '@/map/Event'

/**
 * @description: 生命线地图实例
 * @return {*}
 */
export default class LifeMap extends EventEmitter {

  // static instance = null;

  map = undefined;

  drawInteraction = null;

  selectInteraction = null;

  meassureInteraction = null;

  // 绘制，测量
  drawSource = new VectorSource();

  drawLayer = new VectorLayer({
    source: this.drawSource
  })


  // 鼠标移动，查询要素
  pointerMoveEvent = (evt) => {
    const targetElement = this.map.getTargetElement();
    targetElement.style.cursor = this.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
  }


  selectedStyle = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 10
    }),
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: 'blue'
      })
    })
  })

  constructor(dom) {
    super();
    this.initMap(dom);
  }

  initMap(dom) {
    // 定义 4490
    Proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
    register(Proj4);

    // 初始化地图
    this.map = new OlMap({
      target: dom,
      view: new View({
        center: [120.622927, 31.425674],
        zoom: 11,
        minZoom: 10,
        maxZoom: 19,
        projection: 'EPSG:4490',
      }),
    })

    // 添加pointerMove
    this.addMapListener(new Map([['pointermove', this.pointerMoveEvent]]));
    // 默认添加 selectInteracion
    this.addSelectInteraction();
    // 业务相关  耦合
    // 临时
    // this.addXYZLayer();
    this.addTianDiTu();
    // this.addCityArea();
    this.addDarkThemeLayer();

    for (const layerName in LayerValues) {
      // TODO: 需提出，考虑注册事件
      if (LayerValues[layerName] === LayerValues.FuelGas) {
        this.addVectorLayer(LayerValues[layerName], true);
      } else {
        this.addVectorLayer(LayerValues[layerName], false);
      }
    }

    // DefaultLoadLayers.forEach((layerName: string) => {
    //   this.addVectorLayer(layerName);
    //   // this.addVectorLayerDemo(layerName);
    // });

    this.addOverlay();
  }

  /**
   * 添加深色底图，注意：需要政务网才能访问
   */
  addDarkThemeLayer() {
    const tileUrl = "/ESRI/server/rest/services/XZQH/SZ20000_B/MapServer/tile/{z}/{y}/{x}?szvsud-license-key=3tTuVLCOwopd8icdS6arvFYL6gsh6RZPfZ1VQ0oHcNbws0BEsqA57FSec4x0p"
    // 坐标原点
    const origin = [-400.0, 400.0];
    // 分辨率
    const resolutions = [
      0.7039144156731805,
      0.35195720784848755,
      0.17597860391234646,
      0.08798930195617323,
      0.04399465098998392,
      0.02199732549499196,
      0.01099866274749598,
      0.00549933137374799,
      0.002749665686873995,
      0.0013748328434369974,
      6.874164098211937E-4,
      3.437082168079019E-4,
      1.7185409650664595E-4,
      8.592704825332297E-5,
      4.296352412666149E-5,
      2.148177396063577E-5,
      1.0740886980317885E-5,
      5.370443490158943E-6,
      2.6852217450794713E-6,
      1.3426108725397357E-6,
    ];

    //地图范围
    const fullExtent = [119.90879661278632, 30.757467108363684, 121.38429479945694, 32.04815248477456];
    const tileGrid = new TileGrid({
      tileSize: 256,
      origin: origin,
      extent: fullExtent,
      resolutions: resolutions
    });
    // 瓦片数据源
    const tileArcGISXYZ = new XYZ({
      tileGrid: tileGrid,
      projection: 'EPSG:4490',
      url: tileUrl,
    });

    const xyzLayer = new TileLayer({
      source: tileArcGISXYZ,
      projection: 'EPSG:4490'
    });
    this.map.addLayer(xyzLayer)
  }

  /**
 * 临时：添加开放 深色底图
 */
  addXYZLayer() {
    // 高德地图
    let gaodeUrl = 'https://webst02.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}';
    // 开放免费 底图
    let darkUrl = 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'

    let tianDiTuUrl = 'http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=8fe55e4c22983bfb64e4e75d4339a6fb'

    const xyzLayer = new TileLayer({
      source: new XYZ({
        attributions: 'wmts',
        // url: gaodeUrl,
        url: tianDiTuUrl,
      }),
      // projection: projection
    });
    this.map.addLayer(xyzLayer)

    let example = document.getElementById("map-container");
    example.style.backgroundColor = 'rgba(255, 0, 0, 1)';
  }


  // openlayers变换天地图颜色
  addTianDiTu() {
    let tianDiTuUrl = 'http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=8fe55e4c22983bfb64e4e75d4339a6fb'
    let tianDiTuTextUrl = 'http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=8fe55e4c22983bfb64e4e75d4339a6fb'
    const xyzLayer = new TileLayer({
      source: new XYZ({
        attributions: 'wmts',
        // url: gaodeUrl,
        url: tianDiTuUrl,
        crossOrigin: 'anonymous'
      }),
      // projection: projection
    });

    //定义颜色转换方法
    let reverseFunc = function (pixelsTemp) {
      //蓝色
      for (var i = 0; i < pixelsTemp.length; i += 4) {
        var r = pixelsTemp[i];
        var g = pixelsTemp[i + 1];
        var b = pixelsTemp[i + 2];
        //运用图像学公式，设置灰度值
        var grey = r * 0.3 + g * 0.59 + b * 0.11;
        //将rgb的值替换为灰度值
        pixelsTemp[i] = grey;
        pixelsTemp[i + 1] = grey;
        pixelsTemp[i + 2] = grey;

        //基于灰色，设置为蓝色，这几个数值是我自己试出来的，可以根据需求调整
        // 差不多的颜色
        // pixelsTemp[i] = 10 - pixelsTemp[i];
        // pixelsTemp[i + 1] = 203 - pixelsTemp[i + 1];
        // pixelsTemp[i + 2] = 230 - pixelsTemp[i + 2];

        pixelsTemp[i] = 10 - pixelsTemp[i];
        pixelsTemp[i + 1] = 243 - pixelsTemp[i + 1];
        pixelsTemp[i + 2] = 270 - pixelsTemp[i + 2];
      }
    };

    //openlayer 像素转换类，可以直接当做source使用
    const raster = new Raster({
      sources: [
        //传入图层，这里是天地图矢量图或者天地图矢量注记
        xyzLayer,
      ],
      //这里设置为image类型，与官方示例不同，优化速度
      operationType: 'image',
      operation: function (pixels, data) {
        //执行颜色转换方法，注意，这里的方法需要使用lib引入进来才可以使用
        reverseFunc(pixels[0].data)
        return pixels[0];
      },
      //线程数量
      threads: 10,
      //允许operation使用外部方法
      lib: {
        reverseFunc: reverseFunc,
      }
    });

    //创建新图层，注意，必须使用 ImageLayer
    let layer = new ImageLayer({
      name: "tianDiTu",
      source: raster
    });
    //添加到地图
    this.map.addLayer(layer)
  }

  // 增加苏州市行政区域
  async addCityArea() {
    const response = await fetch('/suzhou.json')
    const geojson = await response.json();
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojson),
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#66CBFF',
          width: 5,
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
      }),
    });
    this.map.addLayer(vectorLayer);
  }

  /**
   * 根据capabilities加载WMTS
   */
  addWMTSByCapabilities() {
    // WMTS调用
    // http://2.46.13.46:8842/ESRI/server/rest/services/XZQH/SZ20000_B/MapServer/WMTS/1.0.0/WMTSCapabilities.xml?szvsud-license-key=3tTuVLCOwopd8icdS6arvFYL6gsh6RZPfZ1VQ0oHcNbws0BEsqA57FSec4x0p
    // http://2.46.13.46:8842/ESRI/server/rest/services/XZQH/SZ20000_B/MapServer/WMTS?tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=4&TileCol=3&TileRow=5
    // const leaflet = 'http://2.46.13.46:8842/ESRI/server/rest/services/XZQH/SZ20000_B/MapServer/?szvsud-license-key=3tTuVLCOwopd8icdS6arvFYL6gsh6RZPfZ1VQ0oHcNbws0BEsqA57FSec4x0p'
    fetch('/ESRI/server/rest/services/XZQH/SZ20000_B/MapServer/WMTS/1.0.0/WMTSCapabilities.xml?szvsud-license-key=3tTuVLCOwopd8icdS6arvFYL6gsh6RZPfZ1VQ0oHcNbws0BEsqA57FSec4x0p')
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        const parser = new WMTSCapabilities();
        const result = parser.read(text);
        const options = optionsFromCapabilities(result, {
          layer: 'CGCS2000_SZ2022_B',
          projection: 'EPSG:4490',
        });

        console.log('options;;', options);


        const wmtsLayer = new TileLayer({
          source: new WMTS(options),
          opacity: 1
        })

        wmtsLayer.on('change', () => {
          console.log('wmts change');

        })

        this.map.addLayer(wmtsLayer)
      })
  }

  /**
   * 注册地图事件
   * @param eventMap 
   */
  addMapListener(eventMap) {
    for (const [type, callback] of eventMap.entries()) {
      this.map.on(type, callback)
    }
  }

  removeMapListener(eventMap) {
    for (const [type, callback] of eventMap.entries()) {
      this.map.un(type, callback)
    }
  }

  addSelectInteraction() {
    this.clearInteraction();
    // const layers = this.map.getLayers().getArray().filter((layer: any)=> layer instanceof VectorLayer);
    const layers = this.map.getLayers().getArray();

    if (!this.selectInteraction) {
      this.selectInteraction = new Select({
        // style: this.selectedStyle,
        style: null,
        layers: layers
      })
    }
    this.map.addInteraction(this.selectInteraction);

    this.selectInteraction.on('select', (selectEvent) => {
      console.log(selectEvent);

      const selected = selectEvent.selected[0];

      if (selected) {
        // 聚合原因
        const values = selected.getProperties()
        if (values.features && values.features.length > 0) {
          const f = values.features[0]
          const position = f.getGeometry().getCoordinates();
          const properties = f.getProperties();
          this.trigger(LifeMapEvent.Select, properties)
          this.updatePopupOverlay(properties.layerName, position);
        }
      }
    })
  }

  // 框选和点选
  addBoxSelection() {
    this.addSelectInteraction();
    const dragBoxInteracion = new DragBox({
      condition: platformModifierKeyOnly
    });
    this.map.addInteraction(dragBoxInteracion);

    // 框选之前 清空之前选中的要素
    dragBoxInteracion.on('boxstart', () => {
      this.selectInteraction?.getFeatures().clear();
    })

    // 框选查询要素，做选中
    dragBoxInteracion.on('boxend', () => {
      const boxExtent = dragBoxInteracion.getGeometry().getExtent();
      const layers = this.map.getLayers().forEach(layer => {
        if (layer instanceof VectorLayer) {
          const source = layer.getSource();
          const features = source.getFeaturesInExtent(boxExtent);
          const selectedFeatures = this.selectInteraction.getFeatures();
          selectedFeatures.push(...features);
        }
      })

    })
  }

  // 初始化测距和测面
  addMeasureInteracion(type) {
    this.clearInteraction();
    if (!this.meassureInteraction) {
      this.meassureInteraction = new MeasureInteracion();
      this.map.addInteraction(this.meassureInteraction)
    }
    // this.map.removeInteraction(this.drawInteraction);
    this.addDrawInteracion(type);
    this.drawInteraction.on('drawstart', (evt) => {
      this.meassureInteraction.meassureStart(evt);
    });

    this.drawInteraction.on('drawend', () => {
      this.meassureInteraction.meassureEnd();
    });
  }

  addDrawInteracion(type) {
    this.drawInteraction = new Draw({
      source: this.drawSource,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
        }),
      }),
    });
    this.map.addInteraction(this.drawInteraction);
  }

  clearInteraction() {
    this.map.removeInteraction(this.drawInteraction);
    this.map.removeInteraction(this.meassureInteraction);
    this.map.removeInteraction(this.selectInteraction);
    this.removeMapListener([['pointermove', this.pointerMoveEvent]])
  }

  // 添加图层
  async addWfsLayer(layerName) {
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: `/geoserver/bigdata/wfs?service=wfs
                &version=1.1
                &request=GetFeature
                &typeNames=bigdata:${layerName}
                &outputFormat=application/json`
      ,
      strategy: all
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      // style: stationStyle,
      style: StyleMap.get('bridge'),
      properties: {
        name: layerName
      }
    })
    this.map.addLayer(vectorLayer);
  }

  /**
   * 根据图层名称加载矢量图层
   */
  async addVectorLayer(layerName: string, visible?: boolean = true) {
    const geoJson = await getVectorFeaturesByLayerName(layerName);
    const features = new GeoJSON().readFeatures(geoJson)

    // 注意：数据原因，聚合功能必须要坐标类型为number，字符串类型会失败
    // const filter = features.filter((f) => {
    //   const coords = f.getGeometry().getCoordinates();
    //   if (coords[0] < 160) {
    //     f.getGeometry().setCoordinates(coords)
    //     return true;
    //   }
    //   return false;
    // })


    // 要素存储所属图层
    features.forEach(f => {
      const properties = f.getProperties();
      properties.layerName = layerName;
      f.setProperties(properties)
    });

    const vectorSource = new VectorSource({
      features: features,
    })

    const clusterSource = new Cluster({
      distance: 20,
      minDistance: 20,
      source: vectorSource,
    });

    const vectorLayer = new VectorLayer({
      visible,
      source: clusterSource,
      style: StyleMap.get(layerName),
      properties: {
        name: layerName
      }
    });

    //   // console.log(vectorSourceEvent);

    //   vectorSource.on('featuresLoadEnd', ()=>{
    //     console.log(featuresLoadEnd);

    //   })

    //   vectorSource.once('change',function(e){
    //     console.log('change:::');

    //     if (vectorSource.getState() === 'ready') {
    //       console.log('change:::', vectorSource.getState());
    //     }
    // });

    this.map.addLayer(vectorLayer);
  }

  // mock数据
  addVectorLayerDemo(layerName: string) {
    const features = [];

    let count = 5;
    if (layerName === 'fuel_gas') {
      count = 50
    }

    for (let i = 0; i < count; i++) {
      const coord = getRandomCoord()
      const f = new Feature({
        geometry: new Point(coord),
        layerName: layerName
      })
      features.push(f);
    }

    // 初始化动态数据
    const [layerInfo] = getLayerInfo(layerName);
    if (layerInfo) {
      layerInfo.featureCount = features.length
    }


    const vectorSource = new VectorSource({
      features: features,
    })

    const clusterSource = new Cluster({
      distance: 120,
      minDistance: 20,
      source: vectorSource,
    });

    const vectorLayer = new VectorLayer({
      source: clusterSource,
      style: StyleMap.get(layerName),
      properties: {
        name: layerName
      }
    });
    this.map.addLayer(vectorLayer);
  }

  // 获取图层要素数量
  getFeaturesByLayerName(layerName: string) {
    const layer = this.map.getAllLayers().find((layer: any) => {
      const properties = layer.getProperties();
      if (properties && properties.layerName === layerName) {
        return true;
      } else {
        return false;
      }
    })

    return layer.getSource().getFeatures().length;
  }


  /**
   * 根据图层初始化overlay
   * @param layerName 
   */
  addOverlay() {
    const container = document.getElementById('popup')
    const overlay = new Overlay({
      id: 'popup',
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    })
    this.map.addOverlay(overlay)
  }

  // 根据 layerName 关闭 overlay 
  closePopover() {
    const overlay = this.map.getOverlayById('popup');
    if (overlay) {
      overlay.setPosition(undefined);
    }
  }

  // 改变overlay位置
  updatePopupOverlay(layerName, position) {
    const overlay = this.map.getOverlayById('popup');
    overlay?.setPosition(position);
  }


  /**
   * @description: 图层显示隐藏
   * @return {*}
   * @param {string} layerName
   * @param {boolean} visible
   */
  toggleLayerVisible(layerName: string, visible: boolean) {
    if (!layerName) return;
    const layers = this.map.getLayers().getArray();
    const layer = layers.find((layer: any) => {
      const properties = layer.getProperties();
      return properties?.name === layerName
    })
    layer?.setVisible(visible);
  }


  loadVectorFeatures() {

  }

  // 初始化地铁线
  async addSubwayLine(subwayName) {
    const url = `/geoserver/lifeline/wfs?service=wfs&version=1.1&request=GetFeature&typeNames=lifeline:subway_6&outputFormat=application/json`

    const featureRequest = new WFS().writeGetFeature({
      srsName: 'EPSG:4326',
      featureNS: '/geoserver/lifeline',
      featurePrefix: 'lifeline',
      featureTypes: ['subway_6'],
      outputFormat: 'application/json'
    });

    const response = await fetch(url, {
      method: 'POST',
      body: new XMLSerializer().serializeToString(featureRequest)
    })
    const json = await response.json()
    const features = new GeoJSON().readFeatures(json);

    const vectorSource = new VectorSource({
      features: features
    });


    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          src: '/bridge.svg',
          scale: 0.5
          // size: 10
          // crossOrigin: true,
        })
      }),
      properties: {
        name: subwayName
      }
    })
    this.map.addLayer(vectorLayer);
  }

  updatViewportSize() {
    this.map.updateSize();
  }
}




