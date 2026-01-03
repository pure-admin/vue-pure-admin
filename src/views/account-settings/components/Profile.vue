<template>
  <div class="p-4">
    <el-form :model="form" label-width="100px" class="max-w-[500px]">
      <el-form-item label="学/工号">
        <el-input v-model="form.user_id" disabled />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.real_name" />
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="form.department" disabled />
      </el-form-item>
      <el-form-item label="角色">
        <el-tag :type="form.role_name === 'Teacher' ? 'success' : 'primary'">
          {{
            form.role_name === "Teacher"
              ? "教师"
              : form.role_name === "Student"
                ? "学生"
                : form.role_name === "Administrator"
                  ? "管理员"
                  : "竞赛管理员"
          }}
        </el-tag>
      </el-form-item>

      <el-form-item v-if="form.role_name === 'Teacher'" label="职称">
        <el-input v-model="form.title" placeholder="请输入职称" />
      </el-form-item>

      <template v-if="form.role_name === 'Student'">
        <el-form-item label="专业">
          <el-input v-model="form.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="form.clazz" placeholder="请输入班级" />
        </el-form-item>
      </template>

      <el-form-item label="手机号">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdate">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUserProfile, updateUserProfile } from "@/api/user";
import { message } from "@/utils/message";

// 1. 初始化时包含所有可能用到的字段
const form = ref({
  user_id: "",
  real_name: "",
  phone: "",
  email: "",
  department: "",
  role_name: "",
  title: "",
  major: "",
  clazz: ""
});

const loadProfile = async () => {
  try {
    const res = await getUserProfile();
    if (res && typeof res === "object") {
      // 2. 使用对象展开运算符或 Object.assign 确保响应式更新
      form.value = { ...form.value, ...res };
    } else {
      console.error("接口返回数据格式错误", res);
    }
  } catch (e) {
    console.error("请求失败", e);
  }
};

const handleUpdate = async () => {
  try {
    // 3. 提交前可以根据角色过滤掉不必要的字段（可选）
    await updateUserProfile(form.value);
    message("修改成功", { type: "success" });
  } catch (e) {
    console.error(e);
  }
};

onMounted(loadProfile);
</script>
