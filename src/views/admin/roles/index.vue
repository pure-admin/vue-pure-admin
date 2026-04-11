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
  name: "AdminRoles"
});

const BUILTIN_ROLE_CODES = ["super_admin", "admin", "operator", "user"];

const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const editingCode = ref("");
const updatedAt = ref("");
const roles = ref<Array<AdminRolePolicyItem>>([]);
const permissionCatalog = ref<Array<AdminPermissionCatalogItem>>([]);

const form = reactive({
  code: "",
  name: "",
  description: "",
  permissions: [] as Array<string>
});

const canEdit = computed(() => hasPerms("admin:rbac:update"));
const groupedPermissions = computed(() => {
  const groups = new Map<string, Array<AdminPermissionCatalogItem>>();
  permissionCatalog.value.forEach(item => {
    const groupKey = item.route || "其它";
    const current = groups.get(groupKey) || [];
    current.push(item);
    groups.set(groupKey, current);
  });

  return Array.from(groups.entries()).map(([route, items]) => ({
    route,
    title: route === "/" ? "前台能力" : route,
    items
  }));
});

function deriveRoutesFromPermissions(permissions: Array<string>) {
  return Array.from(
    new Set(
      permissionCatalog.value
        .filter(item => permissions.includes(item.code) && item.route)
        .map(item => String(item.route))
    )
  );
}

function resetForm() {
  editingCode.value = "";
  form.code = "";
  form.name = "";
  form.description = "";
  form.permissions = [];
}

async function loadPolicy() {
  loading.value = true;
  try {
    const response = await getAdminRbacPolicy();
    roles.value = (response.roles || []).map(item => ({
      ...item,
      permissions: [...(item.permissions || [])],
      routes: [...(item.routes || [])],
      canAssignRoles: [...(item.canAssignRoles || [])]
    }));
    permissionCatalog.value = response.permissionCatalog || [];
    updatedAt.value = response.updatedAt || "";
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "角色策略加载失败"
    );
  } finally {
    loading.value = false;
  }
}

async function persistRoles(successMessage: string) {
  saving.value = true;
  const localRoles = roles.value.map(item => ({
    code: item.code,
    name: item.name,
    description: item.description,
    permissions: [...(item.permissions || [])]
  }));
  const localPermissionCatalog = permissionCatalog.value.map(item => ({
    code: item.code,
    label: item.label,
    kind: item.kind,
    route: item.route,
    description: item.description
  }));

  try {
    const response = await updateAdminRbacPolicy({
      roles: localRoles,
      permissionCatalog: localPermissionCatalog
    });

    if ((response.roles || []).length >= localRoles.length) {
      roles.value = response.roles || [];
    }
    if (
      (response.permissionCatalog || []).length >= localPermissionCatalog.length
    ) {
      permissionCatalog.value = response.permissionCatalog || [];
    }
    updatedAt.value = response.updatedAt || new Date().toISOString();
    ElMessage.success(successMessage);
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "角色策略保存失败"
    );
  } finally {
    saving.value = false;
  }
}

function openCreateDialog() {
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: AdminRolePolicyItem) {
  editingCode.value = row.code;
  form.code = row.code;
  form.name = row.name;
  form.description = row.description || "";
  form.permissions = [...(row.permissions || [])];
  dialogVisible.value = true;
}

async function handleDelete(row: AdminRolePolicyItem) {
  if (BUILTIN_ROLE_CODES.includes(row.code)) {
    ElMessage.warning("内置角色不建议删除，可直接编辑权限。");
    return;
  }

  try {
    await ElMessageBox.confirm(`确认删除角色「${row.name}」吗？`, "删除角色", {
      type: "warning",
      confirmButtonText: "确认删除",
      cancelButtonText: "取消",
      closeOnClickModal: false
    });
  } catch {
    return;
  }

  roles.value = roles.value.filter(item => item.code !== row.code);
  await persistRoles("角色已删除");
}

