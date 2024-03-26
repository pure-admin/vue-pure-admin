<script setup lang="ts"></script>

<template>
  <el-card shadow="never">
    <template #header>安全设置</template>
    <div class="flex items-center">
      <div class="flex-1">
        <p>账户密码</p>
        <p class="wp-4">
          <el-text class="mx-1" type="info">当前密码强度：强</el-text>
        </p>
      </div>
      <div class="w-64">
        <el-link type="primary" :underline="false">修改</el-link>
      </div>
    </div>
    <el-divider />
    <div class="flex items-center">
      <div class="flex-1">
        <p>密保手机</p>
        <p class="wp-4">
          <el-text class="mx-1" type="info">已经绑定手机：138****1234</el-text>
        </p>
      </div>
      <div class="w-64">
        <el-link type="primary" :underline="false">修改</el-link>
      </div>
    </div>
    <el-divider />
    <div class="flex items-center">
      <div class="flex-1">
        <p>密保问题</p>
        <p class="wp-4">
          <el-text class="mx-1" type="info">
            未设置密保问题，密保问题可有效保护账户安全
          </el-text>
        </p>
      </div>
      <div class="w-64">
        <el-link type="primary" :underline="false">设置</el-link>
      </div>
    </div>
    <el-divider />
    <div class="flex items-center">
      <div class="flex-1">
        <p>备用邮箱</p>
        <p class="wp-4">
          <el-text class="mx-1" type="info">已绑定邮箱：ant***sign.com</el-text>
        </p>
      </div>
      <div class="w-64">
        <el-link type="primary" :underline="false">修改</el-link>
      </div>
    </div>
  </el-card>
</template>
