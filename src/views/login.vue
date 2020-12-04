<template>
  <div class="login">
    <info
      :ruleForm="contextInfo"
      @on-login="onLogin"
      @refreshVerify="refreshVerify"
    />
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  onMounted,
  onBeforeMount,
  getCurrentInstance,
} from "vue";
import info, { ContextProps } from "../components/info.vue";
import { getVerify, getLogin } from "../api/login";
import { useRouter } from "vue-router";
import { storageSession } from "../utils/storage";
export default {
  components: {
    info,
  },
  setup() {
    const message = getCurrentInstance()?.appContext.config.globalProperties
      .$message;

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
      svg: null,
    });

    const toPage = (token: string): void => {
      storageSession.setItem("accessToken", token);
      router.push("/");
    };

    // 登录
    const onLogin = async () => {
      let { userName, passWord, verify } = contextInfo;
      let { code, info, accessToken } = await getLogin({
        username: userName,
        password: passWord,
        verify: verify,
      });
      code === 0
        ? message({
            message: info,
            type: "success",
          }) && toPage(accessToken)
        : message(info);
    };

    const refreshVerify = (): void => {
      refreshGetVerify();
    };

    onBeforeMount(() => {
      refreshGetVerify();
    });

    return {
      contextInfo,
      onLogin,
      router,
      toPage,
      refreshVerify,
    };
  },
};
</script>
