<script setup lang="ts">
import { ref, reactive } from "vue";
import Motion from "../utils/motion";
import { updateRules } from "../utils/rule";
import { message } from "@pureadmin/components";
import type { FormInstance } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
import { useUserStoreHook } from "/@/store/modules/user";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

const checked = ref(false);
const loading = ref(false);
const ruleForm = reactive({
  username: "",
  phone: "",
  verifyCode: "",
  password: "",
  repeatPassword: ""
});
const ruleFormRef = ref<FormInstance>();
const { isDisabled, text } = useVerifyCode();
const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (ruleForm.password !== value) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

const onUpdate = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (checked.value) {
        // 模拟请求，需根据实际开发进行修改
        setTimeout(() => {
          message.success("注册成功");
          loading.value = false;
        }, 2000);
      } else {
        loading.value = false;
        message.warning("请勾选隐私政策");
      }
    } else {
      loading.value = false;
      return fields;
    }
  });
};

function onBack() {
  useVerifyCode().end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="updateRules"
    size="large"
  >
    <Motion>
      <el-form-item
        :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        prop="username"
      >
        <el-input
          clearable
          v-model="ruleForm.username"
          placeholder="账号"
          :prefix-icon="useRenderIcon('user')"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="100">
      <el-form-item prop="phone">
        <el-input
          clearable
          v-model="ruleForm.phone"
          placeholder="手机号码"
          :prefix-icon="useRenderIcon('iphone')"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="verifyCode">
        <div class="w-full flex justify-between">
          <el-input
            clearable
            v-model="ruleForm.verifyCode"
            placeholder="短信验证码"
            :prefix-icon="
              useRenderIcon('ri:shield-keyhole-line', { online: true })
            "
          />
          <el-button
            :disabled="isDisabled"
            class="ml-2"
            @click="useVerifyCode().start(ruleFormRef, 'phone')"
          >
            {{ text }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <Motion :delay="200">
      <el-form-item prop="password">
        <el-input
          clearable
          show-password
          v-model="ruleForm.password"
          placeholder="密码"
          :prefix-icon="useRenderIcon('lock')"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
        <el-input
          clearable
          show-password
          v-model="ruleForm.repeatPassword"
          placeholder="确认密码"
          :prefix-icon="useRenderIcon('lock')"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="300">
      <el-form-item>
        <el-checkbox v-model="checked"> 我已仔细阅读并接受 </el-checkbox>
        <el-button link type="primary"> 《隐私政策》 </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="350">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="onUpdate(ruleFormRef)"
        >
          确定
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="400">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          返回
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
