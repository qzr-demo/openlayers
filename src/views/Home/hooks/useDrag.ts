import { DragBox } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'

import Draw, {
  createBox,
  createRegularPolygon,
} from 'ol/interaction/Draw'

export default function(map) {
  const dragBox = ctrlDraw(map)
  // clickDraw(map)

  return { dragBox }
}

/**
 * ctrl按住画框
 */
function ctrlDraw(map) {
  const dragBox = new DragBox({
    // ctrl修饰符
    condition: platformModifierKeyOnly,
  })

  map.addInteraction(dragBox)

  return dragBox
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
