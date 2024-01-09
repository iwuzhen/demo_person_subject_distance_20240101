<script setup lang="ts">
import { useRequest } from 'alova'
import type { DataTableColumns } from 'naive-ui'
import { NTag } from 'naive-ui'
import { getPersonIndex } from '~/api/methods/person'

const { onSuccess } = useRequest(getPersonIndex, { initialData: { namemap: {}, person: [] } })

const nameMap = new Map<string, number>()
const nameMapReverse = new Map<number, string>()

const tableData = ref([])

function getTop100(personList: any, index: number) {
  personList = personList.filter((node: any) => node[4][index] > 0)
  personList.sort((a: any, b: any) => a[4][index] - b[4][index])
  const arr = []
  for (let i = 0; i < 100; i++) {
    const career: any = []
    const node = personList[i]
    for (const careerIndex of node[3])
      // nameMapReverse.value[careerIndex as string]
      career.push(nameMapReverse.get(careerIndex))

    arr.push({
      rank: i + 1,
      title: node[1],
      id: node[0],
      fid: node[2],
      career,
      distance: node[4][index],
    })
  }
  return arr
}

// 更新基础数据
onSuccess(({ data }) => {
  // console.log('onSuccess', data)
  Object.keys(data.namemap).forEach((key) => {
    nameMap.set(key, data.namemap[key])
    nameMapReverse.set(data.namemap[key], key)
  })

  const cache_data: any = []
  Object.keys(data.namemap).forEach((key) => {
    cache_data.push({
      title: key,
      data: getTop100(data.person, data.namemap[key]),
    })
  })

  // 生成本eplmn
  tableData.value = cache_data
  // console.log('tableData.value', tableData.value)
})

interface RowData {
  key: number
  name: string
  age: number
  address: string
}

const columns: DataTableColumns<RowData> = [
  {
    title: 'Rank',
    key: 'rank',
    width: 30,
    fixed: 'left',
  },
  {
    title: 'Name',
    key: 'title',
    width: 80,
    // maxWidth: 80,
    fixed: 'left',
    render(row: any) {
      return h('a', { href: `https://en.wikipedia.org/wiki/${row.title.replace(' ', '_')}`, target: '_blank' }, {
        default: () => row.title,
      })
    },
  },
  {
    title: 'Career',
    key: 'career',
    width: 120,
    render(row: any) {
      const tags = row.career.map((tagKey: any) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => tagKey,
          },
        )
      })
      return tags
    },
  },
  {
    title: 'Distance',
    key: 'distance',
    width: 50,
  },
]
</script>

<template>
  <n-grid x-gap="12" :cols="2">
    <n-gi v-for="({ title, data }) in tableData" :key="title">
      <n-card :title="`${title} Top 100`">
        <n-data-table
          :columns="columns"
          :data="data"
          :max-height="250"
          :scroll-x="400"
          virtual-scroll
        />
      </n-card>
    </n-gi>
  </n-grid>
</template>
