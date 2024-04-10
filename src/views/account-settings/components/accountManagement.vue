<script setup lang="ts">
// 仅提供示例，请根据具体业务自行实现
</script>

<template>
  <div class="ml-[120px] min-w-[180px] max-w-[70%]">
    <h3 class="my-8">账户管理</h3>
    <div class="flex items-center">
      <div class="flex-1">
        <p>账户密码</p>
        <el-text class="mx-1" type="info">当前密码强度：强</el-text>
      </div>
      <el-button type="primary" text>修改</el-button>
    </div>
    <el-divider />
    <div class="flex items-center">
      <div class="flex-1">
        <p>密保手机</p>
        <el-text class="mx-1" type="info">已经绑定手机：158****6789</el-text>
      </div>
      <el-button type="primary" text>修改</el-button>
    </div>
    <el-divider />
    <div class="flex items-center">
      <div class="flex-1">
        <p>密保问题</p>
        <el-text class="mx-1" type="info">
          未设置密保问题，密保问题可有效保护账户安全
        </el-text>
      </div>
      <el-button type="primary" text>修改</el-button>
    </div>
    <el-divider />
    <div class="flex items-center">
      <div class="flex-1">
        <p>备用邮箱</p>
        <el-text class="mx-1" type="info">已绑定邮箱：pure***@163.com</el-text>
      </div>
      <el-button type="primary" text>修改</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
