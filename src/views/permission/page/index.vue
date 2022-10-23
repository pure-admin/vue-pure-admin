<script setup lang="ts">
import { sessionKey } from "/@/utils/auth";
import type { StorageConfigs } from "/#/index";
import { storageSession } from "@pureadmin/utils";
import { type CSSProperties, ref, computed } from "vue";

defineOptions({
  name: "PermissionPage"
});

let width = computed((): CSSProperties => {
  return {
    width: "85vw"
  };
});

let purview = ref<string>(
  storageSession.getItem<StorageConfigs>(sessionKey)?.username
);

const value = ref("admin");

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
  console.log("--", value.value);
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
          <span>当前角色：{{ purview }}</span>
        </div>
      </template>
      <el-select v-model="value" @change="onChange">
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
