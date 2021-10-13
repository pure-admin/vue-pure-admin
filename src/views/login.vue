<script setup lang="ts">
import { infoType } from "./type";
import { useRouter } from "vue-router";
import { reactive, onBeforeMount } from "vue";
import { getVerify, getLogin } from "/@/api/user";
import { storageSession } from "/@/utils/storage";
import { warnMessage, successMessage } from "/@/utils/message";
import info, { ContextProps } from "../components/ReInfo/index.vue";

const router = useRouter();

// 刷新验证码
const refreshGetVerify = async () => {
  let { svg }: infoType = await getVerify();
  contextInfo.svg = svg;
};

const contextInfo: ContextProps = reactive({
  userName: "",
  passWord: "",
  verify: null,
  svg: null
});

const toPage = (info: Object): void => {
  storageSession.setItem("info", info);
  router.push("/");
};

// 登录
const onLogin = async () => {
  let { userName, passWord, verify } = contextInfo;
  let { code, info, accessToken }: infoType = await getLogin({
    username: userName,
    password: passWord,
    verify: verify
  });
  code === 0
    ? successMessage(info) &&
      toPage({
        username: userName,
        accessToken
      })
    : warnMessage(info);
};

const refreshVerify = (): void => {
  refreshGetVerify();
};

onBeforeMount(() => {
  // refreshGetVerify();
});
</script>

<template>
  <div class="login">
    <info
      :ruleForm="contextInfo"
      @on-behavior="onLogin"
      @refreshVerify="refreshVerify"
    />
  </div>
</template>
