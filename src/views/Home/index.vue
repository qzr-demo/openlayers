<!--
 * @Date         : 2022-04-19 11:43:52
 * @Description  :
 * @Autor        : Qzr(z5021996@vip.qq.com)
 * @LastEditors  : Qzr(z5021996@vip.qq.com)
 * @LastEditTime : 2022-04-24 12:00:14
-->

<template>
  <div>
    <input type="file"
           multiple
           @input="getKml">

    <el-button type="primary"
               @click="showSelectTask = true">选中任务</el-button>

    <el-button type="primary"
               @click="showAutoTask = true">生成任务</el-button>

    <el-button type="primary"
               @click="showTask = true">任务列表</el-button>

    <el-dialog
      v-model="showSelectTask"
      title="选中任务"
      width="30%">
      <el-form :model="selectTaskFrom"
               label-width="120px">
        <el-form-item label="任务编号">
          <div>Das123</div>
        </el-form-item>

        <el-form-item label="任务名">
          <el-input v-model="selectTaskFrom.name" />
        </el-form-item>

        <el-form-item label="操作员">
          <el-select v-model="selectTaskFrom.operation">
            <el-option label="11"
                       value="11" />
            <el-option label="22"
                       value="22" />
          </el-select>
        </el-form-item>

        <el-form-item label="质检员">
          <el-select v-model="selectTaskFrom.test">
            <el-option label="11"
                       value="11" />
            <el-option label="22"
                       value="22" />
          </el-select>
        </el-form-item>

        <el-form-item label="任务节点">
          <el-date-picker
            v-model="selectTaskFrom.date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%" />
        </el-form-item>

        <el-form-item label="任务信息">
          <div v-for="(item, index) in selected"
               :key="index"
               style="border: 1px solid #999;">
            <div>name: {{ item.values_.name }}</div>
            <div>id: {{ item.ol_uid }}</div>
            <div>extend: {{ item.values_.geometry.extent_ }}</div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSelectTask = false">Cancel</el-button>
          <el-button type="primary"
                     @click="createTask">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="showAutoTask"
               append-to-body
               modal
               close-on-click-modal
               title="生成任务"
               width="40%"
               @open="checkTree">
      <el-form :model="autoTaskFrom"
               label-width="120px">
        <el-form-item label="任务编号">
          <div>Das123</div>
        </el-form-item>

        <el-form-item label="任务名">
          <el-input v-model="autoTaskFrom.name" />
        </el-form-item>

        <el-form-item label="操作员">
          <el-select v-model="autoTaskFrom.operation">
            <el-option label="11"
                       value="11" />
            <el-option label="22"
                       value="22" />
          </el-select>
        </el-form-item>

        <el-form-item label="质检员">
          <el-select v-model="autoTaskFrom.test">
            <el-option label="11"
                       value="11" />
            <el-option label="22"
                       value="22" />
          </el-select>
        </el-form-item>

        <el-form-item label="任务节点">
          <el-date-picker
            v-model="autoTaskFrom.date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%" />
        </el-form-item>

        <el-form-item label="任务信息">
          <el-tree ref="kmlTreeRef"
                   node-key="id"
                   :data="kmlInfo"
                   :props="{
                     label: 'label',
                     children: 'children',
                     isLeaf: 'isLeaf',
                     disabled: 'disabled'
                   }"
                   show-checkbox
                   :render-after-expand="false"
                   :height="208"
                   style="width: 100%"
                   @check-change="autoTreeChange" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAutoTask = false">取消</el-button>
          <el-button type="primary"
                     @click="createAutoTask">生成</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer
      v-model="showTask"
      title="任务列表"
      direction="rtl">
      <el-card v-for="(item, index) in task"
               :key="index">
        <template #header>
          <div class="task-header">
            <span>{{ item.name }}</span>
            <el-icon size="18px"
                     color="red"
                     class="icon-cancel"
                     @click="cancelTask(item)">
              <close />
            </el-icon>
          </div>
        </template>
        <div>操作员：{{ item.operation }}</div>
        <div>质检员：{{ item.test }}</div>
        <div>截止时间：{{ item.date }}</div>
        <div v-for="(it, idx) in item.features"
             :key="idx"
             style="border: 1px solid #999;">
          <div>name: {{ it.values_.name }}</div>
          <div>id: {{ it.ol_uid }}</div>
          <div>extend: {{ it.values_.geometry.extent_ }}</div>
        </div>
      </el-card>
    </el-drawer>

    <div id="map" />

  </div>
