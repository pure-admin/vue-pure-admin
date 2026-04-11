<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import {
  getAdminRbacPolicy,
  updateAdminRbacPolicy,
  type AdminPermissionCatalogItem,
  type AdminRolePolicyItem
} from "@/api/admin";
import { hasPerms } from "@/utils/auth";

defineOptions({
  name: "AdminPermissions"
});

const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const editingCode = ref("");
const updatedAt = ref("");
const roles = ref<Array<AdminRolePolicyItem>>([]);
const permissionCatalog = ref<Array<AdminPermissionCatalogItem>>([]);

const query = reactive({
  keyword: "",
  kind: "",
  route: ""
});

const form = reactive({
  code: "",
  label: "",
  kind: "button",
  route: "",
  description: ""
});

const canEdit = computed(() => hasPerms("admin:rbac:update"));
const routeOptions = computed(() => {
  return Array.from(
    new Set(permissionCatalog.value.map(item => item.route).filter(Boolean))
  );
});
const filteredPermissions = computed(() => {
  const keyword = query.keyword.trim().toLowerCase();
  return permissionCatalog.value.filter(item => {
    const text = [item.code, item.label, item.route, item.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (keyword && !text.includes(keyword)) return false;
    if (query.kind && item.kind !== query.kind) return false;
    if (query.route && item.route !== query.route) return false;
    return true;
  });
});

function resetForm() {
  editingCode.value = "";
  form.code = "";
  form.label = "";
  form.kind = "button";
  form.route = "";
  form.description = "";
}

function deriveRoutesFromPermissions(permissions: Array<string>) {
  return Array.from(
    new Set(
      permissionCatalog.value
        .filter(item => permissions.includes(item.code) && item.route)
        .map(item => String(item.route))
    )
  );
}

function kindTagType(kind: string) {
  if (kind === "route") return "success";
  if (kind === "api") return "warning";
  return "info";
}

async function loadPolicy() {
  loading.value = true;
  try {
    const response = await getAdminRbacPolicy();
    roles.value = response.roles || [];
    permissionCatalog.value = response.permissionCatalog || [];
    updatedAt.value = response.updatedAt || "";
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "权限资源加载失败"
    );
  } finally {
    loading.value = false;
  }
}

async function persistCatalog(successMessage: string) {
  saving.value = true;
  const localRoles = roles.value.map(item => ({
    code: item.code,
    name: item.name,
    description: item.description,
    permissions: [...(item.permissions || [])]
  }));
  const localCatalog = permissionCatalog.value.map(item => ({
    code: item.code,
    label: item.label,
    kind: item.kind,
    route: item.route,
    description: item.description
  }));

  try {
    const response = await updateAdminRbacPolicy({
      roles: localRoles,
      permissionCatalog: localCatalog
    });
    if ((response.roles || []).length >= localRoles.length) {
      roles.value = response.roles || [];
    }
    if ((response.permissionCatalog || []).length >= localCatalog.length) {
      permissionCatalog.value = response.permissionCatalog || [];
    }
    updatedAt.value = response.updatedAt || new Date().toISOString();
    ElMessage.success(successMessage);
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "权限资源保存失败"
    );
  } finally {
    saving.value = false;
  }
}

function openCreateDialog() {
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: AdminPermissionCatalogItem) {
  editingCode.value = row.code;
  form.code = row.code;
  form.label = row.label;
  form.kind = row.kind || "button";
  form.route = row.route || "";
  form.description = row.description || "";
  dialogVisible.value = true;
}

