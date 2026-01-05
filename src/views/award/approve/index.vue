<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { Search, Check, Close } from "@element-plus/icons-vue";
import {
  getApproveList,
  approveAward,
  rejectAward,
  type AwardApplyItem
} from "@/api/apply";

const loading = ref(false);
const rawData = ref<AwardApplyItem[]>([]);

// 状态映射
const statusMap = {
  pending: { text: "受理中", type: "warning", sort: 1 },
  approved: { text: "已通过", type: "success", sort: 2 },
  rejected: { text: "已拒绝", type: "danger", sort: 3 }
};

// --- 核心逻辑：排序 ---
// 使用计算属性，将受理中(pending)排在最前面
const sortedData = computed(() => {
  return [...rawData.value].sort((a, b) => {
    // 首先按状态优先级排序 (pending=1, approved=2, rejected=3)
    const statusOrder = statusMap[a.status].sort - statusMap[b.status].sort;
    if (statusOrder !== 0) return statusOrder;
    // 同状态下，按创建时间倒序（最新的在上面）
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

const fetchData = async () => {
  loading.value = true;
  try {
    rawData.value = await getApproveList();
  } finally {
    loading.value = false;
  }
};

// --- 审批操作 ---

// 通过操作
const handleApprove = (row: AwardApplyItem) => {
  ElMessageBox.confirm(
    `确定通过 "${row.payload.comp_title}" 的申请吗？`,
    "审批确认",
    {
      confirmButtonText: "通过",
      cancelButtonText: "取消",
      type: "success"
    }
  ).then(async () => {
    await approveAward(row.id);
    message("已核准通过", { type: "success" });
    fetchData(); // 刷新列表
  });
};

// 拒绝操作（含备注输入）
const handleReject = (row: AwardApplyItem) => {
  ElMessageBox.prompt("请输入拒绝理由", "审批拒绝", {
    confirmButtonText: "提交拒绝",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "理由不能为空",
    inputPlaceholder: "例如：图片模糊，请重新上传清晰的证书原件扫描件。"
  }).then(async ({ value }) => {
    await rejectAward(row.id, value);
    message("已驳回申请", { type: "info" });
    fetchData();
  });
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="main-content p-4">
    <div class="bg-white p-5 rounded shadow-sm">
      <div class="flex justify-between items-center mb-5">
        <h3 class="text-xl font-bold">获奖申请审批工作台</h3>
        <el-button :icon="Search" @click="fetchData">刷新数据</el-button>
      </div>

      <el-table v-loading="loading" :data="sortedData" border stripe>
        <el-table-column label="证书预览" width="100" align="center">
          <template #default="{ row }">
            <el-image
              class="w-16 h-16 rounded shadow-sm"
              :src="row.cert_image"
              :preview-src-list="[row.cert_image]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>

        <el-table-column label="申请信息" min-width="250">
          <template #default="{ row }">
            <div class="text-sm">
              <div class="font-bold text-blue-600">
                {{ row.payload.comp_title }}
              </div>
              <div class="text-gray-500 mt-1">
                <span>等次：{{ row.award_level }}</span>
                <el-divider direction="vertical" />
                <span>日期：{{ row.award_date }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">
                证书号：{{ row.cert_no }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="参与人员" width="180">
          <template #default="{ row }">
            <div class="text-xs">
              <div>学生ID: {{ row.payload.participant_ids.join(", ") }}</div>
              <div class="text-gray-400">
                指导老师ID: {{ row.payload.instructor_ids.join(", ") }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="当前状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status].type">
              {{ statusMap[row.status].text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="审批操作"
          width="200"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div v-if="row.status === 'pending'">
              <el-button
                type="success"
                size="small"
                :icon="Check"
                @click="handleApprove(row)"
              >
                通过
              </el-button>
              <el-button
                type="danger"
                size="small"
                :icon="Close"
                @click="handleReject(row)"
              >
                拒绝
              </el-button>
            </div>
            <div v-else class="text-gray-400 text-xs">
              已于 {{ new Date(row.created_at).toLocaleDateString() }} 处理
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-table__row) {
  transition: all 0.3s;
}

/* 给“受理中”的行增加一个淡淡的底色，使其更显眼 */
:deep(.el-table__row).warning-row {
  background-color: #fdf6ec;
}
</style>
