import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { KML } from 'ol/format'

export default async function(map, files, uploadStyle) {
  const reader = new FileReader()

  for (const file of files) {
    reader.readAsDataURL(file)
    // reader.readAsText(files[0], 'utf-8')
    await onload(reader).then(res => {
      setLayerHandler(res, map, uploadStyle)
    })
  }
}

function setLayerHandler(res, map, uploadStyle) {
  const uploadSource = new VectorSource({
    url: res as any,
    format: new KML({
      // extractStyles读取kml中的样式
      extractStyles: false
    }),
  })

  let kmlLayer = new VectorLayer({
    source: uploadSource,
    style: uploadStyle
  })

  map.addLayer(kmlLayer)

  addFeature(uploadSource).then(() => {
    map.getView().fit(uploadSource.getExtent())
  })
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
