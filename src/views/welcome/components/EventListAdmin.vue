<template>
  <div class="admin-event-container">
    <div class="mb-4 flex justify-between items-center">
      <h3 class="text-base font-bold">竞赛活动列表</h3>
      <el-button type="success" @click="handleCreate">发布新活动</el-button>
    </div>

    <el-table :data="events" border stripe style="width: 100%">
      <el-table-column
        prop="competition_title"
        label="所属竞赛"
        min-width="150"
      />
      <el-table-column prop="name" label="活动名称" min-width="150" />
      <el-table-column label="当前状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusColor(row.status)">{{
            row.status_display
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="起止时间" width="200">
        <template #default="{ row }">
          <div class="text-xs">
            起: {{ new Date(row.start_time).toLocaleDateString() }}<br />
            止: {{ new Date(row.end_time).toLocaleDateString() }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="参赛/获奖人数" width="150">
        <template #default="{ row }">
          <div v-if="row.status === 'archived'" class="text-sm">
            <el-tooltip content="最终参赛人数" placement="top">
              <span class="text-blue-600 font-bold">{{
                row.final_participants_count
              }}</span>
            </el-tooltip>
            <span class="mx-1">/</span>
            <el-tooltip content="最终获奖人数" placement="top">
              <span class="text-green-600 font-bold">{{
                row.final_winners_count
              }}</span>
            </el-tooltip>
          </div>
          <span v-else class="text-gray-400">-</span>
        </template>
      </el-table-column>

      <el-table-column label="管理操作" width="250" fixed="right">
        <template #default="{ row }">
          <div class="flex gap-2">
            <template v-if="row.status !== 'archived'">
              <el-button
                v-if="row.status === 'awarding'"
                type="danger"
                size="small"
                @click="handleArchive(row)"
              >
                归档赛事
              </el-button>

              <el-button
                v-else
                type="primary"
                size="small"
                plain
                @click="handleNextStage(row)"
              >
                推进阶段
              </el-button>
            </template>

            <el-button type="warning" size="small" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <EventEditDialog ref="eventEditRef" @refresh="fetchEvents" />
    <CompDetailDialog ref="compDetailRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getActiveEvents,
  updateEventStage,
  STAGE_MAP,
  archiveEvent
} from "@/api/comp";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import CompDetailDialog from "./CompDetailDialog.vue";
import EventEditDialog from "./EventEditDialog.vue";

const events = ref([]);
const eventEditRef = ref();
const compDetailRef = ref();

const getStatusColor = (status: string) => {
  const colors = {
    registration: "success",
    screening: "warning",
    ongoing: "primary",
    awarding: "danger",
    archived: "info"
  };
  return colors[status] || "info";
};

const fetchEvents = async () => {
  events.value = await getActiveEvents();
};

const handleCreate = () => eventEditRef.value?.open();
const handleEdit = (row: any) => eventEditRef.value?.open(row);
const handleDetail = (row: any) => compDetailRef.value?.open(row);

const handleNextStage = async (event: any) => {
  const nextConfig = STAGE_MAP[event.status];
  if (!nextConfig) return;

  try {
    await ElMessageBox.confirm(
      `确定推进赛事“${event.name}”至下一阶段【${nextConfig.label}】吗？`,
      "阶段流转",
      { type: "warning" }
    );
    await updateEventStage(event.id, {
      current_status: nextConfig.next,
      detail: `管理员推进至: ${nextConfig.label}`
    });
    message("阶段更新成功", { type: "success" });
    fetchEvents();
  } catch (error) {
    if (error !== "cancel") console.error(error);
  }
};

/**
 * 处理归档逻辑
 */
const handleArchive = async (event: any) => {
  try {
    // 弹窗警告：使用 danger 样式和更加醒目的文案
    await ElMessageBox.confirm(
      `警告：归档赛事“${event.name}”将清空所有参赛团队记录并冻结获奖名单。该操作不可逆，请确认所有评审工作已完全结束！`,
      "严正警告：赛事归档",
      {
        confirmButtonText: "确定归档",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--danger",
        type: "error"
      }
    );

    await archiveEvent(event.id);
    // 成功提示
    message(`赛事归档成功！统计结果已锁定。`, { type: "success" });
    // 刷新列表
    fetchEvents();
  } catch (error) {
    if (error !== "cancel") {
      console.error(error);
      message("归档失败，请检查数据完整性", { type: "error" });
    }
  }
};

onMounted(fetchEvents);
</script>
