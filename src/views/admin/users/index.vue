<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import {
  adjustAdminUserCredits,
  getAdminUserDetail,
  getAdminUsers,
  updateAdminUserPlan,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUserItem
} from "@/api/admin";
import { getPlans, type PlanSummary } from "@/api/user";
import { hasPerms } from "@/utils/auth";
import { formatDateTime } from "@/utils/dateTime";

defineOptions({
  name: "AdminUsers"
});

const STATUS_OPTIONS = [
  { label: "启用", value: "active" },
  { label: "禁用", value: "disabled" }
];

const ROLE_OPTIONS = [
  { label: "普通用户", value: "user" },
  { label: "运营", value: "operator" },
  { label: "管理员", value: "admin" },
  { label: "总管理员", value: "super_admin" }
];

const loading = ref(false);
const detailLoading = ref(false);
const actionLoadingId = ref("");
const users = ref<Array<AdminUserItem>>([]);
const planOptions = ref<Array<PlanSummary>>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const detailVisible = ref(false);
const creditDialogVisible = ref(false);
const selectedUser = ref<AdminUserItem | null>(null);
const query = reactive({
  keyword: "",
  status: ""
});
const creditForm = reactive({
  userId: "",
  nickname: "",
  delta: 100,
  reason: "后台手动调整"
});

const canEditRole = computed(() => hasPerms("admin:users:role"));

function getStatusLabel(value: string) {
  return STATUS_OPTIONS.find(item => item.value === value)?.label || value;
}

function getRoleLabel(value: string) {
  return ROLE_OPTIONS.find(item => item.value === value)?.label || value;
}

function getPlanLabel(value: string) {
  return planOptions.value.find(item => item.code === value)?.name || value;
}

/** 统一加载套餐列表，避免页面里继续写死 free / standard / pro。 */
async function loadPlanOptions() {
  try {
    planOptions.value = await getPlans();
  } catch (error: any) {
    ElMessage.warning(
      error?.response?.data?.error?.message ||
        "套餐列表加载失败，将暂时保留当前选项。"
    );
  }
}

/** 加载后台用户列表，保持查询、分页和管理状态一致。 */
async function loadUsers() {
  loading.value = true;
  try {
    const response = await getAdminUsers({
      keyword: query.keyword || undefined,
      status: query.status || undefined,
      page: page.value,
      pageSize: pageSize.value
    });
    users.value = response.list || [];
    total.value = response.total || 0;
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "用户列表加载失败"
    );
  } finally {
    loading.value = false;
  }
}

async function refreshSelectedUserIfNeeded(userId: string) {
  if (selectedUser.value?.id === userId) {
    selectedUser.value = await getAdminUserDetail(userId);
  }
}

async function showUserDetail(row: AdminUserItem) {
  detailVisible.value = true;
  detailLoading.value = true;
  try {
    selectedUser.value = await getAdminUserDetail(row.id);
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "用户详情加载失败"
    );
  } finally {
    detailLoading.value = false;
  }
}

/** 关键状态切换前先二次确认，避免后台误操作。 */
async function handleStatusChange(row: AdminUserItem, nextStatus: string) {
  const previousStatus = row.status;
  if (!nextStatus || nextStatus === previousStatus) return;

  try {
    await ElMessageBox.confirm(
      `确认将用户「${row.nickname}」的状态从「${getStatusLabel(previousStatus)}」切换为「${getStatusLabel(nextStatus)}」吗？该操作会立即影响登录与访问。`,
      "确认状态变更",
      {
        type: nextStatus === "disabled" ? "warning" : "info",
        confirmButtonText: "确认切换",
        cancelButtonText: "取消",
        closeOnClickModal: false
      }
    );
  } catch {
    return;
  }

  actionLoadingId.value = row.id;
  try {
    await updateAdminUserStatus(row.id, nextStatus);
    row.status = nextStatus;
    ElMessage.success("用户状态已更新");
    await loadUsers();
    await refreshSelectedUserIfNeeded(row.id);
  } catch (error: any) {
    row.status = previousStatus;
    ElMessage.error(
      error?.response?.data?.error?.message || "用户状态更新失败"
    );
  } finally {
    actionLoadingId.value = "";
  }
}

/** 套餐切换同样增加确认，防止把 free / standard / pro 切错。 */
async function handlePlanChange(row: AdminUserItem, nextPlanCode: string) {
  const previousPlanCode = row.planCode;
  if (!nextPlanCode || nextPlanCode === previousPlanCode) return;

  try {
    await ElMessageBox.confirm(
      `确认将用户「${row.nickname}」的套餐从「${getPlanLabel(previousPlanCode)}」调整为「${getPlanLabel(nextPlanCode)}」吗？该操作会影响可用功能和额度展示。`,
      "确认套餐调整",
      {
        type: "warning",
        confirmButtonText: "确认调整",
        cancelButtonText: "取消",
        closeOnClickModal: false
      }
    );
  } catch {
    return;
  }

  actionLoadingId.value = row.id;
  try {
    await updateAdminUserPlan(row.id, nextPlanCode);
    row.planCode = nextPlanCode;
    ElMessage.success("套餐已更新");
    await loadUsers();
    await refreshSelectedUserIfNeeded(row.id);
  } catch (error: any) {
    row.planCode = previousPlanCode;
    ElMessage.error(error?.response?.data?.error?.message || "套餐更新失败");
  } finally {
    actionLoadingId.value = "";
  }
}

