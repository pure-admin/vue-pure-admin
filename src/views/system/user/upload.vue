<script setup lang="tsx">
import { ref } from "vue";
import ReCropper from "@/components/ReCropper";
import { formatBytes } from "@pureadmin/utils";

const props = defineProps({
  imgSrc: String
});

const emit = defineEmits(["cropper"]);

const infos = ref();
const refCropper = ref();
const showPopover = ref(false);
const cropperImg = ref<string>("");

function onCropper({ base64, blob, info }) {
  infos.value = info;
  cropperImg.value = base64;
  emit("cropper", { base64, blob, info });
}
</script>

<template>
  <div v-loading="!showPopover" element-loading-background="transparent">
    <el-popover :visible="showPopover" placement="right" width="18vw">
      <template #reference>
        <div class="w-[18vw]">
          <ReCropper
            ref="refCropper"
            :src="props.imgSrc"
            circled
            @cropper="onCropper"
            @readied="showPopover = true"
          />
          <p class="mt-1 text-center" v-show="showPopover">
            温馨提示：右键上方裁剪区可开启功能菜单
          </p>
        </div>
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
</template>
