<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineOptions({
  name: "PureProgress"
});

const format = percentage => (percentage === 100 ? "Full" : `${percentage}%`);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <el-link
          v-tippy="{
            content: '点击查看详细文档'
          }"
          href="https://element-plus.org/zh-CN/component/progress.html"
          target="_blank"
          style="font-size: 16px; font-weight: 800"
        >
          进度条
        </el-link>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/progress.vue"
        target="_blank"
      >
        代码位置 src/views/components/progress.vue
      </el-link>
    </template>

    <p class="mb-4">直线进度条动画</p>
    <div class="w-1/4">
      <el-progress indeterminate :percentage="50" class="mb-4" />
      <el-progress
        indeterminate
        :percentage="100"
        :format="format"
        class="mb-4"
      />
      <el-progress
        indeterminate
        :percentage="100"
        status="success"
        class="mb-4"
      />
      <el-progress
        indeterminate
        :percentage="100"
        status="warning"
        class="mb-4"
      />
      <el-progress
        indeterminate
        :percentage="50"
        status="exception"
        class="mb-4"
      />
    </div>

    <p class="mb-4">进度条内显示百分比标识</p>
    <div class="w-1/4">
      <el-progress
        :text-inside="true"
        :stroke-width="26"
        :percentage="70"
        class="mb-4"
      />
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="100"
        status="success"
        striped
        striped-flow
        :duration="70"
        class="mb-4"
      />
      <el-progress
        :text-inside="true"
        :stroke-width="22"
        :percentage="80"
        status="warning"
        class="mb-4"
      />
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="50"
        status="exception"
        striped
        striped-flow
        class="mb-4"
      />
    </div>

    <p class="mb-4">自定义内容</p>
    <div class="w-1/4 demo-progress">
      <el-progress :percentage="50">
        <el-button text>自定义内容</el-button>
      </el-progress>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="50"
        status="exception"
      >
        <span>自定义内容</span>
      </el-progress>
      <el-progress type="circle" :percentage="100" status="success">
        <el-button type="success" :icon="useRenderIcon('ep:check')" circle />
      </el-progress>
      <el-progress type="dashboard" :percentage="80">
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}%</span>
          <span class="percentage-label">上升率</span>
        </template>
      </el-progress>
    </div>
  </el-card>
</template>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.demo-progress .el-progress--line {
  width: 350px;
  margin-bottom: 15px;
}

.demo-progress .el-progress--circle {
  margin-right: 15px;
}
</style>
