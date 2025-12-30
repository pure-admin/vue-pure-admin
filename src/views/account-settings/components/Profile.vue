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
        <el-tag>{{ form.role_name }}</el-tag>
      </el-form-item>
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

const form = ref({
  user_id: "",
  real_name: "",
  phone: "",
  email: "",
  department: "",
  role_name: ""
});

const loadProfile = async () => {
  try {
    const res = await getUserProfile();
    // 关键判断：确保 res 是对象且包含数据
    if (res && typeof res === "object") {
      form.value = res;
    } else {
      console.error("接口返回数据格式错误，请检查后端地址或权限", res);
    }
  } catch (e) {
    console.error("请求失败", e);
  }
};

const handleUpdate = async () => {
  try {
    await updateUserProfile(form.value);
    message("修改成功", { type: "success" });
  } catch (e) {}
};

onMounted(loadProfile);
</script>
