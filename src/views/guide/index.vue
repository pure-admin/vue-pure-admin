<script setup lang="ts">
import { ref } from "vue";
import intro from "intro.js";
import "intro.js/minified/introjs.min.css";

type GuideStep = {
  element: string | HTMLElement;
  title: string;
  intro: string;
  position: "left" | "right" | "top" | "bottom";
};

defineOptions({
  name: "Guide"
});

const GUIDE_STEPS = [
  {
    element: document.querySelector(".sidebar-logo-container") as
      | string
      | HTMLElement,
    title: "项目名称和Logo",
    intro: "您可以在这里设置项目名称和Logo",
    position: "left"
  },
  {
    element: document.querySelector("#header-search") as string | HTMLElement,
    title: "搜索菜单",
    intro: "您可以在这里搜索想要查看的菜单",
    position: "left"
  },
  {
    element: document.querySelector("#header-translation") as
      | string
      | HTMLElement,
    title: "国际化",
    intro: "您可以在这里进行语言切换",
    position: "left"
  },
  {
    element: document.querySelector("#full-screen") as string | HTMLElement,
    title: "全屏",
    intro: "您可以在这里进行全屏切换",
    position: "left"
  },
  {
    element: document.querySelector("#header-notice") as string | HTMLElement,
    title: "消息通知",
    intro: "您可以在这里查看管理员发送的消息",
    position: "left"
  },
  {
    element: document.querySelector(".set-icon") as string | HTMLElement,
    title: "系统配置",
    intro: "您可以在这里查看系统配置",
    position: "left"
  },
  {
    element: document.querySelector(".tags-view") as string | HTMLElement,
    title: "多标签页",
    intro: "这里是您访问过的页面的历史",
    position: "bottom"
  }
] as Partial<GuideStep>[];

const tourOpen = ref(false);

const onGuide = () => {
  intro()
    .setOptions({
      steps: GUIDE_STEPS
    })
    .start();
};

const onTour = () => {
  tourOpen.value = true;
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          引导页常用于引导式介绍项目的基本功能或亮点
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/guide/index.vue"
        target="_blank"
      >
        代码位置 src/views/guide/index.vue
      </el-link>
    </template>
    <el-button @click="onGuide"> 打开引导页 (intro.js) </el-button>
    <el-button @click="onTour"> 打开引导页 (el-tour) </el-button>

    <el-tour v-model="tourOpen">
      <el-tour-step
        v-for="step in GUIDE_STEPS"
        :key="step.title"
        :target="() => step.element"
        :title="step.title"
        :description="step.intro"
        :placement="step.position"
      />
    </el-tour>
  </el-card>
</template>
