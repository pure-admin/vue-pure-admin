<script setup lang="ts">
import { markRaw } from "vue";
import { randomGradient } from "@pureadmin/utils";
import { useRenderFlicker } from "@/components/ReFlicker";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Iphone from "@iconify-icons/ep/iphone";

defineOptions({
  name: "TimeLine"
});

const { lastBuildTime } = __APP_INFO__;
const activities = [
  {
    content: "支持圆点发光",
    timestamp: lastBuildTime,
    icon: markRaw(useRenderFlicker())
  },
  {
    content: "支持方形发光",
    timestamp: lastBuildTime,
    icon: markRaw(useRenderFlicker({ borderRadius: 0, background: "#67C23A" }))
  },
  {
    content: "支持渐变发光",
    timestamp: lastBuildTime,
    icon: markRaw(
      useRenderFlicker({
        background: randomGradient({
          randomizeHue: true
        })
      })
    )
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
    icon: useRenderIcon(Iphone, {
      color: "#0bbd87"
    })
  }
];
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <p class="font-medium">时间线</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/timeline.vue"
          target="_blank"
        >
          代码位置 src/views/components/timeline.vue
        </el-link>
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
            vue-pure-admin 第{{ activities.length - index }}个版本发布啦
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<style scoped>
.message {
  position: relative;
  box-sizing: border-box;
  width: 200px;
  padding: 5px 12px;
  line-height: 18px;
  color: #fff;
  word-break: break-all;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  border-radius: 6px;
}

.message::after {
  position: absolute;
  top: 8px;
  left: -10px;
  width: 0;
  height: 0;
  overflow: hidden;
  content: "";
  border-color: var(--el-color-primary) transparent transparent;
  border-style: solid dashed dashed;
  border-width: 10px;
}
</style>
