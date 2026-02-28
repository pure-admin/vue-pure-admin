<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "ColorPickerPanel"
});

const disabled = ref(false);
const color = ref("rgba(255, 69, 0, 0.68)");
const predefineColors = [
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577"
];
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <el-space wrap :size="40">
          <el-link
            v-tippy="{
              content: '点击查看详细文档'
            }"
            href="https://element-plus.org/zh-CN/component/color-picker-panel.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            颜色选择器面板
          </el-link>
          <el-radio-group v-model="disabled">
            <el-radio :value="false">启用</el-radio>
            <el-radio :value="true">禁用</el-radio>
          </el-radio-group>
        </el-space>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/color-picker-panel.vue"
        target="_blank"
      >
        代码位置 src/views/components/color-picker-panel.vue
      </el-link>
    </template>

    <div class="mb-2">选择透明度、预定义颜色、无边框</div>
    <el-color-picker-panel
      v-model="color"
      show-alpha
      :border="false"
      :disabled="disabled"
      :predefine="predefineColors"
    />
    <el-divider />
  </el-card>
</template>
