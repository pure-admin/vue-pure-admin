<script setup lang="ts">
import { ref } from "vue";

const value1 = ref(0);
const value2 = ref(0);
</script>

<template>
  <div class="slider-demo-block">
    <span class="demonstration">不显示断点</span>
    <el-slider v-model="value1" :step="10" />
  </div>
  <div class="slider-demo-block">
    <span class="demonstration">显示断点</span>
    <el-slider v-model="value2" :step="10" show-stops />
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

.slider-demo-block .demonstration {
  flex: 1;
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  line-height: 44px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
}
</style>
