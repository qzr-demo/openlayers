import { DragBox } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'

import Draw, {
  createBox,
  createRegularPolygon,
} from 'ol/interaction/Draw'

export default function(map, setSelect) {
  ctrlDraw(map, setSelect)
  // clickDraw(map)

}

/**
 * ctrl按住画框
 */
function ctrlDraw(map, setSelect) {
  const dragBox = new DragBox({
    // ctrl修饰符
    condition: platformModifierKeyOnly,
  })

  map.addInteraction(dragBox)


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
        for (const f of inExtentFeatures) {
          setSelect(f)
        }
      }
    }
  })
}

/**
 * 先单击再画框
 */
function clickDraw(map) {
  const draw = new Draw({
    type: 'Circle',
    geometryFunction: createBox(),
  })

  map.addInteraction(draw)
}
