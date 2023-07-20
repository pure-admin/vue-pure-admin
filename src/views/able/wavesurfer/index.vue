<script setup lang="ts">
import WaveSurfer from "wavesurfer.js";
import { getTime } from "@pureadmin/utils";
import { Play, Pause, Forward, Rewind } from "./svg";
import { ref, onMounted, onBeforeUnmount } from "vue";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { directive as tippy } from "vue-tippy";

defineOptions({
  name: "Wavesurfer"
});

const vTippy = tippy;
const loading = ref(true);
const wavesurfer = ref(null);
const wavesurferRef = ref();
// 音频总时长
const totalTime = ref();
// 音频当前播放位置时长
const curTime = ref();
// 音频是否正在播放
const isPlay = ref(false);

const { VITE_PUBLIC_PATH } = import.meta.env;
const url = `${VITE_PUBLIC_PATH}audio/海阔天空.mp3`;

function init() {
  wavesurfer.value = WaveSurfer.create({
    container: wavesurferRef.value,
    height: "auto",
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    cursorColor: "rgb(64, 158, 255)",
    cursorWidth: 4,
    // backend: "MediaElement",
    url
  });

  // 音频被解码后触发
  wavesurfer.value.on("decode", () => (loading.value = false));

  // 当音频已解码并可以播放时触发
  wavesurfer.value.on("ready", () => {
    if (!wavesurfer.value) return;
    const { duration } = wavesurfer.value;
    const { m, s } = getTime(duration);
    totalTime.value = `${m}:${s}`;
    // 光标位置取中
    wavesurfer.value.setTime(duration / 2);
    // 设置音频音量（范围0-1）
    // wavesurfer.value.setVolume(1);
  });

  // 音频位置改变时，播放期间连续触发
  wavesurfer.value.on("timeupdate", timer => {
    const { m, s } = getTime(timer);
    curTime.value = `${m}:${s}`;
  });

  // 音频播放时触发
  wavesurfer.value.on("play", () => (isPlay.value = true));

  // 音频暂停时触发
  wavesurfer.value.on("pause", () => (isPlay.value = false));
}

onMounted(init);

onBeforeUnmount(() => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy();
    wavesurfer.value = null;
  }
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          音频可视化，采用开源的
          <el-link
            href="https://wavesurfer-js.org/"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            wavesurfer.js
          </el-link>
          <span class="text-[red]">
            （温馨提示：音频默认最大声音，播放时请调低电脑声音，以免影响到您）
          </span>
        </span>
      </div>
    </template>
    <div
      v-loading="loading"
      class="w-8/12 !m-auto !mt-[20px]"
      element-loading-background="transparent"
    >
      <div ref="wavesurferRef" />
      <div class="flex justify-between" v-show="totalTime">
        <span class="text-[#81888f]">00:00</span>
        <h1 class="text-4xl mt-2">{{ curTime }}</h1>
        <span class="text-[#81888f]">{{ totalTime }}</span>
      </div>
      <div class="flex mt-2 w-[180px] justify-around m-auto" v-show="totalTime">
        <Rewind
          class="cursor-pointer"
          v-tippy="{
            content: '快退（可长按）',
            placement: 'bottom',
            animation: 'scale'
          }"
          v-longpress:0:100="() => wavesurfer?.skip(-1)"
        />
        <div
          class="cursor-pointer"
          v-tippy="{
            content: isPlay ? '暂停' : '播放',
            placement: 'bottom',
            animation: 'scale'
          }"
          @click="wavesurfer?.playPause()"
        >
          <Play v-if="isPlay" v-motion-pop />
          <Pause v-else v-motion-pop />
        </div>
        <Forward
          class="cursor-pointer"
          v-tippy="{
            content: '快进（可长按）',
            placement: 'bottom',
            animation: 'scale'
          }"
          v-longpress:0:100="() => wavesurfer?.skip(1)"
        />
      </div>
    </div>
  </el-card>
</template>
