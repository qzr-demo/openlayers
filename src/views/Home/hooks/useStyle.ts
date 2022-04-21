import { Fill, Stroke, Style } from 'ol/style'

export default function() {
  const selectedStyle = new Style({
    // 填充样式
    fill: new Fill({
      color: '#4e98f444'
    }),
    // 边框样式
    stroke: new Stroke({
      color: '#fff',
      width: 1
    })
  })

  const defaultStyle = new Style({
    // 填充样式
    fill: new Fill({
      color: '#fff9'
    }),
    // 边框样式
    stroke: new Stroke({
      color: '#fff',
      width: 1
    })
  })

  return { selectedStyle, defaultStyle }
}
