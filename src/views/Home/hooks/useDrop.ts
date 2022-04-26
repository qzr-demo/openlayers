import { KML } from 'ol/format'
import DragAndDrop from 'ol/interaction/DragAndDrop'
import useRead from './useRead'

export default function(map, kmlInfo, allFeature) {
  const Kml = new KML({
    // extractStyles读取kml中的样式
    extractStyles: false
  })

  let inter

  if (inter) {
    map.removeInteraction(inter)
  }

  inter = new DragAndDrop({
    formatConstructors: [
      Kml
    ],
  })

  map.addInteraction(inter)

  inter.on('addfeatures', e => {
    const { file, features } = e
    console.log(file, features)
    useRead(file, map, kmlInfo, allFeature)
  })
}
