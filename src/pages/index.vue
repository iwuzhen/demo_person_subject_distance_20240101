<script setup lang="ts" generic="T extends any, O extends any">
defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div mt-20 font-size-8 font-20>
    方法论
  </div>
  <div font-size-4 font-100>
    取6个不同职业群体的所有page的linksin的集合 和 6个不同艺术的所有page的linksin集合, 计算两个集合的 google 距离。 <br>
    学科从对应categetory出发，向下找2层，取这些category的所有page <br>
    职业群体从对应categetory出发，通过关键词过滤保留所有关于人的page <br>
    这个距离能反映职业群体和艺术的相关性。 <br>
    距离越小，职业群体和学科相关性越强。 <br>
  </div>

  <CareerSubjectCombineCharts />
</template>
