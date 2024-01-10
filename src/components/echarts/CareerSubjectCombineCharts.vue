<template>
  <div mt-20 font-size-8 font-20>
    方法论
  </div>
  <div font-size-4 font-100>
    取职业page集合 和 艺术page集合计算出来的职业和艺术的 google 距离。 <br>
    代表职业和各个艺术的相关性。 <br>
    距离越小， 职业和学科相关性越强。 <br>
  </div>

  <n-grid x-gap="12" :cols="2">
    <n-gi>
      <TheRadarChart mt-20 show-type="career" />
    </n-gi>
    <n-gi>
      <TheRadarChart mt-20 show-type="subject" />
    </n-gi>
  </n-grid>
  <n-divider />
  <TheLinerChart mt-20 />
</template>
