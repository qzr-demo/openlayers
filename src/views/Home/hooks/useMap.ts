import { Map, View } from 'ol'
import { XYZ, Vector as VectorSource, TileDebug } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { defaults, FullScreen, MousePosition, ScaleLine } from 'ol/control'

export default function() {
  // 使用高德
  const tileLayer = new TileLayer({
    source: new XYZ({
      url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    })
  })

  // 显示每片瓦块的xyz信息 加入到layers生效
  const tileBug = new TileLayer({
    source: new TileDebug(),
  })

  const map = new Map({
    layers: [tileLayer],
    view: new View({
      center: fromLonLat([120.771441, 30.756433]), // 地图中心点
      zoom: 15, // 缩放级别
      minZoom: 0, // 最小缩放级别
      maxZoom: 18, // 最大缩放级别
      constrainResolution: true // 因为存在非整数的缩放级别，所以设置该参数为true来让每次缩放结束后自动缩放到距离最近的一个整数级别，这个必须要设置，当缩放在非整数级别时地图会糊
    }),
    controls: defaults().extend([
      new FullScreen(), // 全屏
      // new MousePosition(), // 显示鼠标当前位置的经纬度
      new ScaleLine()// 显示比例尺
    ]),
    target: 'map'// DOM容器
  })

  return { map }
}
