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
    style="
      border-radius: 10px;
      border: unset;
      background-image: url(&quot;https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/chatai/blue.jpg&quot;);
      background-size: cover;
    "
    :messageStyles="{
      default: {
        user: {
          bubble: { backgroundColor: '#2670ff' }
        },
        ai: { bubble: { backgroundColor: '#004f97', color: 'white' } }
      }
    }"
    :submitButtonStyles="{
      submit: {
        svg: {
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(60%) sepia(79%) saturate(643%) hue-rotate(185deg) brightness(102%) contrast(100%)'
            }
          }
        }
      }
    }"
    :textInput="{
      styles: {
        container: {
          backgroundColor: '#004f97',
          color: 'white',
          boxShadow: 'unset'
        }
      },
      placeholder: { text: '发送消息', style: { color: '#d1d1d1' } }
    }"
    auxiliaryStyle="
    ::-webkit-scrollbar-thumb {
      background-color: #0174db;
    }
    ::-webkit-scrollbar-track {
      background-color: unset;
    }"
    :history="[
      { text: '熬夜都有哪些坏处？', role: 'user' },
      {
        text: '熬夜会损害身体健康，导致免疫力下降、精神不振和工作效率降低。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
