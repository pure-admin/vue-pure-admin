<script setup lang="ts">
import { useVModel } from "@vueuse/core";

// 声明 props 类型
export interface FormProps {
  data: string;
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  data: () => ""
});

// 使用 vueuse 的双向绑定工具
const emit = defineEmits(["update:data"]);
const data = useVModel(props, "data", emit);
</script>

<template>
  <el-input class="!w-[220px]" v-model="data" placeholder="请输入内容" />
</template>
