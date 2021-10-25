<script setup lang="ts">
import { ref, PropType, getCurrentInstance, watch, nextTick, toRef } from "vue";
import { useRouter, useRoute } from "vue-router";
import { initRouter } from "/@/router";
import { storageSession } from "/@/utils/storage";

import bgText from "/@/assets/bg-text.png";
import bgLogo from "/@/assets/bg-logo.png";

export interface ContextProps {
  userName: string;
  passWord: string;
  verify: number | null;
  svg: any;
  telephone?: number;
  dynamicText?: string;
}

const props = defineProps({
  ruleForm: {
    type: Object as PropType<ContextProps>
  }
});

const emit = defineEmits<{
  (e: "onBehavior", evt: Object): void;
  (e: "refreshVerify"): void;
}>();

const instance = getCurrentInstance();

const model = toRef(props, "ruleForm");
let tips = ref<string>("注册");
let tipsFalse = ref<string>("登录");

const route = useRoute();
const router = useRouter();

watch(
  route,
  async ({ path }): Promise<void> => {
    await nextTick();
    path.includes("register")
      ? (tips.value = "登录") && (tipsFalse.value = "注册")
      : (tips.value = "注册") && (tipsFalse.value = "登录");
  },
  { immediate: true }
);

const rules = ref<any>({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  passWord: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度必须不小于6位", trigger: "blur" }
  ],
  verify: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { type: "number", message: "验证码必须是数字类型", trigger: "blur" }
  ]
});

// 点击登录或注册
const onBehavior = (evt: Object): void => {
  // @ts-expect-error
  instance.refs.ruleForm.validate((valid: boolean) => {
    if (valid) {
      emit("onBehavior", evt);
    } else {
      return false;
    }
  });
};

// 刷新验证码
const refreshVerify = (): void => {
  emit("refreshVerify");
};

// 表单重置
const resetForm = (): void => {
  // @ts-expect-error
  instance.refs.ruleForm.resetFields();
};

// 登录、注册页面切换
const changPage = (): void => {
  tips.value === "注册" ? router.push("/register") : router.push("/login");
};

const noSecret = (): void => {
  storageSession.setItem("info", {
    username: "admin",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
  });
  initRouter("admin").then(() => {});
  router.push("/");
};
</script>

<template>
  <div>
    <div style="margin: 20px 0 0 10px">
      <img :src="bgLogo" width="100" height="80" />
      <img :src="bgText" width="180" height="30" style="margin-bottom: 6px" />
    </div>
    <div class="info">
      <el-form :model="model" :rules="rules" ref="ruleForm" class="rule-form">
        <el-form-item prop="userName">
          <el-input
            clearable
            v-model="model.userName"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            clearable
            type="password"
            show-password
            v-model="model.passWord"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verify">
          <el-input
            maxlength="2"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
            v-model.number="model.verify"
            placeholder="请输入验证码"
          ></el-input>
          <span
            class="verify"
            title="刷新"
            v-html="model.svg"
            @click.prevent="refreshVerify"
          ></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="onBehavior">{{
            tipsFalse
          }}</el-button>
          <el-button @click="resetForm">重置</el-button>
          <span class="tips" @click="changPage">{{ tips }}</span>
        </el-form-item>
        <span title="测试用户 直接登录" class="secret" @click="noSecret"
          >免密登录</span
        >
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  width: 30vw;
  height: 41vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba($color: #fff, $alpha: 0.2);
  background-size: cover;
  border-radius: 20px;
  right: 100px;
  top: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 800px) and (max-width: 1200px) {
    height: 38vh;
  }

  @media screen and (min-width: 421px) and (max-width: 799px) {
    width: 45vw;
    height: 35vh;
  }

  @media screen and (min-width: 321px) and (max-width: 420px) {
    width: 80vw;
    height: 48vh;
  }

  @media screen and (min-width: 0) and (max-width: 320px) {
    width: 90vw;
    height: 55vh;
  }

  @media screen and (min-height: 600px) and (max-height: 800px) {
    height: 48vh;
  }

  @media screen and (min-height: 400px) and (max-height: 599px) {
    height: 58vh;
  }

  @media screen and (min-height: 0) and (max-height: 399px) {
    height: 78vh;
  }

  .rule-form {
    width: 80%;

    .verify {
      position: absolute;
      margin: -10px 0 0 -120px;

      &:hover {
        cursor: pointer;
      }
    }

    .tips {
      color: #000;
      float: right;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .secret {
    color: #fff;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
