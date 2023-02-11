<script setup lang="ts">
import basic from "./basic.vue";
import menuGroup from "./menuGroup.vue";
import menuDynamic from "./menuDynamic.vue";
import "v-contextmenu/dist/themes/default.css";

defineOptions({
  name: "ContextMenu"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">右键菜单组件</span>
      </div>
    </template>
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
  </el-card>
</template>
