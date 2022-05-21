<script setup lang="ts">
import { onMounted } from "vue";
import Player from "xgplayer/dist/simple_player";
import volume from "xgplayer/es/controls/volume";
import screenShot from "xgplayer/es/controls/screenShot";
import { deviceDetection } from "/@/utils/deviceDetection";
import playbackRate from "xgplayer/es/controls/playbackRate";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "Video"
});

onMounted(() => {
  new Player({
    id: "mse",
    // 默认静音
    volume: 0,
    autoplay: false,
    screenShot: true,
    url: "https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4",
    poster:
      "https://s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg",
    fluid: deviceDetection(),
    controlPlugins: [volume, playbackRate, screenShot],
    //传入倍速可选数组
    playbackRate: [0.5, 0.75, 1, 1.5, 2]
  });
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          视频组件，采用开源的
          <el-link
            href="https://v2.h5player.bytedance.com"
            target="_blank"
            :icon="useRenderIcon('video-play')"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            西瓜播放器
          </el-link></span
        >
      </div>
    </template>
    <div id="mse" />
  </el-card>
</template>

<style scoped>
#mse {
  flex: auto;
}
</style>
