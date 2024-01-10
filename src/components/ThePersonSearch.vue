<script setup lang="ts">
import { useRequest } from 'alova'
import { NTag } from 'naive-ui'
import Fuse from 'fuse.js'
import type { DataTableColumns } from 'naive-ui'
import { getPersonIndex } from '~/api/methods/person'

const { onSuccess } = useRequest(getPersonIndex, { initialData: { namemap: {}, person: [] } })

const searchData = ref<any[]>([])
const nameMap = new Map<string, number>()
const nameMapReverse = new Map<number, string>()
let fuse: any = null
// 更新基础数据
onSuccess(({ data }) => {
  // console.log('onSuccess', data)
  Object.keys(data.namemap).forEach((key) => {
    nameMap.set(key, data.namemap[key])
    nameMapReverse.set(data.namemap[key], key)
  })

  const personArr = []
  for (const i in data.person) {
    const career: any = []
    const node = data.person[i]
    for (const careerIndex of node[3])
      career.push(nameMapReverse.get(careerIndex))

    personArr.push({
      title: node[1],
      id: node[0],
      fid: node[2],
      career,
    })
  }
  fuse = new Fuse(personArr, { keys: ['title'] })
})

const personQueryStr = ref('')
function changeQuery(value: string) {
  const result = fuse.search(value)
  const cache = []
  // console.log('changeQuery', value, result)
  for (const item of result) {
    cache.push({
      id: item.item.id,
      title: item.item.title,
      career: item.item.career,
    })
  }
  searchData.value = cache.slice(0, 100)
}

interface RowData {
  name: string
  career: number[]
}

const columns: DataTableColumns<RowData> = [
  {
    title: 'Name',
    key: 'title',
    width: 80,
    // maxWidth: 80,
    fixed: 'left',
    render(row: any) {
      return h('a', { href: `/personID/${row.id}`, target: '_blank', class: 'cool-link' }, {
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
]
const pagination = {
  pageSize: 10,
}
</script>

<template>
  <n-card title="搜索用户">
    <n-input v-model:value="personQueryStr" type="text" placeholder="搜索用户" :on-input="changeQuery" max-w-100 />

    <n-data-table
      mt-10
      :columns="columns"
      :data="searchData"
      :max-height="540"
      :scroll-x="400"
      :pagination="pagination"
    />
  </n-card>
</template>
