<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide, ref } from 'vue'
import chartData from '~/data/subject_career.json'

const careerGroup = ref(['Mathematicians'])
const subjectGroup = ref(['Theatre', 'Music', 'Photography', 'Painting', 'Film', 'Architecture'])

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

provide(THEME_KEY, isDark ? 'light' : 'night')
//
const yearStart = 2007
const yearEnd = 2022
const yearRange: number[] = []
for (let start = yearStart; start <= yearEnd; start++) {
  // if (start === 2022)
  //   continue
  yearRange.push(start)
}

const option = computed(() => {
  const series = []
  for (const career_name of careerGroup.value) {
    for (const subject_name of subjectGroup.value) {
      const key = `${subject_name}_${career_name}`

      series.push({
        name: key,
        type: 'line',
        // stack: 'Total',
        data: chartData.data[key],
      })
    }
  }
  series.sort((a, b) => -a.data.slice(-1) + b.data.slice(-1))

  const option = {
    title: {
      text: '职业和学科之间的关系',
    },
    legend: {
      orient: 'vertical',
      align: 'left',
      right: 20,
      top: 'middle',
      data: series.map(item => item.name),
    },
    tooltip: {
      trigger: 'axis',
      order: 'valueDesc',
    },
    xAxis: {
      data: yearRange,
      type: 'category',
      boundaryGap: false,
    },
    grid: {
      right: '20%',
    },
    yAxis: {
      type: 'value',
    },
    series,
  }

  return option
})
</script>

<template>
  <n-card title="职业和艺术选择" mt-20>
    <div>
      选择职业和艺术，可以展示相关职业和艺术的 google 距离
    </div>
    <div mt-10>
      选择学科
    </div>
    <n-checkbox-group v-model:value="subjectGroup">
      <n-space item-style="display: flex;">
        <n-checkbox v-for="(item) in chartData.subject_name" :key="`subject-${item}`" :value="item" :label="item" />
      </n-space>
    </n-checkbox-group>

    <div mt-20>
      选择职业
    </div>
    <n-checkbox-group v-model:value="careerGroup">
      <n-space item-style="display: flex;">
        <n-checkbox v-for="(item) in chartData.career_name" :key="`career-${item}`" :value="item" :label="item" />
      </n-space>
    </n-checkbox-group>
  </n-card>

  <VChart mt-10 class="chart" :option="option" />
</template>

<style scoped>
.chart {
  height: 600px;
}
</style>
