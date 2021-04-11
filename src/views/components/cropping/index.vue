<template>
  <div style="margin: 10px">
    <div class="cropper-container">
      <cropperImage ref="refCropper" :src="img" @cropperedInfo="cropperedInfo" style="width:45%" />
      <img :src="cropperImg" class="croppered" v-if="cropperImg" />
    </div>
    <el-button type="primary" @click="onCropper">裁剪</el-button>
    <p v-if="cropperImg">裁剪后图片信息：{{ info }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeMount, getCurrentInstance } from "vue";
import cropperImage from "../../../components/cropper/index.vue";
import img from "./picture.jpeg";
export default defineComponent({
  components: {
    cropperImage
  },
  setup() {
    let vm: any;
    let info = ref("");
    let cropperImg = ref("");

    const onCropper = (): void => {
      vm.refs.refCropper.croppered();
    };

    onBeforeMount(() => {
      vm = getCurrentInstance();
    });

    function cropperedInfo({ imgBase64, imgInfo }) {
      info.value = imgInfo;
      cropperImg.value = imgBase64;
    }

    return {
      img,
      info,
      cropperImg,
      onCropper,
      cropperedInfo
    };
  }
});
</script>

<style scoped>
.cropper-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-button {
  margin-top: 10px;
}
.croppered {
  display: block;
  width: 45%;
  height: 360px;
}
</style>
