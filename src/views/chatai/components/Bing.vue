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
      background: linear-gradient(
        90deg,
        rgb(239 242 247) 0%,
        7.6029%,
        rgb(237 240 249) 15.2057%,
        20.7513%,
        rgb(235 239 248) 26.297%,
        27.6386%,
        rgb(235 239 248) 28.9803%,
        38.2826%,
        rgb(231 237 249) 47.585%,
        48.1216%,
        rgb(230 236 250) 48.6583%,
        53.1306%,
        rgb(228 236 249) 57.6029%,
        61.5385%,
        rgb(227 234 250) 65.4741%,
        68.7835%,
        rgb(222 234 250) 72.093%,
        75.7603%,
        rgb(219 230 248) 79.4275%,
        82.8265%,
        rgb(216 229 248) 86.2254%,
        87.8354%,
        rgb(213 228 249) 89.4454%,
        91.8605%,
        rgb(210 226 249) 94.2755%,
        95.4383%,
        rgb(209 225 248) 96.6011%,
        98.3005%,
        rgb(208 224 247) 100%
      );
      border-color: #e4e4e4;
      border-radius: 10px;
    "
    :textInput="{
      styles: {
        container: {
          borderRadius: '20px',
          border: 'unset',
          width: '78%',
          marginLeft: '-15px',
          boxShadow:
            '0px 0.3px 0.9px rgba(0, 0, 0, 0.12), 0px 1.6px 3.6px rgba(0, 0, 0, 0.16)'
        },
        text: { padding: '10px', paddingLeft: '15px', paddingRight: '34px' }
      },
      placeholder: { text: '发送消息', style: { color: '#606060' } }
    }"
    :messageStyles="{
      default: {
        shared: {
          bubble: {
            backgroundColor: 'unset',
            marginTop: '10px',
            marginBottom: '10px',
            boxShadow:
              '0px 0.3px 0.9px rgba(0, 0, 0, 0.12), 0px 1.6px 3.6px rgba(0, 0, 0, 0.16)'
          }
        },
        user: {
          bubble: {
            background: 'linear-gradient(130deg, #2870EA 20%, #1B4AEF 77.5%)'
          }
        },
        ai: { bubble: { background: 'rgba(255,255,255,0.7)' } }
      }
    }"
    :submitButtonStyles="{
      position: 'outside-right',
      submit: {
        container: {
          default: {
            bottom: '0.8em',
            borderRadius: '25px',
            padding: '6px 5px 4px',
            backgroundColor: 'unset'
          },
          hover: { backgroundColor: '#b0deff4f' },
          click: { backgroundColor: '#b0deffb5' }
        },
        svg: {
          content:
            '<?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?> <svg viewBox=&quot;0 0 24 24&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><path d=&quot;m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z&quot;/></svg>',
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(10%) sepia(86%) saturate(6044%) hue-rotate(205deg) brightness(100%) contrast(100%)'
            }
          }
        }
      },
      loading: {
        svg: {
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(72%) sepia(0%) saturate(3044%) hue-rotate(322deg) brightness(100%) contrast(96%)'
            }
          }
        }
      },
      stop: {
        container: { hover: { backgroundColor: '#ededed94' } },
        svg: {
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(72%) sepia(0%) saturate(3044%) hue-rotate(322deg) brightness(100%) contrast(96%)'
            }
          }
        }
      }
    }"
    :history="[
      { text: '赵云是谁？', role: 'user' },
      {
        text: '赵云（约168年－229年），字子龙，是三国时期蜀汉的重要将领，以其忠诚和勇敢著称。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
