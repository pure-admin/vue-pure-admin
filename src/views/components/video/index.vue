<template>
  <div id="mse"></div>
</template>

<script lang='ts'>
import { onMounted } from "vue";
import Player from "xgplayer/dist/simple_player";
import { volume, playbackRate, screenShot } from "xgplayer/dist/controls";

export interface deviceInter {
  match: any;
}
export default {
  setup() {
    // 检测设备类型(手机返回true,反之)
    const deviceDetection = () => {
      let sUserAgent: deviceInter = navigator.userAgent.toLowerCase();
      let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      let bIsMidp = sUserAgent.match(/midp/i) == "midp";
      let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      let bIsAndroid = sUserAgent.match(/android/i) == "android";
      let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      return bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
        ? true
        : false;
    };

    onMounted(() => {
      console.log("---", deviceDetection());
      let player = new Player({
        id: "mse",
        autoplay: false,
        screenShot: true,
        url:
          "https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4",
        poster:
          "https://s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg",
        fluid: deviceDetection() ? true : false,
        controlPlugins: [volume, playbackRate, screenShot],
        playbackRate: [0.5, 0.75, 1, 1.5, 2], //传入倍速可选数组
      });
    });
    return {};
  },
};
</script>

<style lang="scss" scoped>
#mse {
  flex: auto;
}
</style>
