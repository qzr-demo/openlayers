export default function({ selected, defaultStyle, selectedStyle }) {
  function setSelect(f) {
    if (f === null) {
      for (const item of selected.value) {
        item.setStyle(defaultStyle)
      }
      selected.value.length = 0
      return
    }
    const selIndex = selected.value.indexOf(f)
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
