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
      background-image: url(&quot;https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/chatai/lofi.png&quot;);
      background-size: cover;
    "
    :messageStyles="{
      default: {
        user: {
          bubble: {
            background:
              'linear-gradient(90deg, rgb(225 37 255) 0%, rgb(161, 99, 233) 100%)',
            color: 'white'
          }
        },
        ai: {
          bubble: {
            background:
              'linear-gradient(90deg, rgb(0, 162, 255) 30%, rgb(197 119 255) 100%)',
            color: 'white'
          }
        }
      },
      loading: {
        message: {
          styles: {
            bubble: {
              background:
                'linear-gradient(90deg, rgb(0, 162, 255) 30%, rgb(197 119 255) 100%)',
              color: 'white'
            }
          }
        }
      }
    }"
    :textInput="{
      placeholder: { text: '发送消息' },
      styles: {
        container: {
          backgroundColor: 'rgb(239 245 255)',
          color: '#0d008d'
        }
      }
    }"
    :submitButtonStyles="{
      submit: {
        svg: {
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(6989%) hue-rotate(288deg) brightness(107%) contrast(122%)'
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
      background-color: #54a7ff;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-track {
      background-color: unset;
    }"
    :history="[
      { text: '公认的最减肥运动推荐一个？', role: 'user' },
      {
        text: '公认的最减肥运动之一是高强度间歇训练（HIIT），它通过短时间内的高强度运动和短暂休息交替进行，不仅在运动过程中燃烧大量卡路里，还能通过“后燃效应”让身体在运动结束后继续消耗热量。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
