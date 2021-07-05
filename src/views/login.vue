<template>
  <div class="login">
    <info
      :ruleForm="contextInfo"
      @on-behavior="onLogin"
      @refreshVerify="refreshVerify"
    />
  </div>
</template>

<script lang="ts">
import { reactive, onBeforeMount } from "vue";
import info, { ContextProps } from "../components/ReInfo/index.vue";
import { getVerify, getLogin } from "/@/api/user";
import { useRouter } from "vue-router";
import { storageSession } from "/@/utils/storage";
import { warnMessage, successMessage } from "/@/utils/message";
export default {
  name: "login",
  components: {
    info
  },
  setup() {
    const router = useRouter();

    // 刷新验证码
    const refreshGetVerify = async () => {
      let { svg } = await getVerify();
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
      let { code, info, accessToken } = await getLogin({
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

    return {
      contextInfo,
      onLogin,
      router,
      toPage,
      refreshVerify
    };
  }
};
</script>
