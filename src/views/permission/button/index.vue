<script setup lang="ts">
import { hasAuth, getAuths } from "@/router/utils";

defineOptions({
  name: "PermissionButton"
});
</script>

<template>
  <div>
    <p class="mb-2">当前拥有的code列表：{{ getAuths() }}</p>

    <el-card shadow="never" class="mb-2">
      <template #header>
        <div class="card-header">组件方式判断权限</div>
      </template>
      <el-space wrap>
        <Auth value="btn_add">
          <el-button plain type="warning">
            拥有code：'btn_add' 权限可见
          </el-button>
        </Auth>
        <Auth :value="['btn_edit']">
          <el-button plain type="primary">
            拥有code：['btn_edit'] 权限可见
          </el-button>
        </Auth>
        <Auth :value="['btn_add', 'btn_edit', 'btn_delete']">
          <el-button plain type="danger">
            拥有code：['btn_add', 'btn_edit', 'btn_delete'] 权限可见
          </el-button>
        </Auth>
      </el-space>
    </el-card>

    <el-card shadow="never" class="mb-2">
      <template #header>
        <div class="card-header">函数方式判断权限</div>
      </template>
      <el-space wrap>
        <el-button v-if="hasAuth('btn_add')" plain type="warning">
          拥有code：'btn_add' 权限可见
        </el-button>
        <el-button v-if="hasAuth(['btn_edit'])" plain type="primary">
          拥有code：['btn_edit'] 权限可见
        </el-button>
        <el-button
          v-if="hasAuth(['btn_add', 'btn_edit', 'btn_delete'])"
          plain
          type="danger"
        >
          拥有code：['btn_add', 'btn_edit', 'btn_delete'] 权限可见
        </el-button>
      </el-space>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          指令方式判断权限（该方式不能动态修改权限）
        </div>
      </template>
      <el-space wrap>
        <el-button v-auth="'btn_add'" plain type="warning">
          拥有code：'btn_add' 权限可见
        </el-button>
        <el-button v-auth="['btn_edit']" plain type="primary">
          拥有code：['btn_edit'] 权限可见
        </el-button>
        <el-button
          v-auth="['btn_add', 'btn_edit', 'btn_delete']"
          plain
          type="danger"
        >
          拥有code：['btn_add', 'btn_edit', 'btn_delete'] 权限可见
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>
