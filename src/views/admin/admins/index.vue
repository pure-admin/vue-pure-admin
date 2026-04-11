<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import {
  getAdminRbacPolicy,
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserRoles,
  type AdminRolePolicyItem,
  type AdminUserItem
} from "@/api/admin";
import { hasPerms } from "@/utils/auth";
import { formatDateTime } from "@/utils/dateTime";

defineOptions({
  name: "AdminManagers"
});

const ADMIN_ROLE_CODES = ["super_admin", "admin", "operator"];
const FALLBACK_ROLE_OPTIONS = [
  { code: "super_admin", name: "总管理员" },
  { code: "admin", name: "管理员" },
  { code: "operator", name: "运营" },
  { code: "user", name: "普通用户" }
];

const loading = ref(false);
const actionLoadingId = ref("");
const updatedAt = ref("");
const users = ref<Array<AdminUserItem>>([]);
const rolePolicies = ref<Array<AdminRolePolicyItem>>([]);
const showOnlyAdmin = ref(true);
const page = ref(1);
const pageSize = ref(10);

const query = reactive({
  keyword: "",
  status: ""
});

const canBindRoles = computed(() => hasPerms("admin:users:role"));
const roleOptions = computed(() => {
  return rolePolicies.value.length
    ? rolePolicies.value.map(item => ({ code: item.code, name: item.name }))
    : FALLBACK_ROLE_OPTIONS;
});

function normalizeRoleArray(row: AdminUserItem) {
  const raw =
    Array.isArray(row.roles) && row.roles.length ? row.roles : [row.role];
  return Array.from(
    new Set(raw.map(item => String(item || "").trim()).filter(Boolean))
  );
}

function isAdminRow(row: AdminUserItem) {
  return normalizeRoleArray(row).some(role => ADMIN_ROLE_CODES.includes(role));
}

function getRoleName(roleCode: string) {
  return (
    roleOptions.value.find(item => item.code === roleCode)?.name || roleCode
  );
}

const filteredUsers = computed(() => {
  const keyword = query.keyword.trim().toLowerCase();
  return users.value.filter(row => {
    const text = [row.nickname, row.email, row.phone, row.id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (keyword && !text.includes(keyword)) return false;
    if (query.status && row.status !== query.status) return false;
    if (showOnlyAdmin.value && !isAdminRow(row)) return false;
    return true;
  });
});

const pagedUsers = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});

async function loadData() {
  loading.value = true;
  try {
    const [userResponse, policyResponse] = await Promise.all([
      getAdminUsers({ page: 1, pageSize: 100 }),
      getAdminRbacPolicy().catch(() => ({
        roles: [],
        permissionCatalog: [],
        updatedAt: ""
      }))
    ]);

    users.value = (userResponse.list || []).map(item => ({
      ...item,
      roles: normalizeRoleArray(item)
    }));
    rolePolicies.value = policyResponse.roles || [];
    updatedAt.value = policyResponse.updatedAt || "";
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "管理员列表加载失败"
    );
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  page.value = 1;
}

function handleReset() {
  query.keyword = "";
  query.status = "";
  showOnlyAdmin.value = true;
  page.value = 1;
}

async function handleRolesChange(row: AdminUserItem, nextRoles: Array<string>) {
  const previousRoles = normalizeRoleArray(row);
  const normalized = Array.from(
    new Set(
      (nextRoles || []).map(item => String(item || "").trim()).filter(Boolean)
    )
  );

  if (!normalized.length) normalized.push("user");
  if (JSON.stringify(normalized) === JSON.stringify(previousRoles)) return;

  try {
    await ElMessageBox.confirm(
      `确认调整管理员「${row.nickname}」的角色绑定为：${normalized.map(getRoleName).join("、")}？`,
      "确认角色绑定",
      {
        type: normalized.includes("super_admin") ? "warning" : "info",
        confirmButtonText: "确认保存",
        cancelButtonText: "取消",
        closeOnClickModal: false
      }
    );
  } catch {
    row.roles = previousRoles;
    return;
  }

  actionLoadingId.value = row.id;
  try {
    if (normalized.length > 1) {
      await updateAdminUserRoles(row.id, normalized);
    } else {
      await updateAdminUserRole(row.id, normalized[0]);
    }

    row.roles = normalized;
    row.role = normalized[0];
    ElMessage.success("管理员角色绑定已更新");
  } catch (error: any) {
    row.roles = previousRoles;
    row.role = previousRoles[0] || row.role;
    ElMessage.error(
      error?.response?.data?.error?.message || "管理员角色绑定失败"
    );
  } finally {
    actionLoadingId.value = "";
  }
}

onMounted(loadData);
</script>

<template>
  <div class="admin-managers-page">
    <el-card shadow="never">
      <template #header>
        <div class="toolbar">
          <div>
            <div class="toolbar-title">管理员管理</div>
            <small class="muted">
              可查看后台账号，并为管理员绑定一个或多个角色。
            </small>
          </div>
          <el-space>
            <el-tag type="info">策略时间：{{ updatedAt || "--" }}</el-tag>
            <el-button type="primary" @click="loadData">刷新</el-button>
          </el-space>
        </div>
      </template>

      <el-alert
        class="mb-4"
        type="info"
        :closable="false"
        show-icon
        title="当前单角色接口可直接生效；如果后端已升级多角色接口，多个角色会一并保存。"
      />

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
        <el-form-item label="只看后台账号">
          <el-switch v-model="showOnlyAdmin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="pagedUsers" stripe>
        <el-table-column label="管理员" min-width="220">
          <template #default="{ row }">
            <div>{{ row.nickname }}</div>
            <small class="muted">{{ row.email || row.phone || row.id }}</small>
          </template>
        </el-table-column>
        <el-table-column label="当前角色" min-width="180">
          <template #default="{ row }">
            <el-space wrap>
              <el-tag
                v-for="roleCode in normalizeRoleArray(row)"
                :key="`${row.id}-${roleCode}`"
                size="small"
              >
                {{ getRoleName(roleCode) }}
              </el-tag>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column label="角色绑定" min-width="320">
          <template #default="{ row }">
            <el-select
              :model-value="normalizeRoleArray(row)"
              multiple
              collapse-tags
              collapse-tags-tooltip
              size="small"
              :disabled="actionLoadingId === row.id || !canBindRoles"
              placeholder="选择角色"
              @change="value => handleRolesChange(row, value)"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === "active" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最近登录" min-width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.lastLoginAt) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page="page"
          :page-size="pageSize"
          :total="filteredUsers.length"
          @current-change="value => (page = value)"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.admin-managers-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 600;
}

.mb-4 {
  margin-bottom: 16px;
}

.muted {
  color: var(--el-text-color-secondary);
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>