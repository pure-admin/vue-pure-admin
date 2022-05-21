<script setup lang="ts">
import { ref, nextTick, getCurrentInstance } from "vue";
import Cropper from "/@/components/ReCropper";
import img from "./picture.jpeg";

defineOptions({
  name: "Cropping"
});

let info = ref<object>(null);
let cropperImg = ref<string>("");
const instance = getCurrentInstance();

const onCropper = (): void => {
  nextTick(() => {
    // @ts-expect-error
    instance.refs.refCropper.cropper.getCroppedCanvas().toBlob(blob => {
      let fileReader: FileReader = new FileReader();
      fileReader.onloadend = (e: ProgressEvent) => {
        // @ts-ignore
        cropperImg.value = e.target.result;
        // @ts-expect-error
        info.value = instance.refs.refCropper.cropper.getData();
      };
      fileReader.readAsDataURL(blob);
    }, "image/jpeg");
  });
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">图片裁剪组件</span>
      </div>
    </template>
    <div class="cropper-container">
      <Cropper ref="refCropper" :width="'40vw'" :src="img" />
      <img :src="cropperImg" class="croppered" v-if="cropperImg" />
    </div>
    <el-button type="primary" @click="onCropper">裁剪</el-button>
    <p v-if="cropperImg">裁剪后图片信息：{{ info }}</p>
  </el-card>
</template>

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
