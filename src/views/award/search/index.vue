<template>
  <div class="main p-4">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="font-bold">获奖信息按人查询</div>
      </template>
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="学号/工号">
          <el-input
            v-model="searchUserId"
            placeholder="请输入用户ID (如: 23101100514)"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('search')"
            @click="handleSearch"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-loading="loading">
      <el-empty
        v-if="awards.length === 0 && hasSearched"
        description="暂无获奖记录"
      />
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-card
          v-for="item in awards"
          :key="item.id"
          shadow="hover"
          class="award-card"
        >
          <div class="flex">
            <div
              class="w-32 h-44 mr-4 shrink-0 bg-gray-100 rounded overflow-hidden"
            >
              <el-image
                style="width: 100%; height: 100%"
                :src="item.certificate_details?.image_uri"
                :preview-src-list="[item.certificate_details?.image_uri]"
                fit="cover"
                preview-teleported
              >
                <template #error>
                  <div
                    class="flex items-center justify-center h-full text-gray-400 text-xs text-center p-2"
                  >
                    证书暂未上传或预览失败
                  </div>
                </template>
              </el-image>
            </div>

            <div class="grow">
              <div class="flex justify-between items-start">
                <h4 class="text-lg font-bold text-blue-600 mb-2">
                  {{ item.competition_name }}
                </h4>
                <el-tag :type="getAwardType(item.award_level)">{{
                  item.award_level
                }}</el-tag>
              </div>

              <div class="text-sm space-y-1">
                <p>
                  <span class="text-gray-500">证书编号：</span
                  >{{ item.certificate_details?.cert_no }}
                </p>
                <p>
                  <span class="text-gray-500">获奖日期：</span
                  >{{ item.award_date }}
                </p>
                <div class="mt-3">
                  <span class="text-gray-500 block">团队成员：</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <el-tooltip
                      v-for="p in item.participant_details"
                      :key="p.user_id"
                      :content="`角色: ${p.group_details?.[0]?.name}`"
                    >
                      <el-tag
                        size="small"
                        effect="plain"
                        :type="p.user_id === searchUserId ? 'success' : 'info'"
                      >
                        {{ p.user_id }}
                      </el-tag>
                    </el-tooltip>
                  </div>
                </div>

                <div class="mt-2">
                  <span class="text-gray-500 block">指导教师：</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <el-tag
                      v-for="ins in item.instructor_details"
                      :key="ins.user_id"
                      size="small"
                      type="warning"
                    >
                      {{ ins.user_id }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getAwardsByUserId } from "@/api/award";
import { message } from "@/utils/message";

const searchUserId = ref("");
const loading = ref(false);
const awards = ref([]);
const hasSearched = ref(false);

/** 颜色映射逻辑 */
const getAwardType = (level: string) => {
  if (level.includes("一等奖") || level.includes("金奖")) return "danger";
  if (level.includes("二等奖") || level.includes("银奖")) return "warning";
  if (level.includes("三等奖") || level.includes("铜奖")) return "success";
  return "info";
};

const handleSearch = async () => {
  if (!searchUserId.value) {
    message("请输入学号或工号", { type: "warning" });
    return;
  }

  loading.value = true;
  hasSearched.value = true;
  try {
    const res = await getAwardsByUserId(searchUserId.value);
    awards.value = Array.isArray(res) ? res : (res as any).data;
  } catch (e) {
    message("查询失败，请检查网络或ID是否正确", { type: "error" });
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.award-card {
  transition: all 0.3s;
}

.award-card:hover {
  transform: translateY(-4px);
}
</style>
