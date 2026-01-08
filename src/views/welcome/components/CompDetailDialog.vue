<template>
  <el-dialog
    v-model="visible"
    :title="eventData.competition_title"
    width="600px"
    destroy-on-close
  >
    <div v-loading="loading" class="detail-container">
      <div class="flex flex-wrap gap-2 mb-4">
        <el-tag effect="plain" type="warning" size="large">
          类别：{{ compInfo.category_name || "加载中..." }}
        </el-tag>
        <el-tag effect="plain" type="danger" size="large">
          级别：{{ compInfo.level_name || "加载中..." }}
        </el-tag>
        <el-tag effect="plain" size="large">年度：{{ compInfo.year }}</el-tag>
      </div>

      <el-divider content-position="left">活动安排</el-divider>
      <div class="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg mb-4">
        <h4 class="font-bold mb-3 text-primary">{{ eventData.name }}</h4>
        <div class="space-y-3 text-sm">
          <div class="flex items-center text-gray-600 dark:text-gray-300">
            <IconifyIconOffline icon="ep:calendar" class="mr-2 text-blue-500" />
            <span class="w-20">开始时间：</span>
            <span>{{ formatDate(eventData.start_time) }}</span>
          </div>
          <div class="flex items-center text-gray-600 dark:text-gray-300">
            <IconifyIconOffline icon="ep:calendar" class="mr-2 text-red-500" />
            <span class="w-20">截止时间：</span>
            <span>{{ formatDate(eventData.end_time) }}</span>
          </div>
        </div>
      </div>

      <el-divider content-position="left">竞赛详情</el-divider>
      <div class="px-2 text-sm leading-relaxed text-gray-500 mb-4">
        {{ compInfo.description || eventData.competition_description }}
      </div>

      <div v-if="compInfo.uri" class="px-2 flex items-center text-sm">
        <IconifyIconOffline icon="ep:link" class="mr-2 text-green-500" />
        <span class="font-medium mr-2">官方链接:</span>
        <el-link :href="compInfo.uri" target="_blank" type="primary">
          点击前往访问
        </el-link>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getCompDetail } from "@/api/comp";

const visible = ref(false);
const loading = ref(false);
const eventData = ref<any>({});
const compInfo = ref<any>({});

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("zh-CN");
};

const open = async (event: any) => {
  eventData.value = event;
  visible.value = true;
  loading.value = true;
  try {
    const res = await getCompDetail(event.competition);
    compInfo.value = res.data || res;
  } catch (error) {
    console.error("获取详情失败", error);
  } finally {
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<style scoped>
.detail-container {
  min-height: 250px;
}
</style>
