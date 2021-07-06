<template>
  <div class="register">
    <info
      :ruleForm="contextInfo"
      @on-behavior="onRegist"
      @refreshVerify="refreshVerify"
    />
  </div>
</template>

<script lang="ts">
import { reactive, onBeforeMount } from "vue";
import info, { ContextProps } from "../components/ReInfo/index.vue";
import { getRegist, getVerify } from "/@/api/user";
import { useRouter } from "vue-router";
import { warnMessage, successMessage } from "/@/utils/message";
export default {
  name: "register",
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

    // 注册
    const onRegist = async () => {
      let { userName, passWord, verify } = contextInfo;
      let { code, info } = await getRegist({
        username: userName,
        password: passWord,
        verify: verify
      });
      code === 0
        ? successMessage(info) && router.push("/login")
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
      onRegist,
      router,
      refreshVerify
    };
  }
};
</script>
