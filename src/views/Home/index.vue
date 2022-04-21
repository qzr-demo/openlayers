<!--
 * @Date         : 2022-04-19 11:43:52
 * @Description  :
 * @Autor        : Qzr(z5021996@vip.qq.com)
 * @LastEditors  : Qzr(z5021996@vip.qq.com)
 * @LastEditTime : 2022-04-21 10:05:06
-->

<template>
  <div>
    <input type="file"
           multiple
           @input="getKml">
    <div id="map"
         ref="map"
         class="map" />

    <div id="popup"
         class="ol-popup">
      <a id="popup-closer"
         href="#"
         class="ol-popup-closer" />
      <div class="popup-content"
           v-html="popupHtml" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import 'ol/ol.css'
import useDrag from './hooks/useDrag'
import useMap from './hooks/useMap'
import useDrop from './hooks/useDrop'
import useSelect from './hooks/useSelect'
import usePopup from './hooks/usePopup'
import useUpload from './hooks/useUpload'
import useStyle from './hooks/useStyle'


let popupHtml = ref('')
let selected = ref([])
let mapObj
let uploadStyle

onMounted(() => {
  initMap()
})

function initMap() {
  const { map } = useMap()
  const { selectedStyle, defaultStyle } = useStyle()
  uploadStyle = defaultStyle
  mapObj = map
  const { dragBox } = useDrag(map)
  useDrop(map, defaultStyle)
  usePopup(map, popupHtml)
  useSelect(map, dragBox, selectedStyle)
}

function getKml(e) {
  console.log(e.target.files)
  useUpload(mapObj, e.target.files, uploadStyle)
}

</script>

<style scoped lang='scss'>
#map {
  width: 100vw;
  height: 90vh;
}
</style>
