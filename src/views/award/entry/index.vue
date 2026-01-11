<template>
  <div class="main p-4">
    <el-row :gutter="20">
      <el-col :xl="14" :lg="14" :md="24" :sm="24">
        <el-card shadow="never" class="h-full">
          <template #header>
            <div class="flex items-center gap-2">
              <el-icon class="text-primary"><EditPen /></el-icon>
              <span class="font-bold">单条获奖记录录入</span>
            </div>
          </template>
          <AwardFormInner @success="handleSuccess" />
        </el-card>
      </el-col>

      <el-col :xl="10" :lg="10" :md="24" :sm="24">
        <el-card shadow="never" class="h-full">
          <template #header>
            <div class="flex items-center gap-2">
              <el-icon class="text-success"><Box /></el-icon>
              <span class="font-bold">批量数据导入</span>
            </div>
          </template>
          <BatchImportWizard @success="handleSuccess" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { EditPen, Box } from "@element-plus/icons-vue";
import AwardFormInner from "../components/AwardFormInner.vue";
import BatchImportWizard from "../components/BatchImportWizard.vue"; // 引入新组件

// 统一的处理函数，无论是单条录入成功，还是批量导入成功，可能都需要刷新某个列表
const handleSuccess = () => {
  // 这里可以触发你需要刷新的逻辑，比如刷新下方的表格，或者仅提示
  // message("操作成功，数据已更新", { type: "success" });
  console.log("数据变动，建议刷新列表");
};
</script>

<style scoped>
/* 保持你原有的样式 */
.main {
  min-height: calc(100vh - 100px);
  background-color: #f5f7fa;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.el-col {
  display: flex;
  flex-direction: column;
}

.el-card {
  flex: 1;
}
</style>
