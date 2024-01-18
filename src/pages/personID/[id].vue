<script setup lang="ts">
import { useRequest, useWatcher } from 'alova'
import { computed, watchEffect } from 'vue'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'
import {
  LegendComponent,
  TimelineComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { getPersonData, getPersonImageData, getPersonIndex, getPersonText } from '~/api/methods/person'
import chartData from '~/data/subject_career.json'

use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  TimelineComponent,
])

provide(THEME_KEY, isDark ? 'light' : 'night')

const params = useRoute('/personID/[id]').params
const UserInfo = ref({
  id: '',
  fid: '',
  title: '',
  career: [''],
})
const nameMap = new Map<string, number>()
const nameMapReverse = new Map<number, string>()

const chartOption1: any = ref({})
const chartOption2: any = ref({})

const { onSuccess } = useRequest(getPersonIndex, { initialData: { namemap: {}, person: [] } })
const {
  data: textData,
  loading: textLoading,
} = useWatcher(
  // 必须设置为返回method实例的函数
  () => getPersonText(UserInfo.value.fid),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [UserInfo],
  {
    // 手动设置immediate为true可以初始获取第1页数据
    immediate: false,
    initialData: { 1: 'hello' },
  },
)

const {
  data: personData,
  loading: dataloading,
} = useWatcher(
  // 必须设置为返回method实例的函数
  () => getPersonData(UserInfo.value.fid),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [UserInfo],
  {
    // 手动设置immediate为true可以初始获取第1页数据
    immediate: false,
    initialData: { 1: 'hello' },
  },
)

const {
  data: imageData,
  loading: imageloading,
} = useWatcher(
  // 必须设置为返回method实例的函数
  () => getPersonImageData(UserInfo.value.fid),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [UserInfo],
  {
    // 手动设置immediate为true可以初始获取第1页数据
    immediate: false,
    initialData: { 1: 'hello' },
  },
)

const personImage = computed(() => {
  return (imageData as any).value[Number(UserInfo.value.id)]
})

const yearStart = 2007
const yearEnd = 2023
const yearRange: number[] = []
for (let start = yearStart; start <= yearEnd; start++)
  yearRange.push(start)

const radarChartOptionBaby = {
  title: {
    text: '意外的chart',
  },
  legend: {
    orient: 'vertical',
    align: 'left',
    right: 20,
    top: 'middle',
    data: [],
  },
  tooltip: {
    trigger: 'item',
  },
  radar: {
    axisName: {
      color: '#fff',
      backgroundColor: '#666',
      borderRadius: 3,
      padding: [3, 5],
    },
  },
  timeline: {
    data: yearRange,
    currentIndex: 16,
    // orient: 'vertical',
    axisType: 'category',
  },
  options: [],
}

