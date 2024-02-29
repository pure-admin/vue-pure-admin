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
        <Auth value="permission:btn:add">
          <el-button plain type="warning">
            拥有code：'permission:btn:add' 权限可见
          </el-button>
        </Auth>
        <Auth :value="['permission:btn:edit']">
          <el-button plain type="primary">
            拥有code：['permission:btn:edit'] 权限可见
          </el-button>
        </Auth>
        <Auth
          :value="[
            'permission:btn:add',
            'permission:btn:edit',
            'permission:btn:delete'
          ]"
        >
          <el-button plain type="danger">
            拥有code：['permission:btn:add', 'permission:btn:edit',
            'permission:btn:delete'] 权限可见
          </el-button>
        </Auth>
      </el-space>
    </el-card>

    <el-card shadow="never" class="mb-2">
      <template #header>
        <div class="card-header">函数方式判断权限</div>
      </template>
      <el-space wrap>
        <el-button v-if="hasAuth('permission:btn:add')" plain type="warning">
          拥有code：'permission:btn:add' 权限可见
        </el-button>
        <el-button v-if="hasAuth(['permission:btn:edit'])" plain type="primary">
          拥有code：['permission:btn:edit'] 权限可见
        </el-button>
        <el-button
          v-if="
            hasAuth([
              'permission:btn:add',
              'permission:btn:edit',
              'permission:btn:delete'
            ])
          "
          plain
          type="danger"
        >
          拥有code：['permission:btn:add', 'permission:btn:edit',
          'permission:btn:delete'] 权限可见
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
        <el-button v-auth="'permission:btn:add'" plain type="warning">
          拥有code：'permission:btn:add' 权限可见
        </el-button>
        <el-button v-auth="['permission:btn:edit']" plain type="primary">
          拥有code：['permission:btn:edit'] 权限可见
        </el-button>
        <el-button
          v-auth="[
            'permission:btn:add',
            'permission:btn:edit',
            'permission:btn:delete'
          ]"
          plain
          type="danger"
        >
          拥有code：['permission:btn:add', 'permission:btn:edit',
          'permission:btn:delete'] 权限可见
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>
