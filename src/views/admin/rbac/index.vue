<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";

import {
  getAdminRbacPolicy,
  updateAdminRbacPolicy,
  type AdminPermissionCatalogItem,
  type AdminRolePolicyItem
} from "@/api/admin";
import { hasPerms } from "@/utils/auth";

defineOptions({
  name: "AdminRbac"
});

const loading = ref(false);
const saving = ref(false);
const updatedAt = ref("");
const roles = ref<Array<AdminRolePolicyItem>>([]);
const permissionCatalog = ref<Array<AdminPermissionCatalogItem>>([]);

const canEdit = computed(() => hasPerms("admin:rbac:update"));

const groupedPermissions = computed(() => {
  const groups = new Map<string, Array<AdminPermissionCatalogItem>>();
  permissionCatalog.value
    .filter(item => item.code !== "health:chat")
    .forEach(item => {
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

function roleBadgeType(roleCode: string) {
  if (roleCode === "super_admin") return "danger";
  if (roleCode === "admin") return "warning";
  if (roleCode === "operator") return "success";
  return "info";
}

function ensureSuperAdminPermissions(role: AdminRolePolicyItem) {
  if (role.code === "super_admin") {
    role.permissions = ["*:*:*"];
  }
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
      error?.response?.data?.error?.message || "权限配置加载失败"
    );
  } finally {
    loading.value = false;
  }
}

async function savePolicy() {
  if (!canEdit.value) {
    ElMessage.warning("当前账号没有保存权限绑定的权限");
    return;
  }

  saving.value = true;
  try {
    roles.value.forEach(ensureSuperAdminPermissions);
    const response = await updateAdminRbacPolicy({
      roles: roles.value.map(item => ({
        code: item.code,
        name: item.name,
        description: item.description,
        permissions: item.permissions
      })),
      permissionCatalog: permissionCatalog.value.map(item => ({
        code: item.code,
        label: item.label,
        kind: item.kind,
        route: item.route,
        description: item.description
      }))
    });
    roles.value = response.roles || [];
    permissionCatalog.value = response.permissionCatalog || [];
    updatedAt.value = response.updatedAt || "";
    ElMessage.success("角色与路由/按钮权限绑定已保存");
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.error?.message || "权限绑定保存失败"
    );
  } finally {
    saving.value = false;
  }
}

onMounted(loadPolicy);
</script>

<template>
  <div v-loading="loading" class="admin-rbac-page">
    <el-card shadow="never">
      <template #header>
        <div class="toolbar">
          <div>
            <div class="toolbar-title">角色权限绑定</div>
            <small class="muted">
              总管理员可在这里维护“角色 → 路由 / 按钮权限”的映射。
            </small>
          </div>
          <el-space>
            <el-tag type="info">最后更新：{{ updatedAt || "--" }}</el-tag>
            <el-button @click="loadPolicy">刷新</el-button>
            <el-button
              type="primary"
              :loading="saving"
              :disabled="!canEdit"
              @click="savePolicy"
            >
              保存绑定
            </el-button>
          </el-space>
        </div>
      </template>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        class="mb-4"
        title="提示：修改绑定后，对应账号重新登录或刷新令牌后，菜单和按钮权限会同步生效。"
      />

      <el-row :gutter="16">
        <el-col
          v-for="role in roles"
          :key="role.code"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
        >
          <el-card shadow="hover" class="role-card">
            <template #header>
              <div class="role-header">
                <div>
                  <strong>{{ role.name }}</strong>
                  <small class="muted block-info">{{ role.description }}</small>
                </div>
                <el-tag :type="roleBadgeType(role.code)">
                  {{ role.code }}
                </el-tag>
              </div>
            </template>

            <div class="mb-3">
              <div class="section-label">可分配角色</div>
              <el-space wrap>
                <el-tag
                  v-for="item in role.canAssignRoles"
                  :key="`${role.code}-${item}`"
                  size="small"
                >
                  {{ item }}
                </el-tag>
                <span v-if="!role.canAssignRoles?.length" class="muted">
                  无
                </span>
              </el-space>
            </div>

            <div class="mb-3">
              <div class="section-label">当前可访问路由</div>
              <el-space wrap>
                <el-tag
                  v-for="route in role.routes"
                  :key="`${role.code}-${route}`"
                  type="success"
                  effect="plain"
                >
                  {{ route }}
                </el-tag>
                <span v-if="!role.routes?.length" class="muted">无</span>
              </el-space>
            </div>

            <div
              v-for="group in groupedPermissions"
              :key="`${role.code}-${group.route}`"
              class="permission-group"
            >
              <div class="section-label">{{ group.title }}</div>
              <el-checkbox-group
                v-model="role.permissions"
                :disabled="!canEdit || role.code === 'super_admin'"
                @change="ensureSuperAdminPermissions(role)"
              >
                <el-checkbox
                  v-for="item in group.items"
                  :key="item.code"
                  :label="item.code"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.admin-rbac-page {
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

.role-card {
  margin-bottom: 16px;
}

.role-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.section-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.permission-group + .permission-group {
  margin-top: 12px;
}

.block-info {
  display: block;
  margin-top: 4px;
}

.muted {
  color: var(--el-text-color-secondary);
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>