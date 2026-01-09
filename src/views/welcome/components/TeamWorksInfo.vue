<template>
  <div>
    <el-divider content-position="left">作品文件</el-divider>
    <el-form-item label="作品附件">
      <el-upload
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
        :limit="1"
        :disabled="disabled"
        :show-file-list="false"
      >
        <el-button type="primary" :disabled="disabled">选择作品文件</el-button>
        <template #tip>
          <div v-if="currentFileUrl" class="el-upload__tip text-blue-500">
            当前文件: {{ getFileName(currentFileUrl) }}
          </div>
          <div v-if="pendingFile" class="el-upload__tip text-green-500">
            准备上传: {{ pendingFile.name }}
          </div>
          <div class="el-upload__tip">
            支持 PDF、ZIP、RAR 等格式 (草稿状态可更新)
          </div>
        </template>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  currentFileUrl: string; // 后端返回的 URL
  disabled: boolean;
}>();

const emit = defineEmits(["file-change"]);
const pendingFile = ref<File | null>(null);

const handleChange = (file: any) => {
  pendingFile.value = file.raw;
  emit("file-change", file.raw);
};

const getFileName = (url: string) =>
  typeof url === "string" ? url.split("/").pop() : "";
</script>
