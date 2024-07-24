<template>
  <el-row :gutter="20">
    <!-- one card -->
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="98500">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              项目数
              <el-tooltip
                effect="dark"
                content="创建的项目数量"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <!-- one card -->
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="693700">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              测试用例数
              <el-tooltip
                effect="dark"
                content="测试用例的数量"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="97" title="New transactions today">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              测试通过率
              <el-tooltip
                effect="dark"
                content="测试通过的用例数/测试用例总数"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #suffix>%</template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="98500">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              测试报告数
              <el-tooltip
                effect="dark"
                content="测试报告的数量"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { Warning } from "@element-plus/icons-vue";
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 10px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}
</style>
