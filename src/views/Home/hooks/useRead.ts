import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { KML } from 'ol/format'

export default function(file, map, uploadStyle, kmlInfo) {
  const reader = new FileReader()
  reader.readAsText(file)

  onload(reader).then(res => {
    setLayerHandler(res)
  })

  function setLayerHandler(res) {
    const Kml = new KML({
      // extractStyles读取kml中的样式
      extractStyles: false
    })

    const features = Kml.readFeatures(res, {     // 用readFeatures方法可以自定义坐标系
      dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
      featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
    })

    const name = Kml.readName(res)

    const featuresArr = features.map((item:any) => {
      return {
        data: {
          name: item.values_.name,
          extend: item.values_.geometry.extent_
        },
        label: item.values_.name
      }
    })

    kmlInfo.value.push({
      data: {},
      label: name,
      children: featuresArr
    })

    const uploadSource = new VectorSource({
      features: features,
    })


    let kmlLayer = new VectorLayer({
      source: uploadSource,
      style: uploadStyle
    })

    map.addLayer(kmlLayer)
    map.getView().fit(uploadSource.getExtent())

    // addFeature(uploadSource).then(() => {
    //   map.getView().fit(uploadSource.getExtent())
    // })
  }
}



function onload(reader) {
  return new Promise((resolve, reject) => {
    reader.onload = (res) => {
      resolve(res.target.result)
    }
  })
}

function addFeature(source) {
  return new Promise((resolve, reject) => {
    source.on('addfeature', function (event) {
      resolve(event)
    })
  })
}
