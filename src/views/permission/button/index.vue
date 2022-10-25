<script setup lang="ts">
import { type CSSProperties, computed } from "vue";
import { hasAuth, getAuths } from "/@/router/utils";

defineOptions({
  name: "PermissionButton"
});

let width = computed((): CSSProperties => {
  return {
    width: "85vw"
  };
});
</script>

<template>
  <el-space direction="vertical" size="large">
    <el-tag :style="width" size="large" effect="dark">
      当前拥有的code列表：{{ getAuths() }}
    </el-tag>

    <el-card shadow="never" :style="width">
      <template #header>
        <div class="card-header">组件方式判断权限</div>
      </template>
      <Auth value="btn_add">
        <el-button type="success"> 拥有code：'btn_add' 权限可见 </el-button>
      </Auth>
      <Auth :value="['btn_edit']">
        <el-button type="primary"> 拥有code：['btn_edit'] 权限可见 </el-button>
      </Auth>
      <Auth :value="['btn_add', 'btn_edit', 'btn_delete']">
        <el-button type="danger">
          拥有code：['btn_add', 'btn_edit', 'btn_delete'] 权限可见
        </el-button>
      </Auth>
    </el-card>

    <el-card shadow="never" :style="width">
      <template #header>
        <div class="card-header">函数方式判断权限</div>
      </template>
      <el-button type="success" v-if="hasAuth('btn_add')">
        拥有code：'btn_add' 权限可见
      </el-button>
      <el-button type="primary" v-if="hasAuth(['btn_edit'])">
        拥有code：['btn_edit'] 权限可见
      </el-button>
      <el-button
        type="danger"
        v-if="hasAuth(['btn_add', 'btn_edit', 'btn_delete'])"
      >
        拥有code：['btn_add', 'btn_edit', 'btn_delete'] 权限可见
      </el-button>
    </el-card>

    <el-card shadow="never" :style="width">
      <template #header>
        <div class="card-header">
          指令方式判断权限（该方式不能动态修改权限）
        </div>
      </template>
      <el-button type="success" v-auth="'btn_add'">
        拥有code：'btn_add' 权限可见
      </el-button>
      <el-button type="primary" v-auth="['btn_edit']">
        拥有code：['btn_edit'] 权限可见
      </el-button>
      <el-button type="danger" v-auth="['btn_add', 'btn_edit', 'btn_delete']">
        拥有code：['btn_add', 'btn_edit', 'btn_delete'] 权限可见
      </el-button>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  justify-content: start;
}
</style>
