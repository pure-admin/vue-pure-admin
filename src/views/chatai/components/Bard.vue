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
      background-color: #f3f6fc;
      border-color: #dcdcdc;
      border-radius: 10px;
    "
    :textInput="{
      styles: {
        container: {
          borderRadius: '20px',
          border: '1px solid #969696',
          boxShadow: 'unset',
          width: '78%',
          marginLeft: '-15px'
        },
        text: { padding: '10px', paddingLeft: '15px', paddingRight: '34px' }
      },
      placeholder: { text: '发送消息', style: { color: '#bcbcbc' } }
    }"
    :messageStyles="{
      default: {
        shared: {
          bubble: {
            maxWidth: '100%',
            backgroundColor: 'unset',
            marginTop: '10px',
            marginBottom: '10px'
          }
        },
        user: { bubble: { marginLeft: '0px', color: 'black' } },
        ai: {
          innerContainer: { borderRadius: '15px', backgroundColor: 'white' }
        }
      }
    }"
    :avatars="{
      default: {
        styles: {
          position: 'left',
          container: { marginLeft: '12px', marginRight: '5px' }
        }
      },
      ai: {
        src: 'https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/chatai/gemini.png',
        styles: { position: 'left', avatar: { paddingTop: '6px' } }
      }
    }"
    :speechToText="{
      webSpeech: { language: 'zh-CN' },
      button: {
        default: {
          container: {
            default: {
              bottom: '1em',
              right: '0.6em',
              borderRadius: '20px',
              width: '1.9em',
              height: '1.9em'
            }
          },
          svg: { styles: { default: { bottom: '0.35em', left: '0.35em' } } }
        },
        position: 'inside-right'
      }
    }"
    :submitButtonStyles="{
      position: 'outside-right',
      submit: {
        container: {
          default: {
            bottom: '0.9em',
            borderRadius: '25px',
            padding: '6px 5px 4px',
            backgroundColor: '#f3f6fc'
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
        container: { hover: { backgroundColor: '#ededed' } },
        svg: {
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(59%) sepia(0%) saturate(0%) hue-rotate(348deg) brightness(96%) contrast(93%)'
            }
          }
        }
      }
    }"
    :history="[
      { text: '韩信是谁？', role: 'user' },
      {
        text: '韩信（约前231年－前196年），是秦末汉初时期的杰出军事家和战略家，被后世誉为“兵仙”。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
