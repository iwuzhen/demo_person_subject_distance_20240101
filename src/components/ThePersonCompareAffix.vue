<script setup lang="ts">
import { NButton, NTag, NText } from 'naive-ui'

// const document = window.document
import { useCharacterComparsionStore } from '~/stores/character-comparison'

const store = useCharacterComparsionStore()

function renderCustomHeader() {
  const tags = []
  for (let i = 0; i < store.characters.length; i++) {
    tags.push(
      h(NTag, {
        style: 'margin: 4px;',
        closable: true,
        onClose: () => {
          store.remove(store.characters[i].id)
        },
      }, { default: () => store.characters[i].title }),
    )
  }
  return h(
    'div',
    {
      style: 'display: block; align-items: center; padding: 8px 12px;width: 300px;',
    },
    [
      h('div', null, [
        h('div', null, [h(NText, { depth: 2 }, { default: () => '已经添加的人物' })]),
        ...tags,
      ]),
      h('div', { style: 'margin-right: 10px; text-align:right' }, [
        h(NButton, { secondary: true, style: 'margin-right: 10px;', onclick: () => { store.clear() } }, { default: () => '清空' }),
        h(NButton, { type: 'primary', onclick: () => comparePerson() }, { default: () => '比较' }),
      ]),
    ],
  )
}

const showModal = ref(false)

function comparePerson() {
  if (store.characterList.length > 1)
    showModal.value = true
}
const options = ref([
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader,
  },
])
</script>

<template>
  <n-affix :top="30" :bottom="120" :trigger-top="30" position="fix" class="top-ball" text-right>
    <n-dropdown
      :options="options"
      placement="bottom-start"
      trigger="hover"
    >
      <NButton type="primary">
        当前添加的人物数量 {{ store.characterList.length }}
      </NButton>
    </n-dropdown>
  </n-affix>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 90%"
      title="多人对比"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <ThePersonCompareBord :user-info-list="store.characters" />
    </n-card>
  </n-modal>
</template>

<style>
.top-ball {
  z-index: 999;
  position: sticky !important;
}
</style>
