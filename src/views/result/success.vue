<script setup lang="ts">
defineOptions({
  name: "Success"
});

const { lastBuildTime } = __APP_INFO__;
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">成功页</span>
      </div>
    </template>
    <el-result
      icon="success"
      title="提交成功"
      sub-title="提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 本文字区域可以展示简单的补充说明，如果有类似展示 “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。"
    >
      <template #extra>
        <div class="flex">
          <el-button type="primary">返回列表</el-button>
          <el-button>查看项目</el-button>
          <el-button>打印</el-button>
        </div>
      </template>
    </el-result>
    <div style="background: rgb(250, 250, 250)" class="p-6 ml-10 mr-10">
      <el-descriptions title="项目名称" class="mb-5">
        <el-descriptions-item label="项目 ID：">12345</el-descriptions-item>
        <el-descriptions-item label="负责人：">明明</el-descriptions-item>
        <el-descriptions-item label="生效时间：">{{
          lastBuildTime
        }}</el-descriptions-item>
      </el-descriptions>
      <el-steps :active="2">
        <el-step title="创建项目">
          <template #description>
            <p>明明</p>
            <p>{{ lastBuildTime }}</p>
          </template>
        </el-step>
        <el-step title="部门初审">
          <template #description>
            <p class="flex items-center">
              亮亮
              <span
                role="img"
                aria-label="dingding"
                class="anticon anticon-dingding cursor-pointer flex items-center cursor-pointer"
                style="color: rgb(0, 160, 233); margin-left: 8px"
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="dingding"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M573.7 252.5C422.5 197.4 201.3 96.7 201.3 96.7c-15.7-4.1-17.9 11.1-17.9 11.1-5 61.1 33.6 160.5 53.6 182.8 19.9 22.3 319.1 113.7 319.1 113.7S326 357.9 270.5 341.9c-55.6-16-37.9 17.8-37.9 17.8 11.4 61.7 64.9 131.8 107.2 138.4 42.2 6.6 220.1 4 220.1 4s-35.5 4.1-93.2 11.9c-42.7 5.8-97 12.5-111.1 17.8-33.1 12.5 24 62.6 24 62.6 84.7 76.8 129.7 50.5 129.7 50.5 33.3-10.7 61.4-18.5 85.2-24.2L565 743.1h84.6L603 928l205.3-271.9H700.8l22.3-38.7c.3.5.4.8.4.8S799.8 496.1 829 433.8l.6-1h-.1c5-10.8 8.6-19.7 10-25.8 17-71.3-114.5-99.4-265.8-154.5z"
                  />
                </svg>
                催一下
              </span>
            </p>
          </template>
        </el-step>
        <el-step title="财务复核" />
        <el-step title="完成" />
      </el-steps>
    </div>
  </el-card>
</template>

<style scoped>
:deep(.el-descriptions__body) {
  background: transparent;
}
</style>
