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
    style="border-radius: 10px"
    :textInput="{
      styles: {
        container: {
          width: '100%',
          margin: '0',
          border: 'unset',
          borderTop: '1px solid #d5d5d5',
          borderRadius: '0px',
          boxShadow: 'unset'
        },
        text: {
          fontSize: '1.05em',
          paddingTop: '11px',
          paddingBottom: '13px',
          paddingLeft: '12px',
          paddingRight: '2.4em'
        }
      },
      placeholder: { text: '发送消息', style: { color: '#bcbcbc' } }
    }"
    :submitButtonStyles="{
      submit: {
        container: {
          default: {
            transform: 'scale(1.21)',
            marginBottom: '-3px',
            marginRight: '0.4em'
          }
        }
      }
    }"
    :history="[
      { text: '预防心梗、脑梗的方法？', role: 'user' },
      {
        text: '预防心梗和脑梗的关键方法包括保持健康的生活方式，如均衡饮食、定期锻炼、控制血压和血脂、戒烟限酒以及管理压力。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
