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
        <p class="font-medium">右键菜单</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/contextmenu"
          target="_blank"
        >
          代码位置 src/views/components/contextmenu
        </el-link>
      </div>
    </template>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="10">
        <!-- 基础用法 -->
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
