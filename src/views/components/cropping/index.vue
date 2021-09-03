<template>
  <div style="margin: 10px">
    <div class="cropper-container">
      <Cropper ref="refCropper" :width="'40vw'" :src="img" />
      <img :src="cropperImg" class="croppered" v-if="cropperImg" />
    </div>
    <el-button type="primary" @click="onCropper">裁剪</el-button>
    <p v-if="cropperImg">裁剪后图片信息：{{ info }}</p>
  </div>
</template>

<script lang="ts">
import { ref, nextTick, getCurrentInstance } from "vue";
import Cropper from "/@/components/ReCropper";
import img from "./picture.jpeg";

export default {
  name: "reCropping",
  components: {
    Cropper
  },
  setup() {
    const instance = getCurrentInstance();
    let info = ref("");
    let cropperImg = ref("");

    const onCropper = (): void => {
      nextTick(() => {
        instance.refs.refCropper.cropper.getCroppedCanvas().toBlob(blob => {
          let fileReader: FileReader = new FileReader();
          fileReader.onloadend = (e: any) => {
            cropperImg.value = e.target.result;
            info.value = instance.refs.refCropper.cropper.getData();
          };
          fileReader.readAsDataURL(blob);
        }, "image/jpeg");
      });
    };

    return {
      img,
      info,
      cropperImg,
      onCropper
    };
  }
};
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
