<template>
  <div class="welcome">
    <a
      title="欢迎Star"
      href="https://github.com/xiaoxian521/CURD-TS/tree/vue-ts"
      target="_blank"
      >点击打开仓库地址</a
    >
  </div>
</template>

<script lang='ts'>
export default {
  name: "welcome",
};
</script>

<style scoped>
.welcome {
  width: 100%;
  height: 100%;
  background: url("../assets/welcome.png") no-repeat center;
  background-size: cover;
  position: absolute;
}
</style>
