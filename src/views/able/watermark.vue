<script setup lang="ts">
import { ref } from "vue";
import { useWatermark } from "/@/utils/watermark";

defineOptions({
  name: "WaterMark"
});

let color = ref("#409EFF");
let value = ref("vue-pure-admin");
const { setWatermark, clear } = useWatermark();
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">页面水印功能</span>
      </div>
    </template>
    <span> 请输入要创建水印的值：</span>
    <el-input
      class="mb-4 mr-4"
      style="width: 200px"
      v-model="value"
      clearable
    />
    <span>请选择要创建水印的颜色：</span>
    <el-color-picker v-model="color" show-alpha />
    <br />
    <el-button @click="setWatermark(value, { fillStyle: color })">
      创建
    </el-button>
    <el-button @click="clear">清除</el-button>
  </el-card>
</template>

<style scoped></style>