async function submitPermission() {
  const code = form.code.trim();
  const label = form.label.trim();

  if (!code || !label) {
    ElMessage.warning("请先填写权限编码和权限名称");
    return;
  }

  const duplicate = permissionCatalog.value.some(
    item => item.code === code && item.code !== editingCode.value
  );
  if (duplicate) {
    ElMessage.warning("权限编码已存在，请更换后重试");
    return;
  }

  const nextItem: AdminPermissionCatalogItem = {
    code,
    label,
    kind: form.kind,
    route: form.route.trim() || undefined,
    description: form.description.trim() || undefined
  };

  if (editingCode.value && editingCode.value !== code) {
    roles.value = roles.value.map(item => ({
      ...item,
      permissions: item.permissions.map(permission =>
        permission === editingCode.value ? code : permission
      )
    }));
  }

  const targetIndex = permissionCatalog.value.findIndex(
    item => item.code === editingCode.value
  );
  if (targetIndex >= 0) {
    permissionCatalog.value.splice(targetIndex, 1, nextItem);
  } else {
    permissionCatalog.value.unshift(nextItem);
  }

  roles.value = roles.value.map(item => ({
    ...item,
    routes: deriveRoutesFromPermissions(item.permissions || [])
  }));

  dialogVisible.value = false;
  await persistCatalog(editingCode.value ? "权限资源已更新" : "权限资源已新增");
  resetForm();
}

async function handleDelete(row: AdminPermissionCatalogItem) {
  try {
    await ElMessageBox.confirm(
      `确认删除权限「${row.label}」吗？`,
      "删除权限资源",
      {
        type: "warning",
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        closeOnClickModal: false
      }
    );
  } catch {
    return;
  }

  permissionCatalog.value = permissionCatalog.value.filter(
    item => item.code !== row.code
  );
  roles.value = roles.value.map(item => ({
    ...item,
    permissions: (item.permissions || []).filter(code => code !== row.code),
    routes: deriveRoutesFromPermissions(
      (item.permissions || []).filter(code => code !== row.code)
    )
  }));
  await persistCatalog("权限资源已删除");
}

onMounted(loadPolicy);
</script>

<template>
  <div v-loading="loading" class="admin-permissions-page">
    <el-card shadow="never">
      <template #header>
        <div class="toolbar">
          <div>
            <div class="toolbar-title">路由管理</div>
            <small class="muted">
              统一维护路由、接口、按钮三类权限资源。
            </small>
          </div>
          <el-space>
            <el-tag type="info">最后更新：{{ updatedAt || "--" }}</el-tag>
            <el-button @click="loadPolicy">刷新</el-button>
            <el-button type="primary" :disabled="!canEdit" @click="openCreateDialog">
              新增权限
            </el-button>
          </el-space>
        </div>
      </template>

      <el-form inline class="mb-4">
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="编码 / 名称 / 路由" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="query.kind" placeholder="全部类型" clearable>
            <el-option label="路由" value="route" />
            <el-option label="接口" value="api" />
            <el-option label="按钮" value="button" />
          </el-select>
        </el-form-item>
        <el-form-item label="路由">
          <el-select v-model="query.route" placeholder="全部路由" clearable>
            <el-option
              v-for="item in routeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table :data="filteredPermissions" stripe>
        <el-table-column prop="label" label="权限名称" min-width="160" />
        <el-table-column prop="code" label="权限编码" min-width="220" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="kindTagType(row.kind)">{{ row.kind }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="route" label="路由 / 接口" min-width="180" />
        <el-table-column prop="description" label="说明" min-width="220" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-space>
              <el-button link type="primary" :disabled="!canEdit" @click="openEditDialog(row)">
                编辑
              </el-button>
              <el-button link type="danger" :disabled="!canEdit" @click="handleDelete(row)">
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="editingCode ? '编辑权限资源' : '新增权限资源'"
      width="560px"
    >
      <el-form label-width="88px">
        <el-form-item label="权限编码">
          <el-input v-model="form.code" placeholder="例如：admin:reports:view" />
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="form.label" placeholder="例如：查看报表页" />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select v-model="form.kind">
            <el-option label="路由" value="route" />
            <el-option label="接口" value="api" />
            <el-option label="按钮" value="button" />
          </el-select>
        </el-form-item>
        <el-form-item label="路由 / 接口">
          <el-input v-model="form.route" placeholder="例如：/manage/reports 或 /api/admin/reports" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canEdit" @click="submitPermission">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-permissions-page {
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

.muted {
  color: var(--el-text-color-secondary);
}

.mb-4 {
  margin-bottom: 16px;
}
</style>