<template>
  <div class="batch-import-wrapper bg-white p-6 rounded-lg shadow-sm">
    <el-steps
      :active="activeStep"
      finish-status="success"
      align-center
      class="mb-8"
    >
      <el-step title="上传文件" />
      <el-step title="解析数据" />
      <el-step title="清洗与确认" />
    </el-steps>

    <ImportUpload
      v-if="currentStep === 'upload'"
      @success="handleUploadSuccess"
    />

    <ImportProcessing
      v-if="currentStep === 'processing'"
      :task-id="taskId"
      @complete="handleProcessComplete"
    />

    <ImportReview
      v-if="currentStep === 'review'"
      :task-id="taskId"
      @cancel="resetProcess"
      @success="handleFinish"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ImportUpload from "./components/ImportUpload.vue";
import ImportProcessing from "./components/ImportProcessing.vue";
import ImportReview from "./components/ImportReview.vue";

const taskId = ref<number | null>(null);
const currentStep = ref<"upload" | "processing" | "review">("upload");

const activeStep = computed(() => {
  switch (currentStep.value) {
    case "upload":
      return 0;
    case "processing":
      return 1;
    case "review":
      return 2;
    default:
      return 0;
  }
});

const handleUploadSuccess = (id: number) => {
  taskId.value = id;
  currentStep.value = "processing";
};

const handleProcessComplete = () => {
  currentStep.value = "review";
};

const handleFinish = () => {
  currentStep.value = "upload";
  taskId.value = null;
  // 这里可以触发事件通知列表刷新
  // emit('refresh');
};

const resetProcess = () => {
  currentStep.value = "upload";
  taskId.value = null;
};
</script>
