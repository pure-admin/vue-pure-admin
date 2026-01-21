<template>
  <div class="import-history">
    <el-table v-loading="loading" :data="historyList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="file_name" label="文件名" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.file_name.split("/").pop() }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status)">
            {{ row.status_display }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.created_at).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'correcting'"
            link
            type="primary"
            @click="$emit('continue', row.id)"
          >
            继续纠错
          </el-button>
          <el-popconfirm
            title="确定删除该记录吗？"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getImportTasks, deleteImportTask } from "@/api/award"; // 修改为你的实际路径
import { message } from "@/utils/message"; // 修改为你的提示工具

const emit = defineEmits(["continue"]);
const historyList = ref([]);
const loading = ref(false);

const fetchHistory = async () => {
  loading.value = true;
  try {
    const res = await getImportTasks();
    historyList.value = res;
  } finally {
    loading.value = false;
  }
};

const getStatusTag = (status: string) => {
  const map: any = {
    pending: "info",
    correcting: "warning",
    finished: "success",
    failed: "danger"
  };
  return map[status] || "info";
};

const handleDelete = async (id: number) => {
  await deleteImportTask(id);
  message("删除成功", { type: "success" });
  fetchHistory();
};

onMounted(fetchHistory);
</script>