</template>

<script lang='ts' setup>
import { Close } from '@element-plus/icons-vue'
import type { ElTree } from 'element-plus'
import _ from 'lodash'

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
let allFeature = ref<any>([])
let task = ref<any>([])
let inTask = ref<any>([])
let autoTaskChecked = ref<any>([])

const kmlTreeRef = ref<InstanceType<typeof ElTree>>()
const test = ref()

let showSelectTask = ref(false)
let selectTaskFrom = reactive<any>({
  name: '',
  operation: '11',
  test: '22',
  date: '',
})

let showAutoTask = ref(false)
let autoTaskFrom = reactive<any>({
  name: '',
  operation: '11',
  test: '22',
  date: '',
})

let showTask = ref(false)

let mapObj

onMounted(() => {
  initMap()
})

const { confirmStyle, defaultStyle } = useStyle()
const { setSelect } = useUtils({ selected, inTask })

function initMap() {
  const { map } = useMap()
  mapObj = map
  useDrop(map, kmlInfo, allFeature)
  usePopup(map)
  useSelect(map, setSelect)
  useDrag(map, setSelect)
}

function getKml(e) {
  const files = e.target.files

  for (const file of files) {
    useRead(file, mapObj, kmlInfo, allFeature)
  }
}

function createTask() {
  const taskSelected = toRaw(selected.value)
  addTask(taskSelected, autoTaskFrom)

  selected.value.length = 0
  showSelectTask.value = false
}

function createAutoTask() {
  const taskSelected = autoTaskChecked.value.map(item => item.self)
  addTask(taskSelected, autoTaskFrom)

  for (const item of autoTaskChecked.value) {
    if (item.isLeaf) {
      item.disabled = true
    }
  }

  autoTaskChecked.value.length = 0
  showAutoTask.value = false
}

function autoTreeChange(data, checked) {
  if (!data.isLeaf) return

  if (checked) {
    autoTaskChecked.value.push(data)
  } else {
    const index = autoTaskChecked.value.indexOf(data)
    autoTaskChecked.value.splice(index, 1)
  }
  console.log(data, checked)
}

function setFeaturesColor(features, style) {
  for (const f of features) {
    const id = f.ol_uid
    const target = allFeature.value.find(item => item.ol_uid === id)

    target.setStyle(style)
  }
}


function checkTree() {
  nextTick(() => {
    const checked = kmlTreeRef.value!.getCheckedNodes()
    for (const item of checked) {
      if (item.disabled) {
        const index = inTask.value.findIndex(f => f.ol_uid === item.self.ol_uid)
        if (index !== -1) {
          kmlTreeRef.value?.setChecked(item.id, false, true)
        }
      }
    }
  })
}

function addTask(features, form) {
  setFeaturesColor(features, confirmStyle)

  task.value.push({
    id: new Date().getTime(),
    name: form.name,
    operation: form.operation,
    test: form.test,
    date: form.date,
    features: [...features]
  })

  inTask.value.push(...features)
}

function cancelTask(taskItem) {
  const features = taskItem.features
  const index = task.value.findIndex(item => item.id === taskItem.id)
  task.value.splice(index, 1)

  // TODO: 删除inTask里面的features
  inTask.value = inTask.value.filter(item => {
    return features.find(it => {
      it.setStyle(defaultStyle)
      return it.id !== item.id
    })
  })
}

</script>

<style scoped lang='scss'>
#map {
  width: 100vw;
  height: 90vh;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon-cancel {
    cursor: pointer;
  }
}
</style>
