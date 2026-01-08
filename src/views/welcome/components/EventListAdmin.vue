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

      <el-table-column label="管理操作" width="250" fixed="right">
        <template #default="{ row }">
          <div class="flex gap-2">
            <el-button
              v-if="row.status !== 'archived'"
              type="primary"
              size="small"
              plain
              @click="handleNextStage(row)"
            >
              推进阶段
            </el-button>
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
import { getActiveEvents, updateEventStage, STAGE_MAP } from "@/api/comp";
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

onMounted(fetchEvents);
</script>
