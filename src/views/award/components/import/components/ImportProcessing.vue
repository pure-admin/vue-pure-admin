<template>
  <div class="flex flex-col items-center py-12">
    <el-progress type="circle" :percentage="progress" />
    <h3 class="mt-4 text-lg font-medium text-gray-700">正在智能解析数据...</h3>
    <p class="text-sm text-gray-500 mt-2">
      系统正在比对竞赛库与人员信息，请稍候
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getImportStatus } from "@/api/award";

const props = defineProps<{ taskId: number }>();
const emit = defineEmits(["complete"]);

const progress = ref(0);
let timer: number | null = null;

const checkStatus = async () => {
  try {
    const res = await getImportStatus(props.taskId);
    progress.value = res.progress || 0;

    if (res.status === "correcting") {
      progress.value = 100;
      emit("complete");
      stopPolling();
    } else if (res.status === "failed") {
      // 处理失败逻辑
      stopPolling();
    }
  } catch (e) {
    console.error(e);
  }
};

const stopPolling = () => {
  if (timer) clearInterval(timer);
};

onMounted(() => {
  checkStatus(); // 立即查一次
  timer = window.setInterval(checkStatus, 1000); // 1秒轮询一次
});

onUnmounted(() => stopPolling);
</script>
