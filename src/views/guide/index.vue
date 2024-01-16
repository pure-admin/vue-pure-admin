<script setup lang="ts">
import intro from "intro.js";
import "intro.js/minified/introjs.min.css";

defineOptions({
  name: "Guide"
});

const onGuide = () => {
  intro()
    .setOptions({
      steps: [
        {
          element: document.querySelector(".sidebar-logo-container") as
            | string
            | HTMLElement,
          title: "项目名称和Logo",
          intro: "您可以在这里设置项目名称和Logo",
          position: "left"
        },
        {
          element: document.querySelector("#header-search") as
            | string
            | HTMLElement,
          title: "搜索菜单",
          intro: "您可以在这里搜索想要查看的菜单",
          position: "left"
        },
        {
          element: document.querySelector("#header-notice") as
            | string
            | HTMLElement,
          title: "消息通知",
          intro: "您可以在这里查看管理员发送的消息",
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
          element: document.querySelector(".set-icon") as string | HTMLElement,
          title: "项目配置",
          intro: "您可以在这里查看项目配置",
          position: "left"
        },
        {
          element: document.querySelector(".tags-view") as string | HTMLElement,
          title: "多标签页",
          intro: "这里是您访问过的页面的历史",
          position: "bottom"
        }
      ]
    })
    .start();
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
    </template>
    <el-button @click="onGuide"> 打开引导页 </el-button>
  </el-card>
</template>
