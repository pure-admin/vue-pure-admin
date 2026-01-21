<template>
  <div class="p-5">
    <el-card shadow="never" class="mb-4">
      <div class="flex items-center gap-4">
        <el-input
          v-model="searchName"
          placeholder="请输入用户姓名（支持精确查询）"
          style="width: 300px"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" :loading="searching" @click="handleSearch">
          查询
        </el-button>
      </div>
    </el-card>

    <el-card v-if="searchResult.length > 0" shadow="never">
      <el-table :data="searchResult" border stripe>
        <el-table-column label="基本信息" width="180">
          <template #default="{ row }">
            <div class="font-bold text-gray-700">{{ row.real_name }}</div>
            <div class="text-xs text-gray-400">ID: {{ row.user_id }}</div>
          </template>
        </el-table-column>

        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role_name)" effect="light">
              {{ formatRoleName(row.role_name) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="college"
          label="所属学院"
          min-width="180"
          show-overflow-tooltip
        />

        <el-table-column label="详细信息" min-width="200">
          <template #default="{ row }">
            <div v-if="row.role_name === 'Student'" class="text-sm">
              <div>
                <span class="text-gray-400">专业：</span>{{ row.major || "-" }}
              </div>
              <div>
                <span class="text-gray-400">班级：</span>{{ row.clazz || "-" }}
              </div>
            </div>
            <div v-else-if="row.role_name === 'Teacher'" class="text-sm">
              <div>
                <span class="text-gray-400">职称：</span>{{ row.title || "无" }}
              </div>
              <div v-if="row.department">
                <span class="text-gray-400">科室：</span>{{ row.department }}
              </div>
            </div>
            <div v-else class="text-gray-400">--</div>
          </template>
        </el-table-column>

        <el-table-column label="联系方式" width="220">
          <template #default="{ row }">
            <div class="flex flex-col gap-1 text-xs">
              <div v-if="row.phone" class="flex items-center gap-1">
                <el-icon><Phone /></el-icon>
                {{ formatPhone(row.phone) }}
              </div>
              <div
                v-if="row.email"
                class="flex items-center gap-1 text-blue-500"
              >
                <el-icon><Message /></el-icon>
                {{ row.email }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-empty v-else-if="hasSearched" description="未找到匹配的用户" />

    <el-dialog
      v-model="dialogVisible"
      :title="`账号管理: ${editForm.user_id}`"
      width="480px"
      destroy-on-close
    >
      <el-form :model="editForm" label-width="80px" label-position="top">
        <el-form-item label="分配角色 (Groups)">
          <el-select
            v-model="editForm.groups"
            multiple
            placeholder="请选择角色"
            class="w-full"
          >
            <el-option
              v-for="role in allRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">安全设置</el-divider>
        <el-alert
          title="如不修改密码请留空"
          type="info"
          :closable="false"
          show-icon
          class="mb-4"
        />

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="新密码">
              <el-input
                v-model="editForm.password"
                type="password"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码">
              <el-input
                v-model="editForm.re_password"
                type="password"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitEdit"
          >保存更改</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { message } from "@/utils/message";
import { Phone, Message } from "@element-plus/icons-vue"; // 需要安装 @element-plus/icons-vue
import {
  searchUserByName,
  updateUserAccount,
  getAllRoles,
  type RoleItem,
  type UserProfileSearchItem
} from "@/api/user";
import type { TagProps } from "element-plus";

const searchName = ref("");
const searching = ref(false);
const hasSearched = ref(false);
const searchResult = ref<UserProfileSearchItem[]>([]);

const dialogVisible = ref(false);
const submitting = ref(false);
const allRoles = ref<RoleItem[]>([]);
const editForm = ref({
  user_id: "",
  password: "",
  re_password: "",
  groups: [] as number[]
});

// 格式化手机号（处理返回数据中的 .0）
const formatPhone = (phone: string | null) => {
  if (!phone) return "--";
  return phone.replace(".0", "");
};

// 格式化角色显示名称
const formatRoleName = (role: string) => {
  const map: Record<string, string> = {
    Student: "学生",
    Teacher: "教师",
    Admin: "管理员",
    Administrator: "超级管理员",
    CompetitionAdministrator: "竞赛管理员"
  };
  return map[role] || role;
};

// 角色颜色映射
const getRoleType = (roleName: string): TagProps["type"] => {
  const map: Record<string, TagProps["type"]> = {
    Admin: "danger",
    Administrator: "danger",
    Teacher: "success",
    Student: "info",
    CompetitionAdministrator: "warning"
  };
  // 如果找不到，返回一个有效的默认值，比如 'info' 或空字符串
  return map[roleName] || "info";
};

const handleSearch = async () => {
  if (!searchName.value.trim())
    return message("请输入姓名", { type: "warning" });
  searching.value = true;
  try {
    const res = await searchUserByName(searchName.value);
    searchResult.value = res;
    hasSearched.value = true;
  } catch (e) {
    console.error(e);
  } finally {
    searching.value = false;
  }
};

const openEditDialog = (row: UserProfileSearchItem) => {
  // 匹配角色 ID
  const matchedRole = allRoles.value.find(r => r.name === row.role_name);
  editForm.value = {
    user_id: row.user_id,
    password: "",
    re_password: "",
    groups: matchedRole ? [matchedRole.id] : []
  };
  dialogVisible.value = true;
};

const submitEdit = async () => {
  if (
    editForm.value.password &&
    editForm.value.password !== editForm.value.re_password
  ) {
    return message("两次密码输入不一致", { type: "error" });
  }

  submitting.value = true;
  try {
    const data: any = { groups: editForm.value.groups };
    if (editForm.value.password) {
      data.password = editForm.value.password;
      data.re_password = editForm.value.re_password;
    }
    await updateUserAccount(editForm.value.user_id, data);
    message("修改成功", { type: "success" });
    dialogVisible.value = false;
    handleSearch();
  } finally {
    submitting.value = false;
  }
};

const fetchAllRoles = async () => {
  try {
    allRoles.value = await getAllRoles();
  } catch (e) {
    console.error("加载角色失败", e);
  }
};

onMounted(() => {
  fetchAllRoles();
});
</script>

<style scoped>
:deep(.el-table .cell) {
  line-height: 1.6;
}
</style>
