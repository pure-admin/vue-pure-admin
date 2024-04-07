<script setup lang="tsx">
import avatar from "./avatar.png";
import { ref, onBeforeUnmount } from "vue";
import ReCropper from "@/components/ReCropper";
import { formatBytes } from "@pureadmin/utils";

defineOptions({
  name: "Cropping"
});

const infos = ref();
const popoverRef = ref();
const refCropper = ref();
const showPopover = ref(false);
const cropperImg = ref<string>("");

function onCropper({ base64, blob, info }) {
  console.log(blob);
  infos.value = info;
  cropperImg.value = base64;
}

onBeforeUnmount(() => {
  popoverRef.value.hide();
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          图片裁剪，基于开源的
          <el-link
            href="https://fengyuanchen.github.io/cropperjs/"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            cropperjs
          </el-link>
          进行二次封装（提示：右键下面左侧裁剪区可开启功能菜单）
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/cropping"
        target="_blank"
      >
        代码位置 src/views/components/cropping
      </el-link>
    </template>
    <div v-loading="!showPopover" element-loading-background="transparent">
      <el-popover
        ref="popoverRef"
        :visible="showPopover"
        placement="right"
        width="300px"
      >
        <template #reference>
          <ReCropper
            ref="refCropper"
            class="w-[30vw]"
            :src="avatar"
            circled
            @cropper="onCropper"
            @readied="showPopover = true"
          />
        </template>
        <div class="flex flex-wrap justify-center items-center text-center">
          <el-image
            v-if="cropperImg"
            :src="cropperImg"
            :preview-src-list="Array.of(cropperImg)"
            fit="cover"
          />
          <div v-if="infos" class="mt-1">
            <p>
              图像大小：{{ parseInt(infos.width) }} ×
              {{ parseInt(infos.height) }}像素
            </p>
            <p>
              文件大小：{{ formatBytes(infos.size) }}（{{ infos.size }} 字节）
            </p>
          </div>
        </div>
      </el-popover>
    </div>
  </el-card>
</template>
