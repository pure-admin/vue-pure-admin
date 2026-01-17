<template>
  <div
    class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors"
  >
    <el-upload
      class="w-full text-center"
      drag
      action="#"
      :auto-upload="false"
      :on-change="handleFileSelect"
      :show-file-list="false"
      accept=".xlsx, .xls"
      :disabled="uploading"
    >
      <el-icon class="el-icon--upload text-4xl text-gray-400">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text mt-2 text-gray-600">
        将 Excel 拖到此处，或 <em class="text-primary font-bold">点击上传</em>
      </div>
    </el-upload>
    <div v-if="uploading" class="mt-4 text-primary flex items-center gap-2">
      <el-icon class="is-loading"><Loading /></el-icon> 正在上传并解析文件...
    </div>

    <div class="mt-6 text-xs text-gray-400">
      支持 .xlsx / .xls 格式，建议下载
      <el-link type="primary" href="/award_template.xlsx" target="_blank"
        >标准模板</el-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadFilled, Loading } from "@element-plus/icons-vue";
import { uploadImportFile } from "@/api/award";
import { message } from "@/utils/message";
import type { UploadFile } from "element-plus";

const emit = defineEmits(["success"]);
const uploading = ref(false);

const handleFileSelect = async (file: UploadFile) => {
  if (!file.raw) return;
  uploading.value = true;
  try {
    const res = await uploadImportFile(file.raw);
    // 假设 res 结构为 { id: 9, status: "pending", ... }
    emit("success", res.id);
  } catch (error) {
    message("上传失败，请检查文件格式", { type: "error" });
  } finally {
    uploading.value = false;
  }
};
</script>
