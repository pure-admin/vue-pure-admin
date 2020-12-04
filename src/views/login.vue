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
import { http } from "../utils/http";
import info, { ContextProps } from "../components/info.vue";

export default {
  components: {
    info,
  },
  setup() {
    // 刷新验证码
    const getVerify = async () => {
      let { svg } = await http.request("get", "/captcha");
      contextInfo.svg = svg;
    };

    const contextInfo: ContextProps = reactive({
      userName: "",
      passWord: "",
      verify: null,
      svg: null,
    });

    // 登录
    const onLogin = (): void => {
      console.log(contextInfo.userName);
    };

    const refreshVerify = (): void => {
      getVerify();
    };

    onBeforeMount(() => {
      getVerify();
    });

    return {
      contextInfo,
      onLogin,
      refreshVerify,
    };
  },
};
</script>
