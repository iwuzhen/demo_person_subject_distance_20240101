<script setup lang="ts">
import { useRequest } from 'alova'
import { getPersonIndex } from '~/api/methods/person'

const { data: personData } = useRequest(getPersonIndex())

onMounted(() => {
  console.log(personData.value)
})
</script>

<template>
  <div>hello</div>
</template>
