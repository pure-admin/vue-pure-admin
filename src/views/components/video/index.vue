<script setup lang="ts">
import { onMounted } from "vue";
import Player from "xgplayer/dist/simple_player";
import volume from "xgplayer/es/controls/volume";
import playbackRate from "xgplayer/es/controls/playbackRate";
import screenShot from "xgplayer/es/controls/screenShot";
import { deviceDetection } from "/@/utils/deviceDetection";

onMounted(() => {
  new Player({
    id: "mse",
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
  <div id="mse"></div>
</template>

<style scoped>
#mse {
  flex: auto;
}
</style>