watchEffect(() => {
  // 职业 id 0-5, 艺术id 6-11
  const dataObject = (personData as any).value[Number(UserInfo.value.id)]
  // const careerIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const careerIndex = chartData.career_ids

  if (!dataObject)
    return
  const careerName: any = []
  for (const project_id of careerIndex)
    careerName.push(nameMapReverse.get(project_id))

  const optionBaby = JSON.parse(JSON.stringify(radarChartOptionBaby))
  optionBaby.title.text = `${UserInfo.value.title} 到各个职业群体的距离`
  // optionBaby.legend.data = chartData.career_name
  optionBaby.radar.indicator = careerName.map((item: any) => {
    return {
      name: item,
      // max: 0.8,
      // min: 0.4,
    }
  })

  for (let start = yearStart; start <= yearEnd; start++) {
    const resultCache: any = []
    const yearIndex = start - yearStart
    for (const careerI of careerIndex)
      resultCache.push(dataObject[careerI][yearIndex])

    const seriesOption = {
      name: '距离图',
      type: 'radar',
      data: [{
        value: resultCache,
        name: UserInfo.value.title,
      }],
    }
    optionBaby.options.push({ title: { text: `${UserInfo.value.title} 到各个职业群体的距离:${start} 年` }, series: seriesOption })
  }
  chartOption1.value = optionBaby
  // subject
  // const subjectIndex = [12, 13, 14, 15, 16, 17]
  const subjectIndex = chartData.subject_ids

  const subjectName: any = []
  for (const project_id of subjectIndex)
    subjectName.push(nameMapReverse.get(project_id))
  const optionBaby2 = JSON.parse(JSON.stringify(radarChartOptionBaby))
  optionBaby2.title.text = `${UserInfo.value.title} 到各个艺术的距离`
  // optionBaby2.legend.data = chartData.subject_name
  optionBaby2.radar.indicator = subjectName.map((item: any) => {
    return {
      name: item,
    }
  })

  for (let start = yearStart; start <= yearEnd; start++) {
    const resultCache: any = []
    const yearIndex = start - yearStart
    for (const subjectI of subjectIndex) {
      // 没有距离的置 0
      resultCache.push(dataObject[subjectI]?.[yearIndex] ?? 0)
    }

    const seriesOption = {
      name: '距离图',
      type: 'radar',
      data: [{
        value: resultCache,
        name: UserInfo.value.title,
      }],
    }
    optionBaby2.options.push({ title: { text: `${UserInfo.value.title} 到各个艺术的距离:${start} 年` }, series: seriesOption })
  }
  chartOption2.value = optionBaby2
})

const firstParagraph = computed({
  get() {
    if ((textData as any).value[Number(UserInfo.value.id)]?.length > 0)
      return (textData as any).value[Number(UserInfo.value.id)].replace(/\[\d+\]/g, '').split('/n').slice(0)[0]
    return 'this is first paragraph'
  },
  set() {},
})

onSuccess(({ data }: any) => {
  // console.log('onSuccess', data)
  Object.keys(data.namemap).forEach((key) => {
    nameMap.set(key, data.namemap[key])
    nameMapReverse.set(data.namemap[key], key)
  })

  const personMap = new Map()
  for (const i in data.person) {
    const career: any = []
    const node = data.person[i]
    for (const careerIndex of node[3])
      career.push(nameMapReverse.get(careerIndex))

    personMap.set(node[0], {
      title: node[1],
      id: node[0],
      fid: node[2],
      career,
    })
  }

  // 获取了基础数据，下面开始展示用户数据
  const personIndex = personMap.get(Number(params.id))
  if (personIndex) {
    UserInfo.value = {
      id: personIndex?.id,
      fid: personIndex?.fid,
      title: personIndex?.title,
      career: personIndex?.career,
    }
  }
})
</script>

<template>
  <n-flex justify="space-between">
    <div>
      <a mb-10 mt-10 font-size-16 target="_blank" :href="`https://en.wikipedia.org/wiki/${UserInfo.title.replace(' ', '_')}`">
        {{ UserInfo.title }}
      </a>
      <div mt-10>
        <n-space>
          <n-tag v-for="item in UserInfo.career" :key="`tag-${item}`" type="info">
            {{ item }}
          </n-tag>
        </n-space>
      </div>
      <div mt-10 max-w-200>
        <n-spin :show="textLoading">
          {{ firstParagraph }}
          <template #description>
            加载中
          </template>
        </n-spin>
      </div>
    </div>
    <img :src="`//wsrv.nl/?url=https://${personImage}`">
  </n-flex>

  <n-spin :show="dataloading">
    <n-grid x-gap="12" :cols="2" mt-10>
      <n-gi>
        <VChart class="chart" :option="chartOption1" />
      </n-gi>
      <n-gi>
        <VChart class="chart" :option="chartOption2" />
      </n-gi>
    </n-grid>
    <template #description>
      加载中
    </template>
  </n-spin>
</template>

<style scoped>
.chart {
  height: 600px;
}
</style>
