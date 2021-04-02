<template>
  <div class="welcome">
    <!-- <a title="欢迎Star" href="https://github.com/xiaoxian521/CURD-TS" target="_blank">点击打开仓库地址</a> -->
    <flop />
  </div>
</template>

<script lang='ts'>
import flop from "../components/flop/index.vue"
export default {
  name: "welcome",
  components: {
    flop
  },
};
</script>

<style scoped>
.welcome {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
