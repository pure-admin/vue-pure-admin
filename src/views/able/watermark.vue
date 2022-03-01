<script setup lang="ts">
import { useWatermark } from "/@/utils/watermark";
const { setWatermark, clear } = useWatermark();
</script>

<template>
  <div>
    <el-button @click="setWatermark('vue-pure-admin')">创建</el-button>
    <el-button @click="clear">清除</el-button>
  </div>
</template>

<style scoped></style>
