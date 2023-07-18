<script setup lang="ts">
import { emitter } from "@/utils/mitt";
import { useLoader } from "@pureadmin/utils";
import { CanvasRenderer } from "./canvasRenderer";
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({
  name: "VideoFrame"
});

const num = 200;
const curImg = ref("");
const renderer = ref();
const captureUtil = ref();
const loading = ref(false);
const { loadScript } = useLoader();

const { VITE_PUBLIC_PATH } = import.meta.env;
const getPath = path => `${VITE_PUBLIC_PATH}wasm/${path}`;
const src = getPath("index.js");
const workerPath = getPath("capture.worker.js");
const wasmPath = getPath("capture.worker.wasm");

loadScript({
  src
}).then(mgs => {
  if (mgs === "success") {
    // @ts-expect-error
    captureUtil.value = cheetahCapture.initCapture({
      workerPath,
      wasmPath
    });
  }
});

onMounted(() => {
  renderer.value = new CanvasRenderer("canvas-container");
  emitter.on("imageInfo", info => (curImg.value = info.img.src));
});

function beforeUpload(file) {
  curImg.value = "";
  loading.value = true;
  renderer.value.clearImages();
  // api参考 https://github.com/wanwu/cheetah-capture#api
  captureUtil.value.then(res => {
    res.capture({
      // 视频文件
      file,
      // 抽取指定数目的帧图片，传递`number`是按照数目抽帧，传递数组是指定抽帧的时间，单位毫秒（抽帧策略：https://github.com/wanwu/cheetah-capture/issues/6#issuecomment-1634384486）
      info: 16,
      // 当抽帧结果变化的回调
      onChange: (list, { url }) => {
        renderer.value.addImage(url, num * list.url.length, 0, num, num);
      },
      // 当抽帧结束并成功的回调
      onSuccess: () => {
        renderer.value.addListener();
        // 默认选中第一张
        renderer.value.drawTick({ offsetX: num / 2, offsetY: num / 2 });
        loading.value = false;
      },
      // 当抽帧过程出现错误的回调
      onError: () => {
        loading.value = false;
      }
    });
  });

  return false;
}

onBeforeUnmount(() => {
  // 解绑`imageInfo`公共事件，防止多次触发
  emitter.off("imageInfo");
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          <p>
            基于自定义编译
            <el-link
              href="https://github.com/FFmpeg/FFmpeg"
              target="_blank"
              style="margin: 0 4px 5px; font-size: 16px"
            >
              FFmpeg
            </el-link>
            的截帧工具，支持MP4、MOV、AVI、WebM、MKV等主流格式，支持
            H.264（AVC）、H.265（HEVC）、MPEG-2、MPEG-4、VP8、VP9、WMV3编码格式
          </p>
          当然还可以支持更多视频格式，只要FFmpeg支持的，按理都能支持，您也可参考
          <el-link
            href="https://github.com/wanwu/cheetah-capture"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            cheetah-capture
          </el-link>
          和
          <el-link
            href="https://github.com/jordiwang/web-capture"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            web-capture
          </el-link>
          修改并编译wasm等文件（强烈推荐在Ubuntu系统进行编译）
          <p>
            mac系统推荐安装
            <el-link
              href="https://github.com/utmapp/UTM"
              target="_blank"
              style="margin: 0 4px 5px; font-size: 16px"
            >
              UTM
            </el-link>
            虚拟机，windows系统推荐安装VMware虚拟机
          </p>
          <p>
            当然这只是一个视频帧截取工具，如果您想要更多操作可以研究下
            <el-link
              href="https://ffmpegwasm.netlify.app/"
              target="_blank"
              style="margin: 0 4px 5px; font-size: 16px"
            >
              ffmpeg.wasm
            </el-link>
            ，它是基于 FFmpeg 的纯 WebAssembly / JavaScript
            工具，可以在浏览器内进行视频和音频录制、转换和流式传输等，不过通过一些实践，对于时长较长的视频性能还是不太行，不过用于时长较短的短视频还是可以上生产的
          </p>
        </span>
      </div>
    </template>
    <div class="flex flex-wrap">
      <el-upload
        drag
        :show-file-list="false"
        accept=".mp4,.mov,.avi,.webm,.mkv"
        :before-upload="beforeUpload"
      >
        <div class="el-upload__text">
          可拖拽上传视频（默认截取16张帧图片，可在代码中自行修改）
        </div>
      </el-upload>
      <el-image
        v-if="curImg"
        :src="curImg"
        :preview-src-list="Array.of(curImg)"
        class="w-[180px] h-[180px] ml-2 rounded-[6px]"
      />
    </div>
    <div
      v-loading="loading"
      element-loading-text="温馨提示：可左右拖拽图片并单击选取所需的帧图片"
      id="canvas-container"
      class="w-full h-[200px] overflow-hidden mt-6"
    />
  </el-card>
</template>

<style scoped lang="scss">
::v-deep(.el-upload-dragger) {
  display: flex;
  align-items: center;
  height: 180px;
}
</style>
