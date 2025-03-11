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
    :messageStyles="{
      default: { user: { bubble: { backgroundColor: '#ff2020' } } }
    }"
    :avatars="{
      ai: {
        src: 'https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/chatai/robot.png'
      }
    }"
    :submitButtonStyles="{
      submit: {
        svg: {
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(15%) sepia(50%) saturate(6203%) hue-rotate(352deg) brightness(111%) contrast(127%)'
            }
          }
        }
      }
    }"
    :textInput="{
      styles: {
        container: {
          border: '1px solid #ffd9d9',
          backgroundColor: '#fffcfc'
        }
      },
      placeholder: { text: '发送消息' }
    }"
    auxiliaryStyle="
    ::-webkit-scrollbar-thumb {
      background-color: red;
    }"
    :history="[
      { text: '健身的最佳时间？', role: 'user' },
      {
        text: '健身的最佳时间是根据个人作息和偏好而定，但一般建议在下午或傍晚进行锻炼以达到最佳状态。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
