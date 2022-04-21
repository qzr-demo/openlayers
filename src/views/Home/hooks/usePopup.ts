import { fromLonLat, transform, toLonLat } from 'ol/proj'
import { toStringHDMS } from 'ol/coordinate'
import Overlay from 'ol/Overlay'

export default function(map, popupHtml) {
  let overlay = new Overlay({
    element: document.querySelector('#popup') as any, // 绑定 Overlay 对象和 DOM 对象的
    autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
    autoPanAnimation: {
      duration: 250 // 自动平移效果的动画时间 9毫秒
    }
  })
  // 将弹窗添加到 map 地图中
  // map.addOverlay(overlay)

  map.on('click', (e) => {
    console.log(e)
    let pixel = map.getEventPixel(e.originalEvent)

    let coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
    // 点击尺 （这里是尺(米)，并不是经纬度）;
    let hdms = toStringHDMS(toLonLat(e.coordinate)) // 转换为经纬度显示
    popupHtml.value = `
    <p>你点击了这里：</p>
    <p>经纬度：<p><code> ${hdms}  </code> <p>
    <p>坐标：</p>X：${coordinate[0]} &nbsp;&nbsp; Y: ${coordinate[1]}`

    overlay.setPosition(e.coordinate) // 把 overlay 显示到指定的 x,y坐标
  })
}
