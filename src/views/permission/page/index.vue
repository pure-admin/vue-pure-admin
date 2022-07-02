<script setup lang="ts">
import { ref, unref } from "vue";
import type { StorageConfigs } from "/#/index";
import { storageSession } from "@pureadmin/utils";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "PermissionPage"
});

let purview = ref<string>(
  storageSession.getItem<StorageConfigs>("info").username
);

function changRole() {
  if (unref(purview) === "admin") {
    storageSession.setItem("info", {
      username: "test",
      accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
    });
    window.location.reload();
  } else {
    storageSession.setItem("info", {
      username: "admin",
      accessToken: "eyJhbGciOiJIUzUxMiJ9.admin"
    });
    window.location.reload();
  }
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>
          当前角色：
          <span style="font-size: 26px">{{ purview }}</span>
          <p style="color: #ffa500">
            查看左侧菜单变化(系统管理)，模拟后台根据不同角色返回对应路由
          </p>
        </span>
      </div>
    </template>
    <el-button
      type="primary"
      @click="changRole"
      :icon="useRenderIcon('user', { color: '#fff' })"
    >
      切换角色
    </el-button>
  </el-card>
</template>
