// map
import OlMap from 'ol/Map'
import View from 'ol/View'

// layer
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
// import ImageWMS from 'ol/source/ImageWMS'

// import ImageLayer from 'ol/layer/Image'

// source
import { OSM, Vector as VectorSource, XYZ, TileWMS } from 'ol/source'

// format
import GeoJson from 'ol/format/GeoJSON'
import WFS from 'ol/format/WFS'

// interacion
import { Select, DragBox, Pointer as PointerInteracion, Draw, Interaction } from 'ol/interaction'

// style
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style'

// keyboard
import { platformModifierKeyOnly } from 'ol/events/condition'

import { Overlay } from 'ol'

// geometry
import { LineString, Polygon } from 'ol/geom'

import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';



export default class MeasureInteracion extends PointerInteracion {
    constructor() {
        super()
    }

    // 测量类型：'LineString' || 'Polygon'
    type = 'LineString'

    // 绘图产生的要素
    sketch;

    // 绘图提示dom元素
    helpTooltipElement;

    // 提示工具 overlay
    helpTooltip;

    // 测量提示dom
    measureTooltipElement;

    // 测量工具overlay
    measureTooltip;

    // 绘制Polygon过程中提示信息变化
    continuePolygonMsg = 'Click to continue drawing the polygon';

    // 绘制LineString过程中提示信息变化
    continueLineMsg = 'Click to continue drawing the line';

    listener = null;

    map = null;

    // 鼠标移动事件
    pointerMoveHandler = (evt) => {
        if (evt.dragging) {
            return;
        }
        let helpMsg = 'Click to start drawing';

        if (this.sketch) {
            const geom = this.sketch.getGeometry();
            if (geom instanceof Polygon) {
                helpMsg = this.continuePolygonMsg;
            } else if (geom instanceof LineString) {
                helpMsg = this.continueLineMsg;
            }
        }

        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);

        this.helpTooltipElement.classList.remove('hidden');
    };

    setMap(map){
        if (map) {
            this.map = map;
            this.createMeasureTooltip();
            this.createHelpTooltip();
            map.on(this.pointerMoveHandler);
            this.map.getViewport().addEventListener('mouseout', () => {
                this.helpTooltipElement.classList.add('hidden');
            });
        }else {
            console.log('removeMeassureInteracion');
        }
    }

    meassureStart(evt){
        // set sketch
        this.sketch = evt.feature;

        let tooltipCoord = evt.coordinate;

        this.listener = this.sketch.getGeometry().on('change', (evt) => {
            const geom = evt.target;
            let output;
            if (geom instanceof Polygon) {
                output = this.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
                output = this.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            this.measureTooltipElement.innerHTML = output;
            this.measureTooltip.setPosition(tooltipCoord);
        });
    }

    meassureEnd(){
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        this.measureTooltip.setOffset([0, -7]);
        // unset sketch
        this.sketch = null;
        // unset tooltip so that a new one can be created
        this.measureTooltipElement = null;
        this.createMeasureTooltip();
        unByKey(this.listener);
    }

    // handleDownEvent(evt) {
    //     console.log('handleDownEvent')
    // }

    handleDragEvent() {

    }

    handleMoveEvent() {

    }

    // handleUpEvent() {
    //
    // }

    formatLength(line) {
        const length = getLength(line, {
            projection: 'EPSG:4326'
        });
        let output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    };


    formatArea(polygon) {
        const area = getArea(polygon, {
            projection: 'EPSG:4326'
        });
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    createHelpTooltip() {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'ol-tooltip hidden';
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        this.map.addOverlay(this.helpTooltip);
    }

    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip() {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        this.map.addOverlay(this.measureTooltip);
    }
}