<script setup lang="ts">
import { useColumns } from "./columns";
import ReCodePath from "@/components/ReCodePath";

defineOptions({
  name: "Fail"
});

const { columns } = useColumns();
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <ReCodePath />
    </template>
    <el-result
      icon="error"
      title="提交失败"
      sub-title="请核对并修改以下信息后，再重新提交。"
    >
      <template #extra>
        <el-button type="primary">返回修改</el-button>
      </template>
    </el-result>
    <PureDescriptions
      :columns="columns"
      title="您提交的内容有如下错误："
      class="p-6 w-[90%] m-auto bg-[#fafafa] dark:bg-[#1d1d1d]"
    />
  </el-card>
</template>

<style scoped>
:deep(.el-descriptions__body) {
  background: transparent;
}
</style>
