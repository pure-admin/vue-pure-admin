<template>
  <div class="p-5">
    <el-card shadow="never" class="mb-4">
      <div class="flex items-center gap-4">
        <el-input
          v-model="searchName"
          placeholder="请输入用户姓名进行精确查询"
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
        <el-table-column prop="real_name" label="姓名" width="100" />
        <el-table-column prop="user_id" label="学号/工号" width="140" />
        <el-table-column prop="department" label="学院/部门" />
        <el-table-column label="当前身份" width="150">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role_name)" effect="plain">
              {{ row.role_name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
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
      :title="`编辑用户: ${editForm.user_id}`"
      width="460px"
    >
      <el-form :model="editForm" label-width="80px" label-position="top">
        <el-alert
          title="若不修改密码，请将密码框留空"
          type="info"
          :closable="false"
          class="mb-4"
        />
        <el-row :gutter="20">
          <el-col :span="24">
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
          </el-col>
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
import {
  searchUserByName,
  updateUserAccount,
  deleteUser,
  type UserProfileSearchItem,
  getAllRoles,
  RoleItem
} from "@/api/user";

const searchName = ref("");
const searching = ref(false);
const hasSearched = ref(false);
const searchResult = ref<UserProfileSearchItem[]>([]);

const dialogVisible = ref(false);
const submitting = ref(false);
const editForm = ref({
  user_id: "",
  password: "",
  re_password: "",
  groups: [] as number[]
});
const allRoles = ref<RoleItem[]>([]); // 存储所有角色

// 1. 查询逻辑
const handleSearch = async () => {
  if (!searchName.value) return message("请输入姓名", { type: "warning" });
  searching.value = true;
  try {
    const res = await searchUserByName(searchName.value);
    searchResult.value = res;
    hasSearched.value = true;
  } finally {
    searching.value = false;
  }
};

// 3. 提交修改
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
    handleSearch(); // 刷新列表
  } finally {
    submitting.value = false;
  }
};

// 4. 删除逻辑
const handleDelete = async (userId: string) => {
  try {
    await deleteUser(userId);
    message("删除成功", { type: "success" });
    handleSearch();
  } catch (e) {
    message("删除失败", { type: "error" });
  }
};

// 获取所有角色
const fetchAllRoles = async () => {
  try {
    allRoles.value = await getAllRoles();
  } catch (e) {
    console.error("加载角色失败", e);
  }
};

// 角色颜色映射（纯展示用）
const getRoleType = (roleName: string) => {
  const map: any = {
    Admin: "danger",
    Administrator: "danger",
    Teacher: "success",
    Student: "info",
    CompetitionAdministrator: "warning"
  };
  return map[roleName] || "";
};

// 打开编辑弹窗的增强逻辑
const openEditDialog = (row: UserProfileSearchItem) => {
  // 核心优化：根据 row.role_name 在 allRoles 中找到对应的 ID
  const matchedRole = allRoles.value.find(r => r.name === row.role_name);
  editForm.value = {
    user_id: row.user_id,
    password: "",
    re_password: "",
    // 如果找到了匹配的角色，默认勾选它
    groups: matchedRole ? [matchedRole.id] : []
  };
  dialogVisible.value = true;
};

onMounted(() => {
  fetchAllRoles(); // 初始化加载
});
</script>