async function handleRoleChange(row: AdminUserItem, nextRole: string) {
  const previousRole = row.role;
  if (!nextRole || nextRole === previousRole) return;

  try {
    await ElMessageBox.confirm(
      `确认将用户「${row.nickname}」的角色从「${getRoleLabel(previousRole)}」切换为「${getRoleLabel(nextRole)}」吗？该操作会立即影响后台访问权限。`,
      "确认角色调整",
      {
        type: nextRole === "super_admin" ? "warning" : "info",
        confirmButtonText: "确认调整",
        cancelButtonText: "取消",
        closeOnClickModal: false
      }
    );
  } catch {
    return;
  }

  actionLoadingId.value = row.id;
  try {
    await updateAdminUserRole(row.id, nextRole);
    row.role = nextRole;
    ElMessage.success("角色已更新");
    await loadUsers();
    await refreshSelectedUserIfNeeded(row.id);
  } catch (error: any) {
    row.role = previousRole;
    ElMessage.error(error?.response?.data?.error?.message || "角色更新失败");
  } finally {
    actionLoadingId.value = "";
  }
}

function openCreditDialog(row: AdminUserItem) {
  creditForm.userId = row.id;
  creditForm.nickname = row.nickname;
  creditForm.delta = 100;
  creditForm.reason = "后台手动调整";
  creditDialogVisible.value = true;
}

async function submitCreditAdjustment() {
  if (!creditForm.userId) return;

  actionLoadingId.value = creditForm.userId;
  try {
    await adjustAdminUserCredits(
      creditForm.userId,
      Number(creditForm.delta || 0),
      creditForm.reason || "后台手动调整"
    );
    ElMessage.success("积分已更新");
    creditDialogVisible.value = false;
    await loadUsers();
    await refreshSelectedUserIfNeeded(creditForm.userId);
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.error?.message || "积分调整失败");
  } finally {
    actionLoadingId.value = "";
  }
}

function handleSearch() {
  page.value = 1;
  loadUsers();
}

function handleReset() {
  query.keyword = "";
  query.status = "";
  page.value = 1;
  loadUsers();
}

function handlePageChange(current: number) {
  page.value = current;
  loadUsers();
}

onMounted(async () => {
  await Promise.all([loadPlanOptions(), loadUsers()]);
});
</script>

<template>
  <div class="admin-users-page">
    <el-card shadow="never">
      <template #header>
        <div class="toolbar">
          <span>用户管理</span>
          <el-button type="primary" @click="loadUsers">刷新</el-button>
        </div>
      </template>

      <el-form inline class="mb-4">
        <el-form-item label="关键词">
          <el-input
            v-model="query.keyword"
            placeholder="昵称 / 邮箱 / 手机 / ID"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="users" stripe>
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column label="账号" min-width="220">
          <template #default="{ row }">
            <div>{{ row.email || row.phone || row.id }}</div>
            <small class="muted">{{ row.id }}</small>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="160">
          <template #default="{ row }">
            <el-select
              :model-value="row.role"
              size="small"
              :disabled="actionLoadingId === row.id || !canEditRole"
              @change="value => handleRoleChange(row, value)"
            >
              <el-option
                v-for="item in ROLE_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140">
          <template #default="{ row }">
            <el-select
              :model-value="row.status"
              size="small"
              :disabled="actionLoadingId === row.id"
              @change="value => handleStatusChange(row, value)"
            >
              <el-option
                v-for="item in STATUS_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="套餐 / 积分" min-width="220">
          <template #default="{ row }">
            <el-select
              :model-value="row.planCode"
              size="small"
              :disabled="actionLoadingId === row.id"
              @change="value => handlePlanChange(row, value)"
            >
              <el-option
                v-for="item in planOptions"
                :key="item.code"
                :label="`${item.name}（${item.code}）`"
                :value="item.code"
              />
            </el-select>
            <small class="muted block-info">
              积分：{{ row.creditBalance }}
            </small>
          </template>
        </el-table-column>
        <el-table-column prop="sessionCount" label="会话数" width="90" />
        <el-table-column label="注册时间" min-width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template #default="{ row }">
            <el-space wrap>
              <el-button link type="primary" @click="showUserDetail(row)">
                详情
              </el-button>
              <el-button link type="success" @click="openCreditDialog(row)">
                调积分
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="用户详情" width="560px">
      <div v-loading="detailLoading">
        <el-descriptions v-if="selectedUser" :column="2" border>
          <el-descriptions-item label="昵称">
            {{ selectedUser.nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="角色">
            {{ selectedUser.role }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ selectedUser.email || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="手机">
            {{ selectedUser.phone || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ getStatusLabel(selectedUser.status) }}
          </el-descriptions-item>
          <el-descriptions-item label="套餐">
            {{ selectedUser.planName }}
          </el-descriptions-item>
          <el-descriptions-item label="剩余积分">
            {{ selectedUser.creditBalance }}
          </el-descriptions-item>
          <el-descriptions-item label="会话数">
            {{ selectedUser.sessionCount }}
          </el-descriptions-item>
          <el-descriptions-item label="最近登录" :span="2">
            {{ formatDateTime(selectedUser.lastLoginAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间" :span="2">
            {{ formatDateTime(selectedUser.createdAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <el-dialog
      v-model="creditDialogVisible"
      title="调整用户积分"
      width="420px"
    >
      <el-form label-width="90px">
        <el-form-item label="用户">
          <span>{{ creditForm.nickname }}</span>
        </el-form-item>
        <el-form-item label="调整值">
          <el-input-number v-model="creditForm.delta" :step="10" />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="creditForm.reason" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="creditDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="actionLoadingId === creditForm.userId"
          @click="submitCreditAdjustment"
        >
          确认调整
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-users-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.muted {
  color: var(--el-text-color-secondary);
}

.block-info {
  display: block;
  margin-top: 6px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>