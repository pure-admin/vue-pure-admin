<script setup lang="ts">
import {
  Base,
  Step,
  Input,
  Size,
  Placement,
  Range,
  Vertical,
  Marks
} from "./components";

defineOptions({
  name: "PureSlider"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <p class="font-medium">滑块</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/slider/index.vue"
          target="_blank"
        >
          代码位置 src/views/components/slider/index.vue
        </el-link>
      </div>
    </template>
    <div class="mb-2">基础用法</div>
    <Base />
    <el-divider />
    <div class="mb-2">离散值</div>
    <Step />
    <el-divider />
    <div class="mb-2">带有输入框的滑块</div>
    <Input />
    <el-divider />
    <div class="mb-2">不同尺寸</div>
    <Size />
    <el-divider />
    <div class="mb-2">位置</div>
    <Placement />
    <el-divider />
    <div class="mb-2">范围选择</div>
    <Range />
    <el-divider />
    <div class="mb-2">垂直模式</div>
    <Vertical />
    <el-divider />
    <div class="mb-2">显示标记</div>
    <Marks class="mb-6" />
  </el-card>
</template>
