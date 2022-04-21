<!--
 * @Date         : 2022-04-19 11:43:52
 * @Description  :
 * @Autor        : Qzr(z5021996@vip.qq.com)
 * @LastEditors  : Qzr(z5021996@vip.qq.com)
 * @LastEditTime : 2022-04-21 15:12:29
-->

<template>
  <div>
    <input type="file"
           multiple
           @input="getKml">

    <el-button type="primary"
               @click="createTask">创建选中任务</el-button>

    <el-button type="primary"
               @click="createAutoTask">自动创建任务</el-button>

    <el-button type="primary"
               @click="showTask = true">任务列表</el-button>

    <el-dialog
      v-model="showSelectTask"
      title="Tips"
      width="30%">
      <el-form :model="selectTaskFrom"
               label-width="120px">
        <el-form-item label="任务编号">
          <div>Das123</div>
        </el-form-item>
        <el-form-item label="任务名">
          <el-input />
        </el-form-item>
        <el-form-item label="任务信息">
          <div v-for="(item, index) in selected"
               :key="index"
               style="border: 1px solid #999;">
            <div>name: {{ item.values_.name }}</div>
            <div>extend: {{ item.values_.geometry.extent_ }}</div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSelectTask = false">Cancel</el-button>
          <el-button type="primary"
                     @click="showSelectTask = false">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showAutoTask"
      title="Tips"
      width="40%">
      <el-form :model="autoTaskFrom"
               label-width="120px">
        <el-form-item label="任务编号">
          <div>Das123</div>
        </el-form-item>
        <el-form-item label="任务名">
          <el-input />
        </el-form-item>
        <el-form-item label="任务信息">
          <el-tree-v2 :data="kmlInfo"
                      :props="{
                        value: 'data',
                        label: 'label',
                        children: 'children',
                      }"
                      show-checkbox
                      :height="208"
                      style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAutoTask = false">Cancel</el-button>
          <el-button type="primary"
                     @click="showAutoTask = false">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer
      v-model="showTask"
      title="任务列表"
      direction="rtl">
      <span>Hi, there!</span>
    </el-drawer>

    <div id="map" />

  </div>
</template>

<script lang='ts' setup>
import 'ol/ol.css'
import useDrag from './hooks/useDrag'
import useMap from './hooks/useMap'
import useDrop from './hooks/useDrop'
import useSelect from './hooks/useSelect'
import usePopup from './hooks/usePopup'
import useStyle from './hooks/useStyle'
import useUtils from './hooks/useUtils'
import useRead from './hooks/useRead'


let selected = ref<any[]>([])
let kmlInfo = ref<any>([])

let showSelectTask = ref(false)
let selectTaskFrom = reactive<any>({})

let showAutoTask = ref(false)
let autoTaskFrom = reactive<any>({})

let showTask = ref(false)

let mapObj
let uploadStyle

onMounted(() => {
  initMap()
})

function initMap() {
  const { map } = useMap()
  const { selectedStyle, defaultStyle } = useStyle()
  const { setSelect } = useUtils({ selected, defaultStyle, selectedStyle })
  uploadStyle = defaultStyle
  mapObj = map
  useDrop(map, defaultStyle, kmlInfo)
  usePopup(map)
  useSelect(map, setSelect)
  useDrag(map, setSelect)
}

function getKml(e) {
  console.log(e)
  const files = e.target.files

  for (const file of files) {
    useRead(file, mapObj, uploadStyle, kmlInfo)
  }
}

function createTask() {
  showSelectTask.value = true
  console.log(selected.value)
}

function createAutoTask() {
  showAutoTask.value = true
  console.log(kmlInfo.value)
}

</script>

<style scoped lang='scss'>
#map {
  width: 100vw;
  height: 90vh;
}
</style>
