<template>
  <div v-loading="loading">
    <el-table :data="teams" border stripe>
      <el-table-column prop="event_name" label="竞赛活动" />
      <el-table-column prop="name" label="我的团队" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'draft' ? 'info' : 'success'">{{
            row.status_display
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            v-if="['draft', 'rejected'].includes(row.status)"
            type="primary"
            link
            @click="handleEdit(row)"
            >编辑资料</el-button
          >
          <el-button v-else link type="info" @click="handleEdit(row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <TeamEditDialogUser ref="editRef" @refresh="fetchMyData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getTeamList } from "@/api/team";
import TeamEditDialogUser from "./TeamEditDialogUser.vue";

const loading = ref(false);
const teams = ref([]);
const editRef = ref();

const fetchMyData = async () => {
  loading.value = true;
  const res = await getTeamList();
  teams.value = res;
  loading.value = false;
};

const handleEdit = row => editRef.value?.open(row);

onMounted(fetchMyData);
defineExpose({ refresh: fetchMyData });
</script>
