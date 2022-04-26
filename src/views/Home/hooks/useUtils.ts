import useStyle from './useStyle'

export default function({ selected, inTask }) {
  const { selectedStyle, defaultStyle } = useStyle()

  function setSelect(f) {
    if (f === null) {
      for (const item of selected.value) {
        item.setStyle(defaultStyle)
      }
      selected.value.length = 0
      return
    }
    const selIndex = selected.value.indexOf(f)
    const inTaskIndex = inTask.value.findIndex(item => item.ol_uid === f.ol_uid)

    if (inTaskIndex !== -1) return

    if (selIndex < 0) {
      selected.value.push(f)
      f.setStyle(selectedStyle)
    } else {
      selected.value.splice(selIndex, 1)
      f.setStyle(defaultStyle)
    }
  }

  return { setSelect }
}
