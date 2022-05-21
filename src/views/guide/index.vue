<script setup lang="ts">
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

defineOptions({
  name: "Guide"
});

const steps = [
  {
    element: "#header-notice",
    popover: {
      title: "消息通知",
      description: "你可以在这里查看管理员发送的消息",
      position: "left"
    }
  },
  {
    element: "#header-screenfull",
    popover: {
      title: "全屏",
      description: "你可以在这里进行全屏切换",
      position: "left"
    }
  },
  {
    element: "#header-translation",
    popover: {
      title: "国际化",
      description: "你可以在这里进行语言切换",
      position: "left"
    }
  },
  {
    element: ".el-icon-setting",
    popover: {
      title: "项目配置",
      description: "你可以在这里查看项目配置",
      position: "left"
    }
  },
  {
    element: ".tags-view",
    popover: {
      title: "多标签页",
      description: "这里是你访问过的页面的历史",
      position: "buttom"
    }
  }
];

const driver = new Driver({
  className: "scoped-class",
  animate: true,
  opacity: 0.75,
  padding: 0,
  allowClose: true,
  overlayClickNext: false,
  doneBtnText: "完成",
  closeBtnText: "关闭",
  nextBtnText: "下一步",
  prevBtnText: "上一步"
});

const guide = () => {
  driver.defineSteps(steps);
  driver.start();
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能
        </span>
      </div>
    </template>
    <el-button
      type="primary"
      style="margin-top: 10px"
      @click.prevent.stop="guide"
    >
      打开引导页
    </el-button>
  </el-card>
</template>

<style>
div#driver-highlighted-element-stage,
div#driver-page-overlay {
  background: transparent !important;
  outline: 5000px solid rgba(0, 0, 0, 0.75);
}
</style>
