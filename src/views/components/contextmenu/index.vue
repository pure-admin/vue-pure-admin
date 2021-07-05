<template>
  <div style="margin: 10px">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="10">
        <!-- 基本使用 -->
        <basic />
      </el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="10">
        <!-- 按钮组 -->
        <menuGroup />
      </el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="10">
        <!-- 动态菜单 -->
        <menuDynamic />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import basic from "./basic.vue";
import menuGroup from "./menuGroup.vue";
import menuDynamic from "./menuDynamic.vue";
export default {
  components: {
    basic,
    menuGroup,
    menuDynamic
  },
  setup() {
    return {};
  }
};
</script>
