<script setup lang="ts">
import WaveSurfer from "wavesurfer.js";
import { getTime } from "@pureadmin/utils";
import { Play, Pause, Forward, Rewind } from "./svg";
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({
  name: "Wavesurfer"
});

const loading = ref(true);
const wavesurfer = ref(null);
const wavesurferRef = ref();
// 音频总时长（格式化后 mm:ss）
const totalTime = ref();
// 音频总时长（单位秒）
const totalSecondTime = ref();
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
    const { decodedData } = wavesurfer.value;
    totalSecondTime.value = decodedData.duration;
    const { m, s } = getTime(decodedData.duration);
    totalTime.value = `${m}:${s}`;
    // 光标位置取中
    wavesurfer.value.setTime(decodedData.duration / 2);
    // 设置音频音量（范围0-1）
    // wavesurfer.value.setVolume(1);
  });

  // 音频位置改变时，播放期间连续触发
  wavesurfer.value.on("timeupdate", timer => {
    if (timer > totalSecondTime.value) return;
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
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/wavesurfer"
        target="_blank"
      >
        代码位置 src/views/able/wavesurfer
      </el-link>
    </template>
    <div
      v-loading="loading"
      class="w-8/12 !m-auto !mt-[20px]"
      element-loading-background="transparent"
    >
      <div ref="wavesurferRef" />
      <div v-show="totalTime" class="flex justify-between">
        <span class="text-[#81888f]">00:00</span>
        <h1 class="text-4xl mt-2">{{ curTime }}</h1>
        <span class="text-[#81888f]">{{ totalTime }}</span>
      </div>
      <div v-show="totalTime" class="flex mt-2 w-[180px] justify-around m-auto">
        <Rewind
          v-tippy="{
            content: '快退（可长按）',
            placement: 'bottom'
          }"
          v-longpress:0:100="() => wavesurfer?.skip(-1)"
          class="cursor-pointer"
        />
        <div
          v-tippy="{
            content: isPlay ? '暂停' : '播放',
            placement: 'bottom'
          }"
          class="cursor-pointer"
          @click="wavesurfer?.playPause()"
        >
          <Play v-if="isPlay" v-motion-pop />
          <Pause v-else v-motion-pop />
        </div>
        <Forward
          v-tippy="{
            content: '快进（可长按）',
            placement: 'bottom'
          }"
          v-longpress:0:100="() => wavesurfer?.skip(1)"
          class="cursor-pointer"
        />
      </div>
    </div>
  </el-card>
</template>
