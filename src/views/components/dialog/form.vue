<script setup lang="ts">
import { ref } from "vue";

// 声明 props 类型
export interface FormProps {
  formInline: {
    user: string;
    region: string;
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ user: "", region: "" })
});

// vue 规定所有的 prop 都遵循着单向绑定原则，不能在子组件中更改 prop 值，该 form.vue 文件为子组件
// 如果需要拿到初始化的 prop 值并使得组件变量可修改，则需要在子组件定义一个新的变量接受这个子组件的 prop
// 推荐阅读：https://cn.vuejs.org/guide/components/props.html#one-way-data-flow
const newFormInline = ref(props.formInline);
</script>

<template>
  <el-form :model="newFormInline">
    <el-form-item label="姓名">
      <el-input
        class="!w-[220px]"
        v-model="newFormInline.user"
        placeholder="请输入姓名"
      />
    </el-form-item>
    <el-form-item label="城市">
      <el-select
        class="!w-[220px]"
        v-model="newFormInline.region"
        placeholder="请选择城市"
      >
        <el-option label="上海" value="上海" />
        <el-option label="浙江" value="浙江" />
        <el-option label="深圳" value="深圳" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
