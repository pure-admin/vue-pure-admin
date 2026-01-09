<template>
  <div v-loading="loading" class="manage-teams">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item
        v-for="group in groupedTeams"
        :key="group.eventId"
        :name="group.eventId"
      >
        <template #title>
          <div class="flex justify-between w-full pr-4 items-center">
            <span class="font-bold text-base">{{ group.eventName }}</span>
            <div class="flex items-center gap-4">
              <el-tag size="small" type="info"
                >阶段：{{ group.eventStatusDisplay }}</el-tag
              >
              <el-tag size="small" type="warning"
                >已报名：{{ group.teams.length }}</el-tag
              >
            </div>
          </div>
        </template>

        <el-table :data="group.teams" border size="small" stripe>
          <el-table-column prop="name" label="团队名称" min-width="150" />
          <el-table-column prop="leader_name" label="队长" width="120" />
          <el-table-column label="成员/老师" width="120">
            <template #default="{ row }">
              <span class="text-xs"
                >成员: {{ row.members?.length }} / 导师:
                {{ row.teachers?.length }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="status_display" label="状态" width="120" />

          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <div
                v-if="
                  group.eventStatus === 'screening' &&
                  row.status === 'submitted'
                "
                class="flex gap-2"
              >
                <el-button
                  type="success"
                  size="small"
                  @click="handleShortlist(row, 'approve')"
                  >通过</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="handleShortlist(row, 'reject')"
                  >驳回</el-button
                >
              </div>

              <div
                v-else-if="
                  group.eventStatus === 'awarding' &&
                  row.status === 'shortlisted'
                "
                class="flex gap-2"
              >
                <el-button
                  type="warning"
                  size="small"
                  @click="handleAward(row, 'award')"
                  >设为获奖</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  @click="handleAward(row, 'finish')"
                  >结束(未获奖)</el-button
                >
              </div>

              <el-button v-else link type="primary" @click="viewTeamDetail(row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <TeamViewDialogAdmin ref="detailRef" readonly />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getTeamList, reviewShortlist, reviewAward } from "@/api/team";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import TeamViewDialogAdmin from "./TeamViewDialogAdmin.vue";

const loading = ref(false);
const allTeams = ref([]);
const activeNames = ref([]);
const detailRef = ref();

// 数据分组逻辑：将团队按 event 分组
const groupedTeams = computed(() => {
  const groups: Record<number, any> = {};
  allTeams.value.forEach((team: any) => {
    if (!groups[team.event]) {
      groups[team.event] = {
        eventId: team.event,
        eventName: team.event_name,
        eventStatus: team.event_status, // 假设后端返回了所属活动的状态
        eventStatusDisplay: team.event_status_display,
        teams: []
      };
    }
    groups[team.event].teams.push(team);
  });
  return Object.values(groups);
});

const fetchAllData = async () => {
  loading.value = true;
  try {
    const res = await getTeamList(); // 管理员调用此接口返回全量
    allTeams.value = res;
  } finally {
    loading.value = false;
  }
};

const handleShortlist = async (team, action) => {
  let reason = "";
  if (action === "reject") {
    const { value } = await ElMessageBox.prompt("请输入驳回理由", "操作确认");
    reason = value;
  }
  await reviewShortlist(team.id, { action, reason });
  message("审核已提交", { type: "success" });
  fetchAllData();
};

const handleAward = async (team, action) => {
  await ElMessageBox.confirm("确认更新该团队的奖项状态吗？", "评奖确认");
  await reviewAward(team.id, { action });
  message("奖项状态已更新", { type: "success" });
  fetchAllData();
};

const viewTeamDetail = row => detailRef.value?.open(row);

onMounted(fetchAllData);
defineExpose({ refresh: fetchAllData });
</script>
