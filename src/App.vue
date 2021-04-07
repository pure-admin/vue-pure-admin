<template>
  <router-view />
</template>
<script lang='ts'>

import * as echarts from 'echarts'
import { provide } from 'vue'

export default {
  setup(){
    provide('echarts', echarts)
  }
}
</script>