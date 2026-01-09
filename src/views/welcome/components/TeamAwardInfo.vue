<template>
  <div v-if="visible">
    <el-divider content-position="left">获奖录入 (评奖阶段)</el-divider>
    <el-form-item label="获奖等级">
      <el-select
        :model-value="level"
        :disabled="disabled"
        placeholder="请选择"
        @update:model-value="$emit('update:level', $event)"
      >
        <el-option label="一等奖" value="first" />
        <el-option label="二等奖" value="second" />
        <el-option label="三等奖" value="third" />
      </el-select>
    </el-form-item>
    <el-form-item label="证书编号">
      <el-input
        :model-value="certNo"
        placeholder="证书编号"
        :disabled="disabled"
        @update:model-value="$emit('update:certNo', $event)"
      />
    </el-form-item>
    <el-form-item label="证书图片">
      <el-upload
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
        :limit="1"
        :disabled="disabled"
        accept="image/*"
        :show-file-list="false"
      >
        <el-button type="info" :disabled="disabled">上传证书图片</el-button>
        <template #tip>
          <div class="el-upload__tip text-red-400">小于 5MB 的图片</div>
          <div v-if="currentImgUrl" class="el-upload__tip text-blue-500">
            已上传: {{ getFileName(currentImgUrl) }}
          </div>
          <div v-if="pendingFile" class="el-upload__tip text-green-500">
            准备上传: {{ pendingFile.name }}
          </div>
        </template>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";

defineProps<{
  visible: boolean; // 是否显示该区域
  disabled: boolean;
  level: string;
  certNo: string;
  currentImgUrl: string;
}>();

const emit = defineEmits(["update:level", "update:certNo", "file-change"]);
const pendingFile = ref<File | null>(null);

const handleChange = (file: any) => {
  const isImg = file.raw.type.startsWith("image/");
  const isLt5M = file.raw.size / 1024 / 1024 < 5;
  if (!isImg || !isLt5M) {
    message("证书请上传小于 5MB 的图片", { type: "error" });
    return;
  }
  pendingFile.value = file.raw;
  emit("file-change", file.raw);
};

const getFileName = (url: string) =>
  typeof url === "string" ? url.split("/").pop() : "";
</script>
