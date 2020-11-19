<template>
  <div class="login">
    <info :info="contextInfo" />
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import info, { ContextProps } from "../components/info.vue"
const contextInfo: ContextProps = {
  userName: "admin",
  passWord: "123456",
  dynamicText: "登录",
}
export default {
  components: {
    info,
  },
  setup() {
    return {
      contextInfo,
    }
  },
}
</script>

<style scoped>
</style>