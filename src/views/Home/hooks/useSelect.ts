import { Select } from 'ol/interaction'

import { click } from 'ol/events/condition'


export default function (map, dragBox, selectedStyle) {
  // a normal select interaction to handle click
  const select = new Select({
    condition: click,
    multi: true,
    style: selectedStyle,
    filter: (feature, layer) => {
      console.log(feature, layer)
      return true
    },
  })

  const selectedFeatures = select.getFeatures()

  select.on('select', function (e) {
    // console.log(e.target, e, e.target.getFeatures())
  })


  map.addInteraction(select)


  dragBox.on('boxend', function () {
    // 获取多边形的外接矩形范围
    const extent = dragBox.getGeometry().getExtent()
    const layers = map.getAllLayers()
    console.log(layers, extent)
    for (const layer of layers) {
      let layerSource = layer.getSource()
      if (layerSource.getFeaturesInExtent) {
        // debugger
        const inExtentFeatures = layerSource.getFeaturesInExtent(extent)
          .filter((feature) => feature.getGeometry().intersectsExtent(extent))
        selectedFeatures.extend(inExtentFeatures)
        console.log(inExtentFeatures, layerSource)
      }


    }

    console.log(selectedFeatures)
  })

  // clear selection when drawing a new box and when clicking on the map
  dragBox.on('boxstart', function () {
    selectedFeatures.clear()
  })
}


/**
 * 使用每个feature的方法判断相交
 */
function intersectsExtent(layerSource, selectedFeatures, extent) {
  if (layerSource.forEachFeature) {
    layerSource.forEachFeature(item => {

      if (item.getGeometry().intersectsExtent(extent)) {
        selectedFeatures.push(item)
      }
      item.getGeometry().getExtent()
    })
  }
}
