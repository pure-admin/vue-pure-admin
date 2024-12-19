<script setup lang="ts">
import { ref } from "vue";

const value1 = ref(0);
const value2 = ref(0);
const value3 = ref(0);
const value4 = ref(0);
</script>

<template>
  <div class="slider-demo-block">
    <span class="mr-2">上</span>
    <el-slider v-model="value1" />
  </div>
  <div class="slider-demo-block">
    <span class="mr-2">下</span>
    <el-slider v-model="value2" placement="bottom" />
  </div>
  <div class="slider-demo-block">
    <span class="mr-2">左</span>
    <el-slider v-model="value4" placement="left" />
  </div>
  <div class="slider-demo-block">
    <span class="mr-2">右</span>
    <el-slider v-model="value3" placement="right" />
  </div>
</template>

<style lang="scss" scoped>
.slider-demo-block {
  display: flex;
  align-items: center;
  max-width: 600px;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>
