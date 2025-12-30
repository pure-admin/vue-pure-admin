<template>
  <div class="p-4">
    <el-form :model="pwdForm" label-width="100px" class="max-w-[500px]">
      <el-form-item label="旧密码">
        <el-input v-model="pwdForm.old_password" show-password />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="pwdForm.new_password" show-password />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="pwdForm.confirm_password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="onSubmit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { changePassword } from "@/api/user";
import { message } from "@/utils/message";

const pwdForm = reactive({
  old_password: "",
  new_password: "",
  confirm_password: ""
});

const onSubmit = async () => {
  if (pwdForm.new_password !== pwdForm.confirm_password) {
    message("两次新密码输入不一致", { type: "error" });
    return;
  }
  try {
    const res = await changePassword(pwdForm);
    message(res.message || "修改成功", { type: "success" });
    // 重置表单
    pwdForm.old_password = "";
    pwdForm.new_password = "";
    pwdForm.confirm_password = "";
  } catch (e) {}
};
</script>
