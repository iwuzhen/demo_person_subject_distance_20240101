<script setup lang="ts">
import { useRequest } from 'alova'

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
import { getPersonData, getPersonIndex } from '~/api/methods/person'

const props = defineProps<{
  userInfoList: UserInterface[]
}>()

use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  TimelineComponent,
])

provide(THEME_KEY, isDark ? 'light' : 'night')

interface UserInterface {
  id: number
  fid: number
  title: string
  career: string[]
}

const UserInfoList = ref<UserInterface[]>()

const nameMap = new Map<string, number>()
const nameMapReverse = new Map<number, string>()

const chartOption1: any = ref({})
const chartOption2: any = ref({})

const { onSuccess } = useRequest(getPersonIndex, { initialData: { namemap: {}, person: [] } })

const {
  send: sendList,
} = useRequest(
  // 必须设置为返回method实例的函数
  (fid: number) => getPersonData(fid),
  {
    immediate: false,
  },
)

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
    top: 0,
    // data: [],
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

// 利用send函数返回的promise对象
async function parallelRequest(userInfoList: UserInterface[]) {
  const ps = []
  for (const UserInfo of userInfoList)
    ps.push(sendList(UserInfo.fid))

  const responseList = await Promise.all(ps)
  const mergeData = {}
  for (const obj of responseList)
    Object.assign(mergeData, obj)
  const careerIndex = [0, 1, 2, 3, 4, 5]
  const careerName: any = []
  for (const project_id of careerIndex)
    careerName.push(nameMapReverse.get(project_id))

  const optionBaby = JSON.parse(JSON.stringify(radarChartOptionBaby))
  optionBaby.title.text = `距离各个职业`
  // optionBaby.legend.data = chartData.career_name
  optionBaby.radar.indicator = careerName.map((item: any) => {
    return {
      name: item,
    }
  })

  for (let start = yearStart; start <= yearEnd; start++) {
    const yearIndex = start - yearStart

    const dataList = []
    for (const UserInfo of userInfoList) {
      const dataObject = (mergeData as any)[Number(UserInfo.id)]
      const resultCache: any = []
      for (const careerI of careerIndex)
        resultCache.push(dataObject[careerI][yearIndex])
      dataList.push({
        value: resultCache,
        name: UserInfo.title,
      })
    }
    const seriesOption = {
      name: '距离图',
      type: 'radar',
      data: dataList,
    }
    optionBaby.options.push({ title: { text: `距离各个职业:${start} 年` }, series: seriesOption })
  }
  chartOption1.value = optionBaby

  // 并行请求完成，继续处理业务...

  // subject
  const subjectIndex = [6, 7, 8, 9, 10, 11]
  const subjectName: any = []
  for (const project_id of subjectIndex)
    subjectName.push(nameMapReverse.get(project_id))
  const optionBaby2 = JSON.parse(JSON.stringify(radarChartOptionBaby))
  optionBaby2.title.text = `距离各个艺术`

  optionBaby2.radar.indicator = subjectName.map((item: any) => {
    return {
      name: item,
    }
  })

  for (let start = yearStart; start <= yearEnd; start++) {
    const yearIndex = start - yearStart

    const dataList = []
    for (const UserInfo of userInfoList) {
      const dataObject = (mergeData as any)[Number(UserInfo.id)]

      const resultCache: any = []
      for (const subjectI of subjectIndex) {
      // 没有距离的置 0
        resultCache.push(dataObject[subjectI]?.[yearIndex] ?? 0)
      }
      dataList.push({
        value: resultCache,
        name: UserInfo.title,
      })
    }
    const seriesOption = {
      name: '距离图',
      type: 'radar',
      data: dataList,
    }
    optionBaby2.options.push({ title: { text: `距离各个艺术:${start} 年` }, series: seriesOption })
  }
  chartOption2.value = optionBaby2
}

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
  UserInfoList.value = props.userInfoList

  parallelRequest(props.userInfoList)
})
</script>

<template>
  <div mt-10>
    <n-space>
      <div v-for="UserInfo in UserInfoList" :key="`user-${UserInfo.id}`" ml-10>
        {{ UserInfo.title }}:
        <n-tag v-for="item in UserInfo.career" :key="`tag-${item}`" round type="info">
          {{ item }}
        </n-tag>
      </div>
    </n-space>
  </div>

  <n-grid x-gap="12" :cols="2" mt-10>
    <n-gi>
      <VChart class="chart" :option="chartOption1" />
    </n-gi>
    <n-gi>
      <VChart class="chart" :option="chartOption2" />
    </n-gi>
  </n-grid>
</template>

<style scoped>
.chart {
  height: 600px;
}
</style>
