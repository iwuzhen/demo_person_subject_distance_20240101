<script setup lang="ts">
import { useRequest } from 'alova'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag, useMessage } from 'naive-ui'
import { getPersonIndex } from '~/api/methods/person'
import { useCharacterComparsionStore } from '~/stores/character-comparison'

const store = useCharacterComparsionStore()

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

  // 生成整个 table 数据
  tableData.value = cache_data
  // console.log('tableData.value', tableData.value)
})

interface RowData {
  rank: number
  id: number
  fid: number
  title: string
  career: string[]
}
const message = useMessage()
function setCompare(item: RowData) {
  // console.log(item)
  const [flag, msg] = store.add(item)
  if (flag) {
    message.info(`${item.title} 添加成功`, {
      keepAliveOnHover: true,
    })
  }
  else {
    message.warning(`${item.title} ${msg}`, {
      keepAliveOnHover: true,
    })
  }
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
      return h('a', { href: `/personID/${row.id}`, class: 'cool-link' }, {
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
  {
    title: '多人对比',
    key: 'actions',
    width: 50,
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          secondary: true,
          type: 'primary',
          size: 'small',
          onClick: () => setCompare(row),
        },
        { default: () => 'Add' },
      )
    },
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

<style>
a.cool-link {
  display: inline-block;
  text-decoration: none;
  color: #000;
  padding: 10px 20px;
  position: relative;
  background-color: #fff;
  border: 1px solid #fde400;
  transition: all 0.3s ease;
}

a.cool-link::before {
  content: '';
  position: absolute;
  width: 0;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000;
  z-index: -1;
  transition: all 0.3s ease;
}

a.cool-link:hover {
  color: #006eff;
}

a.cool-link:hover::before {
  width: 100%;
}

a.cool-link:active {
  background-color: #000;
  color: #fff;
  border-color: #fff;
}
</style>
