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
    style="border-radius: 8px"
    :speechToText="{
      webSpeech: { language: 'zh-CN' },
      button: { position: 'outside-left' }
    }"
    :textInput="{
      placeholder: { text: '发送消息' }
    }"
    :introMessage="{
      text: '单击左下角麦克风开始转录您的讲话。'
    }"
    :demo="true"
  />
</template>
