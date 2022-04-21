import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { KML } from 'ol/format'
import DragAndDrop from 'ol/interaction/DragAndDrop'

export default function(map, uploadStyle) {
  let dragAndDropInteraction

  if (dragAndDropInteraction) {
    map.removeInteraction(dragAndDropInteraction)
  }
  dragAndDropInteraction = new DragAndDrop({
    formatConstructors: [
      // extractStyles读取kml中的样式
      new KML({ extractStyles: false })
    ],
  })
  dragAndDropInteraction.on('addfeatures', function (event) {
    const vectorSource = new VectorSource({
      features: event.features,
    })
    map.addLayer(
      new VectorLayer({
        source: vectorSource,
        style: uploadStyle
      })
    )
    map.getView().fit(vectorSource.getExtent())
  })
  map.addInteraction(dragAndDropInteraction)
}
