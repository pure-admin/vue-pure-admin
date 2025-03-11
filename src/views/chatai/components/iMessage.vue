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
      font-size: 16px;
      font-family:
        system-ui, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif,
        &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;,
        &quot;Segoe UI Symbol&quot;;
    "
    :messageStyles="{
      default: {
        shared: {
          bubble: {
            maxWidth: '75%',
            borderRadius: '1em',
            padding: '.42em .7em',
            fontSize: '15px'
          }
        },
        user: { bubble: { backgroundColor: '#00c82a' } }
      },
      loading: {
        message: {
          styles: {
            bubble: { padding: '0.6em 0.75em 0.6em 1.3em' }
          }
        }
      }
    }"
    :submitButtonStyles="{
      submit: {
        container: {
          default: {
            width: '0.95em',
            height: '0.95em',
            justifyContent: 'center',
            display: 'flex',
            borderRadius: '25px',
            padding: '0.3em',
            backgroundColor: '#00c82a'
          }
        },
        svg: {
          content:
            '<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 115.4 122.88&quot;><path d=&quot;M24.94,67.88A14.66,14.66,0,0,1,4.38,47L47.83,4.21a14.66,14.66,0,0,1,20.56,0L111,46.15A14.66,14.66,0,0,1,90.46,67.06l-18-17.69-.29,59.17c-.1,19.28-29.42,19-29.33-.25L43.14,50,24.94,67.88Z&quot;/></svg>',
          styles: {
            default: {
              filter:
                'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(315deg) brightness(99%) contrast(102%)',
              transform: 'scale(0.95)'
            }
          }
        }
      }
    }"
    :textInput="{
      placeholder: { text: '发送消息' },
      styles: {
        container: {
          boxShadow: 'none',
          borderRadius: '1em',
          border: '1px solid rgba(0,0,0,0.2)'
        },
        text: {
          padding: '0.4em 0.8em',
          paddingRight: '2.5em'
        }
      }
    }"
    :images="true"
    :dropupStyles="{
      button: {
        styles: {
          container: {
            default: {
              width: '1.6em',
              height: '1.6em',
              borderRadius: '25px',
              backgroundColor: '#8282821a'
            }
          },
          svg: {
            styles: {
              default: {
                width: '1em',
                left: '5px',
                top: '0.2em',
                filter:
                  'brightness(0) saturate(100%) invert(56%) sepia(0%) saturate(2755%) hue-rotate(104deg) brightness(96%) contrast(93%)'
              }
            },
            content:
              '<?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?><svg viewBox=&quot;0 0 24 24&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><path d=&quot;M3,11h8V3a1,1,0,0,1,2,0v8h8a1,1,0,0,1,0,2H13v8a1,1,0,0,1-2,0V13H3a1,1,0,0,1,0-2Z&quot;/></svg>'
          }
        }
      }
    }"
    :attachmentContainerStyle="{
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '5px 5px 0 0',
      border: '1px solid rgba(0,0,0,0.2)',
      top: '-2.6em',
      height: '4em'
    }"
    :history="[
      { text: '钓鱼需要准备什么东西？', role: 'user' },
      {
        text: '钓鱼需要准备鱼竿、渔轮、钓线、鱼钩、浮漂、铅坠和适合的饵料。',
        role: 'ai'
      }
    ]"
    :demo="true"
    :connect="{ stream: true }"
  />
</template>
