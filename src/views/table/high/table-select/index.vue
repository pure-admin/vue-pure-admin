<script setup lang="ts">
import { ref } from "vue";
import radioSelectTable from "./radio/index.vue";
import multipleSelectTable from "./multiple/index.vue";

const model = ref("radio");
</script>

<template>
  <el-space>
    <el-radio-group v-model="model">
      <el-radio-button value="radio">单选</el-radio-button>
      <el-radio-button value="multiple">多选</el-radio-button>
    </el-radio-group>
    <el-divider direction="vertical" />
    <component
      :is="model === 'radio' ? radioSelectTable : multipleSelectTable"
    />
  </el-space>
</template>
