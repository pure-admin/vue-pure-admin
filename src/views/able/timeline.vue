<script setup lang="ts">
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { useRenderFlicker } from "/@/components/ReFlicker";
// eslint-disable-next-line no-undef
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
  </el-card>
</template>
