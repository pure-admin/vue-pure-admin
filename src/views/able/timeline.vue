<script setup lang="ts">
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { useRenderFlicker } from "/@/components/ReFlicker";

defineOptions({
  name: "TimeLine"
});

const { lastBuildTime } = __APP_INFO__;
const activities = [
  {
    content: "支持圆点闪动",
    timestamp: lastBuildTime,
    icon: useRenderFlicker()
  },
  {
    content: "支持方形闪动",
    timestamp: lastBuildTime,
    icon: useRenderFlicker({ borderRadius: 0, background: "#67C23A" })
  },
  {
    content: "支持默认颜色",
    timestamp: lastBuildTime
  },
  {
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    color: "#F56C6C"
  },
  {
    content: "支持自定义图标",
    timestamp: lastBuildTime,
    color: "transparent",
    icon: useRenderIcon("iphone", {
      color: "#0bbd87"
    })
  }
];
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">时间线</span>
      </div>
    </template>
    <div class="flex">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :color="activity.color"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>

      <el-timeline class="pl-40">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :color="activity.color"
          :timestamp="activity.timestamp"
          placement="bottom"
        >
          <div class="message">
            vue-pure-admin是基于Vue3.0+TypeScript+Vite2.0+Element-Plus编写的一套后台管理系统
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<style scoped>
.message {
  width: 200px;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
  line-height: 18px;
  padding: 5px 12px 5px 12px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
}

.message::after {
  content: "";
  position: absolute;
  top: 8px;
  left: -10px;
  width: 0;
  height: 0;
  overflow: hidden;
  border-color: var(--el-color-primary) transparent transparent;
  border-style: solid dashed dashed;
  border-width: 10px;
}
</style>
