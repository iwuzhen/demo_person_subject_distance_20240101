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
          // target: '_blank',
          rel: 'noopenner noreferrer',
        },
        '职业群体和艺术的距离',
      ),
    key: 'career-group',
    // icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        'a',
        {
          href: '/person',
          // target: '_blank',
          rel: 'noopenner noreferrer',
        },
        '人到艺术和职业群体的距离',
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
  <n-flex>
    <n-menu
      v-model:value="activeKey"
      mode="horizontal"
      :options="menuOptions"
      responsive
    />
  </n-flex>
</template>
