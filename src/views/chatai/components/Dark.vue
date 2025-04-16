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
    style="background-color: #292929; border: unset; border-radius: 10px"
    :messageStyles="{
      default: {
        ai: { bubble: { backgroundColor: '#545454', color: 'white' } }
      },
      loading: {
        message: {
          styles: {
            bubble: { backgroundColor: '#545454', color: 'white' }
          }
        }
      }
    }"
    :textInput="{
      styles: {
        container: {
          backgroundColor: '#666666',
          border: 'unset',
          color: '#e8e8e8'
        }
      },
      placeholder: {
        text: '发送消息',
        style: { color: '#bcbcbc' }
      }
    }"
    :submitButtonStyles="{
      submit: {
        container: {
          default: { bottom: '0.7rem' }
        },
        svg: {
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(70%) sepia(52%) saturate(5617%) hue-rotate(185deg) brightness(101%) contrast(101%)'
            }
          }
        }
      }
    }"
    auxiliaryStyle="
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-track {
      background-color: unset;
    }"
    :history="[
      { text: '什么水果适合减脂期间吃？', role: 'user' },
      {
        text: '减脂期间适合吃苹果、柑橘类水果、蓝莓和草莓等低热量、高纤维的水果，有助于增加饱腹感并促进新陈代谢。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
