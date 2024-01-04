<script lang="ts">
import { defineComponent, h, ref } from 'vue'
import type { MenuOption } from 'naive-ui'

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        'a',
        {
          href: '/',
          target: '_blank',
          rel: 'noopenner noreferrer',
        },
        '职业和各艺术的距离',
      ),
    key: 'career-group',
    // icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        'a',
        {
          href: '/',
          target: '_blank',
          rel: 'noopenner noreferrer',
        },
        '个人和各艺术的距离(待计算)',
      ),
    key: 'subject-group',
    // icon: renderIcon(BookIcon),
  },

]

export default defineComponent({
  setup() {
    return {
      activeKey: ref<string | null>(null),
      menuOptions,
    }
  },
})
</script>

<template>
  <n-split :default-size="0.8">
    <template #1>
      <n-menu
        v-model:value="activeKey"
        mode="horizontal"
        :options="menuOptions"
        responsive
      />
    </template>
  </n-split>
</template>
