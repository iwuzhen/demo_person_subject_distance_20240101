<script setup lang="ts">
// 雷达图，加上时间轴的描绘职业群体和艺术之间的举例
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import {
  LegendComponent,
  TimelineComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide, ref } from 'vue'
import chartData from '~/data/subject_career.json'

const props = defineProps<{
  showType: string
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
//
const yearStart = 2007
const yearEnd = 2022
const yearRange = []
for (let start = yearStart; start <= yearEnd; start++)
  yearRange.push(start)

const optionBaby: any = {
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
    currentIndex: 15,
    // orient: 'vertical',
    axisType: 'category',
  },
  options: [],
}
if (props.showType === 'career') {
  optionBaby.title.text = '职业群体到各个艺术的距离'
  optionBaby.legend.data = chartData.career_name
  optionBaby.radar.indicator = chartData.subject_name.map((item: any) => {
    return {
      name: item,
      max: 0.8,
      min: 0.4,
    }
  })

  for (let start = yearStart; start <= yearEnd; start++) {
    // if (start === 2022)
    //   continue
    const resultCache: any = {}
    for (const careerName of chartData.career_name)
      resultCache[careerName] = []

    const yearIndexx = start - yearStart
    for (const careerName of chartData.career_name) {
      for (const subjectName of chartData.subject_name) {
        const chartSourceKey = `${subjectName}_${careerName}`
        resultCache[careerName].push(chartData.data[chartSourceKey][yearIndexx])
      }
    }
    const seriesOption = {
      name: '距离图',
      type: 'radar',
      data: Object.entries(resultCache).map(([name, value]) => {
        return {
          value,
          name,
        }
      }),
    }
    optionBaby.options.push({ title: { text: `职业群体到各个艺术的距离:${start} 年` }, series: seriesOption })
  }
}

else if (props.showType === 'subject') {
  optionBaby.title.text = '艺术到各个职业群体的距离'
  optionBaby.legend.data = chartData.subject_name
  optionBaby.radar.indicator = chartData.career_name.map((item: any) => {
    return {
      name: item,
      max: 1,
    }
  })

  for (let start = yearStart; start <= yearEnd; start++) {
    // if (start === 2022)
    //   continue
    const resultCache: any = {}
    for (const subjectName of chartData.subject_name)
      resultCache[subjectName] = []

    const yearIndexx = start - yearStart
    for (const subjectName of chartData.subject_name) {
      for (const careerName of chartData.career_name) {
        const chartSourceKey = `${subjectName}_${careerName}`
        resultCache[subjectName].push(chartData.data[chartSourceKey][yearIndexx])
      }
    }
    const seriesOption = {
      name: '距离图',
      type: 'radar',
      data: Object.entries(resultCache).map(([name, value]) => {
        return {
          value,
          name,
        }
      }),
    }
    optionBaby.options.push({ title: { text: `艺术到各个职业群体的距离: ${start}年` }, series: seriesOption })
  }
}

const option: any = ref(optionBaby)
</script>

<template>
  <VChart class="chart" :option="option" />
</template>

<style scoped>
.chart {
  height: 600px;
}
</style>
