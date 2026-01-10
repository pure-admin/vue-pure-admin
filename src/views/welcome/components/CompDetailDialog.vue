<template>
  <el-dialog
    v-model="visible"
    :title="`赛事详情：${eventData.competition_title}`"
    width="900px"
    top="8vh"
    destroy-on-close
  >
    <div v-loading="loading" class="detail-container">
      <div
        v-if="eventData.status === 'archived'"
        class="grid grid-cols-2 gap-4 mb-6"
      >
        <div
          class="p-4 rounded-lg border-2 flex flex-col items-center justify-center bg-blue-50 border-blue-100"
        >
          <div class="text-sm font-medium mb-1 text-blue-600">最终参赛人数</div>
          <div class="text-2xl font-black text-blue-700">
            {{ eventData.final_participants_count || 0 }} 人
          </div>
        </div>
        <div
          class="p-4 rounded-lg border-2 flex flex-col items-center justify-center bg-green-50 border-green-100"
        >
          <div class="text-sm font-medium mb-1 text-green-600">
            最终获奖人数
          </div>
          <div class="text-2xl font-black text-green-700">
            {{ eventData.final_winners_count || 0 }} 人
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTab" type="border-card" class="custom-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <div class="p-2">
            <div class="flex flex-wrap gap-2 mb-4">
              <el-tag effect="dark" type="warning"
                >类别：{{ compInfo.category_name || "加载中..." }}</el-tag
              >
              <el-tag effect="dark" type="danger"
                >级别：{{ compInfo.level_name || "加载中..." }}</el-tag
              >
              <el-tag effect="dark">年度：{{ compInfo.year }}</el-tag>
              <el-tag effect="dark" type="info"
                >状态：{{ eventData.status_display }}</el-tag
              >
            </div>

            <el-descriptions :column="2" border title="安排与描述">
              <el-descriptions-item label="活动名称" :span="2">
                <span class="font-bold text-primary">{{ eventData.name }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="开始时间">
                {{ formatDate(eventData.start_time) }}
              </el-descriptions-item>
              <el-descriptions-item label="截止时间">
                {{ formatDate(eventData.end_time) }}
              </el-descriptions-item>
              <el-descriptions-item label="竞赛详情" :span="2">
                <div
                  class="max-h-50 overflow-y-auto text-gray-500 leading-relaxed"
                >
                  {{
                    compInfo.description ||
                    eventData.competition_description ||
                    "暂无详细描述"
                  }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item
                v-if="compInfo.uri"
                label="官方链接"
                :span="2"
              >
                <el-link
                  :href="compInfo.uri"
                  target="_blank"
                  type="primary"
                  class="text-sm!"
                >
                  <IconifyIconOffline icon="ep:link" class="mr-1" />
                  点击前往官网访问
                </el-link>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>

        <el-tab-pane
          v-if="eventData.status === 'archived'"
          label="获奖记录"
          name="awards"
        >
          <el-table
            v-loading="awardsLoading"
            :data="awardList"
            stripe
            border
            height="400px"
          >
            <el-table-column prop="award_level" label="等级" width="100">
              <template #default="{ row }">
                <el-tag size="small" type="success" effect="plain">{{
                  row.award_level
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="获奖学生">
              <template #default="{ row }">
                <div class="flex flex-wrap gap-1">
                  <el-tooltip
                    v-for="s in row.student_display || []"
                    :key="s.id"
                    :content="`${s.dept || ''}`"
                    placement="top"
                  >
                    <el-tag size="small" effect="plain">
                      {{ s.name }} ({{ s.id }})
                    </el-tag>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="指导老师">
              <template #default="{ row }">
                <div class="flex flex-wrap gap-1">
                  <el-tag
                    v-for="(t, index) in row.teacher_display || []"
                    :key="index"
                    size="small"
                    type="warning"
                  >
                    {{ t.name }}
                  </el-tag>

                  <span
                    v-if="
                      !row.teacher_display || row.teacher_display.length === 0
                    "
                    class="text-gray-400"
                  >
                    -
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="证书预览" width="100" align="center">
              <template #default="{ row }">
                <el-popover
                  v-if="row.certificate_details"
                  placement="left"
                  :width="300"
                  trigger="hover"
                >
                  <template #reference>
                    <el-button link type="primary">预览</el-button>
                  </template>
                  <div class="text-xs font-bold mb-1">
                    证书编号: {{ row.certificate_details.cert_no }}
                  </div>
                  <el-image
                    :src="row.certificate_details.image_uri"
                    fit="contain"
                  />
                </el-popover>
                <span v-else class="text-gray-400">无</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getCompDetail } from "@/api/comp";
import { getAwardList } from "@/api/award";
import { searchUserByID } from "@/api/user"; // 确保导入

const visible = ref(false);
const loading = ref(false);
const awardsLoading = ref(false);
const activeTab = ref("basic");

const eventData = ref<any>({});
const compInfo = ref<any>({});
const awardList = ref([]);

// --- 复用你的用户详情获取逻辑 ---
const fetchUserDetails = async (ids: string[]) => {
  if (!ids || !ids.length) return [];
  // 过滤掉可能的空值
  const validIds = ids.filter(Boolean);
  const promises = validIds.map(id => searchUserByID(id));
  const results = await Promise.all(promises);
  return results.map(r => (Array.isArray(r) ? r[0] : r)).filter(Boolean);
};
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("zh-CN");
};

const open = async (event: any) => {
  eventData.value = event;
  visible.value = true;
  loading.value = true;
  activeTab.value = "basic"; // 重置到第一个Tab
  awardList.value = [];

  try {
    // 1. 获取竞赛基础详情
    const res = await getCompDetail(event.competition);
    compInfo.value = res.data || res;

    // 2. 如果是归档状态，额外获取获奖记录
    if (event.status === "archived") {
      awardsLoading.value = true;
      const awardRes = await getAwardList();
      const allAwards = Array.isArray(awardRes)
        ? awardRes
        : (awardRes as any).data || [];
      // 根据当前竞赛活动过滤 (这里假设通过 competition ID 关联)
      awardList.value = allAwards.filter(
        (a: any) => a.competition === event.competition
      );
      awardsLoading.value = false;
      await fetchAndEnrichAwards();
    }
  } catch (error) {
    console.error("数据加载失败", error);
  } finally {
    loading.value = false;
  }
};

const fetchAndEnrichAwards = async () => {
  awardsLoading.value = true;
  try {
    const awardRes = await getAwardList();
    const allAwards = Array.isArray(awardRes)
      ? awardRes
      : (awardRes as any).data || [];
    // 过滤出属于当前竞赛（Competition ID）的记录
    const filteredAwards = allAwards.filter(
      (a: any) => a.competition === eventData.value.competition
    );

    // 映射新的嵌套结构
    awardList.value = filteredAwards.map((award: any) => {
      return {
        ...award,
        // 确保映射结果即便在数据缺失时也是空数组而非 undefined
        student_display: (award.participant_details || []).map(p => ({
          name: p.profile?.real_name || p.username || "未知",
          id: p.user_id,
          dept: p.profile?.department || ""
        })),
        teacher_display: (award.instructor_details || []).map(i => ({
          name: i.profile?.real_name || i.username || "未知",
          dept: i.profile?.department || ""
        }))
      };
    });
  } catch (e) {
    console.error("解析获奖详情失败", e);
  } finally {
    awardsLoading.value = false;
  }
};

defineExpose({ open });
</script>

<style scoped>
.detail-container {
  min-height: 400px;
}

.custom-tabs :deep(.el-tabs__content) {
  padding: 15px;
}

:deep(.el-descriptions__title) {
  font-size: 14px;
  color: #606266;
}
</style>
