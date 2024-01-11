<template>
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
