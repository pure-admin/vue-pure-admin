<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">CURD Admin</h1>
        <h2>你没有权限去该页面</h2>
        <h6>如有不满请联系你领导</h6>
      </el-col>
      <el-col :span="12">
        <img
          :src="img"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import imgs from "/@/assets/401.gif";
import { ref } from "vue";
export default {
  name: "401",
  setup() {
    const img = ref(`${imgs}?${new Date()}`);
    return {
      img
    };
  }
};
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