async function submitRole() {
  const normalizedCode = form.code.trim().toLowerCase().replace(/\s+/g, "_");
  const name = form.name.trim();

  if (!normalizedCode || !name) {
    ElMessage.warning("请先填写角色编码和角色名称");
    return;
  }

  const duplicate = roles.value.some(
    item => item.code === normalizedCode && item.code !== editingCode.value
  );
  if (duplicate) {
    ElMessage.warning("角色编码已存在，请更换后再保存");
    return;
  }

  const nextRole: AdminRolePolicyItem = {
    code: normalizedCode,
    name,
    description: form.description.trim(),
    permissions: Array.from(new Set(form.permissions)),
    routes: deriveRoutesFromPermissions(form.permissions),
    canAssignRoles:
      roles.value.find(item => item.code === editingCode.value)
        ?.canAssignRoles || []
  };

  const targetIndex = roles.value.findIndex(
    item => item.code === editingCode.value
  );
  if (targetIndex >= 0) {
    roles.value.splice(targetIndex, 1, nextRole);
  } else {
    roles.value.push(nextRole);
  }

  dialogVisible.value = false;
  await persistRoles(editingCode.value ? "角色已更新" : "角色已新增");
  resetForm();
}

onMounted(loadPolicy);
</script>

<template>
  <div v-loading="loading" class="admin-roles-page">
    <el-card shadow="never">
      <template #header>
        <div class="toolbar">
          <div>
            <div class="toolbar-title">角色管理</div>
            <small class="muted">支持角色增删改查，并为角色绑定权限。</small>
          </div>
          <el-space>
            <el-tag type="info">最后更新：{{ updatedAt || "--" }}</el-tag>
            <el-button @click="loadPolicy">刷新</el-button>
            <el-button
              type="primary"
              :disabled="!canEdit"
              @click="openCreateDialog"
            >
              新增角色
            </el-button>
          </el-space>
        </div>
      </template>

      <el-table :data="roles" stripe>
        <el-table-column prop="name" label="角色名称" min-width="140" />
        <el-table-column prop="code" label="角色编码" min-width="140" />
        <el-table-column prop="description" label="说明" min-width="220" />
        <el-table-column label="权限数" width="100">
          <template #default="{ row }">
            {{ row.permissions?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="路由数" width="100">
          <template #default="{ row }">
            {{ row.routes?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="可分配角色" min-width="180">
          <template #default="{ row }">
            <el-space wrap>
              <el-tag
                v-for="item in row.canAssignRoles || []"
                :key="`${row.code}-${item}`"
                size="small"
                effect="plain"
              >
                {{ item }}
              </el-tag>
              <span v-if="!row.canAssignRoles?.length" class="muted">无</span>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-space>
              <el-button
                link
                type="primary"
                :disabled="!canEdit"
                @click="openEditDialog(row)"
              >
                编辑
              </el-button>
              <el-button
                link
                type="danger"
                :disabled="!canEdit"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="editingCode ? '编辑角色' : '新增角色'"
      width="720px"
    >
      <el-form label-width="88px">
        <el-form-item label="角色编码">
          <el-input
            v-model="form.code"
            :disabled="Boolean(editingCode)"
            placeholder="例如：content_auditor"
          />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="form.name" placeholder="例如：内容审核员" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="权限绑定">
          <div class="permission-panel">
            <div
              v-for="group in groupedPermissions"
              :key="group.route"
              class="permission-group"
            >
              <div class="group-title">{{ group.title }}</div>
              <el-checkbox-group v-model="form.permissions">
                <el-checkbox
                  v-for="item in group.items"
                  :key="item.code"
                  :label="item.code"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="saving"
          :disabled="!canEdit"
          @click="submitRole"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-roles-page {
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

.permission-panel {
  width: 100%;
}

.permission-group + .permission-group {
  margin-top: 12px;
}

.group-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
}
</style>