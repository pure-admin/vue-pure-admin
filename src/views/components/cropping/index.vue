<script setup lang="ts">
import { ref, nextTick } from "vue";
import Cropper from "@/components/ReCropper";
import img from "./picture.jpeg";

defineOptions({
  name: "Cropping"
});

const refCropper = ref();
const info = ref<object>(null);
const cropperImg = ref<string>("");

const onCropper = (): void => {
  nextTick(() => {
    refCropper.value.cropper.getCroppedCanvas().toBlob(blob => {
      const fileReader: FileReader = new FileReader();
      fileReader.onloadend = (e: ProgressEvent) => {
        cropperImg.value = (e.target as any).result;
        info.value = refCropper.value.cropper.getData();
      };
      fileReader.readAsDataURL(blob);
    }, "image/jpeg");
  });
};
</script>

<template>
  <el-card shadow="never">
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
  align-items: center;
  justify-content: space-between;
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
