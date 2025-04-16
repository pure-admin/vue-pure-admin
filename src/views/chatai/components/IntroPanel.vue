<script setup lang="ts">
import "deep-chat";
import { ref, onMounted } from "vue";

const chatRef = ref();

onMounted(() => {
  chatRef.value.demo = {
    response: message => {
      console.log(message);
      return {
        text: "仅演示，如需AI服务，请参考 https://deepchat.dev/docs/connect"
      };
    }
  };
});
</script>

<template>
  <deep-chat
    ref="chatRef"
    :textInput="{
      placeholder: { text: '发送消息' }
    }"
    demo="true"
    style="border-radius: 8px"
  >
    <div
      style="
        display: none;
        width: 200px;
        padding: 12px;
        padding-bottom: 15px;
        background-color: #f3f3f3;
        border-radius: 10px;
      "
    >
      <div>
        <div style="margin-bottom: 8px; font-size: 16px; text-align: center">
          <b>简介面板</b>
        </div>
        <div style="font-size: 15px; line-height: 20px">
          插入描述以帮助您的用户了解如何使用该组件
        </div>
      </div>
    </div>
  </deep-chat>
</template>
