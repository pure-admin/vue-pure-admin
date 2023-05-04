<script setup lang="ts">
import { danmus as danmusData, getDanmuData } from "./danmu.js";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import VueDanmaku from "vue3-danmaku";

defineOptions({
  name: "Danmaku"
});

const danmaku = ref();
const danmus = ref<any[]>(getDanmuData());
const danmuMsg = ref<string>("");
let timer = 0;
const config = reactive({
  channels: 5, // 轨道数量，为0则弹幕轨道数会撑满容器
  useSlot: true, // 是否开启slot
  loop: true, // 是否开启弹幕循环
  speeds: 200, // 弹幕速度，实际为弹幕滚动完一整屏的秒数，值越小速度越快
  fontSize: 20, // 文本模式下的字号
  top: 10, // 弹幕轨道间的垂直间距
  right: 0, // 同一轨道弹幕的水平间距
  debounce: 100, // 弹幕刷新频率（多少毫秒插入一条弹幕，建议不小于50）
  randomChannel: true // 随机弹幕轨道
});

onMounted(() => {
  window.onresize = () => resizeHandler();
});

onUnmounted(() => {
  window.onresize = null;
});

function play(type: string) {
  switch (type) {
    case "play":
      danmaku.value.play();
      break;
    case "pause":
      danmaku.value.pause();
      break;
    case "stop":
      danmaku.value.stop();
      break;
    case "show":
      danmaku.value.show();
      break;
    case "hide":
      danmaku.value.hide();
      break;
    case "reset":
      danmaku.value.reset();
      break;
    default:
      break;
  }
}

function switchSlot(slot: boolean) {
  config.useSlot = slot;
  danmus.value = slot ? getDanmuData() : danmusData;

  setTimeout(() => {
    danmaku.value.stop();
    danmaku.value.play();
  });
}
function speedsChange(val: number) {
  if (config.speeds <= 10 && val === -10) {
    return;
  }
  config.speeds += val;
  danmaku.value.reset();
}
function fontChange(val: number) {
  config.fontSize += val;
  danmaku.value.reset();
}
function channelChange(val: number) {
  if (!config.channels && val === -1) {
    return;
  }
  config.channels += val;
}
function resizeHandler() {
  if (timer) clearTimeout(timer);
  timer = window.setTimeout(() => {
    danmaku.value.resize();
  }, 500);
}
function addDanmu() {
  if (!danmuMsg.value) return;
  const _danmuMsg = config.useSlot
    ? {
        avatar: "https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg",
        name: "你",
        text: danmuMsg.value
      }
    : danmuMsg.value;
  danmaku.value.add(_danmuMsg);
  danmuMsg.value = "";
}
</script>
<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          弹幕组件，采用开源的
          <el-link
            href="https://github.com/hellodigua/vue-danmaku/tree/vue3"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            vue3-danmaku
          </el-link>
        </span>
      </div>
    </template>
    <div class="flex gap-5">
      <vue-danmaku
        ref="danmaku"
        class="demo"
        v-model:danmus="danmus"
        isSuspend
        v-bind="config"
      >
        <!-- 弹幕slot -->
        <template v-slot:dm="{ danmu, index }">
          <div class="danmu-item">
            <img class="img" :src="danmu.avatar" />
            <span>{{ index }}{{ danmu.name }}：</span>
            <span>{{ danmu.text }}</span>
          </div>
        </template>
      </vue-danmaku>
      <div class="main">
        <p>
          播放：
          <el-button @click="play('play')">播放</el-button>
          <el-button @click="play('pause')">暂停</el-button>
          <el-button @click="play('stop')">停止</el-button>
        </p>
        <p>
          模式：
          <el-button @click="switchSlot(true)">弹幕 slot</el-button>
          <el-button @click="switchSlot(false)">普通文本</el-button>
        </p>
        <p>
          显示：
          <el-button @click="play('show')">显示</el-button>
          <el-button @click="play('hide')">隐藏</el-button>
        </p>
        <p>
          速度：
          <el-button @click="speedsChange(-10)">减速</el-button>
          <el-button @click="speedsChange(10)">增速</el-button>
          <span class="ml-5">当前速度：{{ config.speeds }}像素/s</span>
        </p>
        <p>
          字号：
          <el-button :disabled="config.useSlot" @click="fontChange(-1)">
            缩小
          </el-button>
          <el-button :disabled="config.useSlot" @click="fontChange(1)">
            放大
          </el-button>
          <span class="ml-5">当前字号：{{ config.fontSize }}px</span>
        </p>
        <p>
          轨道：
          <el-button @click="channelChange(-1)">-1</el-button>
          <el-button @click="channelChange(1)">+1</el-button>
          <el-button @click="channelChange(-config.channels)"> 填满 </el-button>
          <span class="ml-5">当前轨道：{{ config.channels }}</span>
        </p>
        <p class="flex">
          <el-input
            type="text"
            placeholder="输入评论后，回车发送弹幕"
            v-model="danmuMsg"
            @keyup.enter="addDanmu"
          />
        </p>
      </div>
    </div>
  </el-card>
</template>
<style lang="scss">
.demo {
  flex: 1;
  height: 600px;
  background: linear-gradient(45deg, #5ac381, #20568b);

  .danmu-item {
    display: flex;
    align-items: center;

    .img {
      width: 25px;
      height: 25px;
      margin-right: 5px;
      border-radius: 50%;
    }
  }
}

.main {
  flex: 1;

  p {
    margin-top: 10px;
  }
}
</style>
