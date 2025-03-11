<script setup lang="ts">
import { h } from "vue";
import { ElEmpty } from "element-plus";
import { deviceDetection } from "@pureadmin/utils";
import {
  ChatGPT,
  Bard,
  Bing,
  iMessage,
  Blue,
  LoFi,
  Red,
  Dark,
  FullInput,
  Group,
  MessageCode,
  Speech,
  IntroPanel
} from "./components";

defineOptions({
  name: "ChatAi"
});

const swiperExample: any[] = [
  { id: 0, label: "ChatGPT 风格", component: ChatGPT },
  {
    id: 1,
    label: "Gemini 风格",
    component: Bard
  },
  {
    id: 2,
    label: "BingChat 风格",
    component: Bing
  },
  {
    id: 3,
    label: "iMessage 风格",
    component: iMessage
  },
  {
    id: 4,
    label: "蓝色主题且可设置背景图像",
    component: Blue
  },
  {
    id: 5,
    label: "渐变主题且可设置背景图像",
    component: LoFi
  },
  {
    id: 6,
    label: "红色风格",
    component: Red
  },
  {
    id: 7,
    label: "深色模式",
    component: Dark
  },
  {
    id: 8,
    label: "全宽输入框",
    component: FullInput
  },
  {
    id: 9,
    label: "分组消息",
    component: Group
  },
  {
    id: 10,
    label: "代码消息",
    component: MessageCode
  },
  {
    id: 11,
    label: "语音输入",
    component: Speech
  },
  {
    id: 12,
    label: "简介面板",
    component: IntroPanel
  },
  {
    id: 13,
    label: "更多示例",
    component: h(ElEmpty, {
      description: "敬请期待",
      style: { minWidth: "320px", height: "350px" }
    })
  }
];
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          Ai聊天组件，采用开源的
          <el-link
            href="https://deepchat.dev/"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            deep-chat
          </el-link>
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/chatai"
        target="_blank"
      >
        代码位置 src/views/chatai
      </el-link>
    </template>
    <el-space wrap>
      <el-card
        v-for="item in swiperExample"
        :key="item.id"
        :class="['mt-4', !deviceDetection() && 'ml-16']"
      >
        <template #header>
          {{ item.label }}
        </template>
        <component :is="item.component" />
      </el-card>
    </el-space>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-card__body) {
  overflow: auto;
}

@media screen and (width <= 750px) {
  :deep(.el-card__body) {
    padding: 12px;
  }

  .main-content {
    margin: 0 !important;
  }
}
</style>
