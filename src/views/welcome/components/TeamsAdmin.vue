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
              <el-button-group @click.stop>
                <el-button
                  size="small"
                  type="primary"
                  plain
                  @click="exportExcel(group)"
                >
                  导出Excel名册
                </el-button>
                <el-button
                  size="small"
                  type="warning"
                  plain
                  @click="exportWorksZip(group)"
                >
                  打包作品ZIP
                </el-button>
              </el-button-group>
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ref, computed, onMounted } from "vue";
import {
  getTeamList,
  reviewShortlist,
  reviewAward,
  exportEventWorks
} from "@/api/team";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import TeamViewDialogAdmin from "./TeamViewDialogAdmin.vue";

const loading = ref(false);
const allTeams = ref([]);
const activeNames = ref([]);
const detailRef = ref();

// --- 导出 Excel 逻辑 ---

// 格式化辅助函数：real_name1,学/工号1;real_name2...
const formatPeople = (details: any[]) => {
  if (!details || !Array.isArray(details) || details.length === 0) return "无";
  return details
    .map(item => {
      // 必须通过 profile 访问 real_name
      const name = item.profile?.real_name || "未知";
      const id = item.user_id || "无学号";
      return `${name},${id}`;
    })
    .join("; ");
};

const exportExcel = (group: any) => {
  // 1. 筛选逻辑：建议使用 toLowerCase() 增强兼容性
  const targetTeams = group.teams.filter(
    t => t.status?.toLowerCase() === "shortlisted"
  );

  if (targetTeams.length === 0) {
    return message("该竞赛暂无「已入围」的团队可供导出", { type: "warning" });
  }

  // 2. 映射逻辑：严格对应后端给出的 nested profile 结构
  const exportData = targetTeams.map(team => {
    // 队长信息
    const leaderProfile = team.leader_detail?.profile;
    const leaderName = leaderProfile?.real_name || "未知";
    const leaderID = team.leader_user_id || "";

    return {
      团队名称: team.name || "未命名",
      队长: `${leaderName}(${leaderID})`,
      // 这里的 members_detail 必须和后端 JSON 键名一致
      参赛学生: formatPeople(team.members_detail || []),
      指导老师: formatPeople(team.teachers_detail || []),
      当前状态: team.status_display || "未知"
    };
  });

  // 3. 导出操作
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "入围名单");

  XLSX.writeFile(wb, `${group.eventName}_入围名册.xlsx`);
  message(`成功导出 ${exportData.length} 条记录`, { type: "success" });
};

// --- 导出 ZIP 逻辑 ---
const exportWorksZip = async (group: any) => {
  loading.value = true;
  try {
    message("正在打包作品，请稍候...", { type: "info" });

    // 注意：这里的 res 取决于你的 http.ts 拦截器是如何返回的
    const res: any = await exportEventWorks(group.eventId);

    // 如果拦截器返回的是整个 AxiosResponse，则用 res.data
    // 如果拦截器直接返回了 data，则直接用 res
    const blob = res.data instanceof Blob ? res.data : res;

    if (blob.type === "application/json") {
      const text = await blob.text();
      const errorData = JSON.parse(text);
      message(errorData.detail || "下载失败", { type: "error" });
      return;
    }

    saveAs(blob, `${group.eventName}_作品合集.zip`);
    message("下载成功", { type: "success" });
  } catch (e) {
    console.error(e);
    message("下载过程中出现错误", { type: "error" });
  } finally {
    loading.value = false;
  }
};

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
