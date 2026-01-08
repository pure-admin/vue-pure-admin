<template>
  <el-row :gutter="20">
    <el-col v-for="item in events" :key="item.id" :span="8" :xs="24">
      <el-card shadow="hover" class="mb-4">
        <div class="flex justify-between items-start">
          <h4 class="font-bold text-lg">{{ item.competition_title }}</h4>
          <el-tag :type="getStatusColor(item.status)">{{
            item.status_display
          }}</el-tag>
        </div>
        <p class="text-sm text-gray-500 mt-2 h-10">{{ item.name }}</p>

        <div class="mt-4 flex justify-end gap-2">
          <el-button
            v-if="item.status === 'registration'"
            type="primary"
            size="small"
            @click="handleApply(item)"
          >
            立即报名
          </el-button>
          <el-button size="small" @click="handleDetail(item)">详情</el-button>
        </div>
      </el-card>
    </el-col>
    <CompDetailDialog ref="compDetailRef" />
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getActiveEvents } from "@/api/comp";
import { checkMyParticipation, createTeam } from "@/api/team";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import CompDetailDialog from "./CompDetailDialog.vue";

const events = ref([]);
const compDetailRef = ref();
const emit = defineEmits(["on-registered"]);

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

const handleApply = async (event: any) => {
  const status = await checkMyParticipation(event.id);
  if (!status.can_create)
    return message("您已参加该竞赛或不具备创建条件", { type: "warning" });

  ElMessageBox.prompt("请输入您的团队名称", "团队报名", {
    confirmButtonText: "确认报名",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "队名不能为空"
  }).then(async ({ value }) => {
    await createTeam({ event: event.id, name: value });
    message("报名成功！", { type: "success" });
    emit("on-registered");
  });
};

const handleDetail = (event: any) => compDetailRef.value?.open(event);

onMounted(async () => {
  events.value = await getActiveEvents();
});
</script>
