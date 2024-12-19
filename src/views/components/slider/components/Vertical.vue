<script setup lang="ts">
import { ref } from "vue";

const value = ref(0);
</script>

<template>
  <div class="slider-demo-block">
    <el-slider v-model="value" vertical height="200px" />
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
