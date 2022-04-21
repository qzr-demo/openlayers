export default function (map, setSelect) {
  map.on('click', e => {
    const { pixel } = e

    const selected = map.getFeaturesAtPixel(pixel)
    if (selected.length === 0) {
      setSelect(null)
      return
    }

    for (const f of selected) {
      setSelect(f)
    }
  })

  return { setSelect }
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
