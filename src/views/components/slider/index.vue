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
    <p class="mb-2">基础用法</p>
    <Base />
    <el-divider />
    <p class="mb-2">离散值</p>
    <Step />
    <el-divider />
    <p class="mb-2">带有输入框的滑块</p>
    <Input />
    <el-divider />
    <p class="mb-2">不同尺寸</p>
    <Size />
    <el-divider />
    <p class="mb-2">位置</p>
    <Placement />
    <el-divider />
    <p class="mb-2">范围选择</p>
    <Range />
    <el-divider />
    <p class="mb-2">垂直模式</p>
    <Vertical />
    <el-divider />
    <p class="mb-2">显示标记</p>
    <Marks class="mb-6" />
  </el-card>
</template>
