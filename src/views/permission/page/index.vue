<script setup lang="ts">
import { initRouter } from "/@/router/utils";
import { type CSSProperties, ref, computed } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
import { usePermissionStoreHook } from "/@/store/modules/permission";

defineOptions({
  name: "PermissionPage"
});

let width = computed((): CSSProperties => {
  return {
    width: "85vw"
  };
});

let username = ref(useUserStoreHook()?.username);

const options = [
  {
    value: "admin",
    label: "管理员角色"
  },
  {
    value: "common",
    label: "普通角色"
  }
];

function onChange() {
  useUserStoreHook()
    .loginByUsername({ username: username.value })
    .then(res => {
      if (res.success) {
        usePermissionStoreHook().clearAllCachePage();
        initRouter();
      }
    });
}
</script>

<template>
  <el-space direction="vertical" size="large">
    <el-tag :style="width" size="large" effect="dark">
      模拟后台根据不同角色返回对应路由，观察左侧菜单变化（管理员角色可查看系统管理菜单、普通角色不可查看系统管理菜单）
    </el-tag>
    <el-card shadow="never" :style="width">
      <template #header>
        <div class="card-header">
          <span>当前角色：{{ username }}</span>
        </div>
      </template>
      <el-select v-model="username" @change="onChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  justify-content: start;
}
</style>
