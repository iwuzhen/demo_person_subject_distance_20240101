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
    单个人 page 的 linksin 集合 与（艺术 page 的 linksin 集合，职业群体page的linksin 集合）, 计算两个集合的 google 距离。 <br>
    距离越小，人与职业群体或者艺术相关性越强。 <br>
    可以通过模糊搜索找到职业群体中的但个人 <br>
    下面也统计了各个分类距离最近的100人 <br>
  </div>

  <ThePersonCompareAffix />
  <ThePersonSearch />
  <ThePersonRank />
</template>
