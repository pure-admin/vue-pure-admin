<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";

defineOptions({
  name: "AccountManagement"
});

const list = ref([
  {
    title: "账户密码",
    illustrate: "当前密码强度：强",
    button: "修改"
  },
  {
    title: "密保手机",
    illustrate: "已经绑定手机：158****6789",
    button: "修改"
  },
  {
    title: "密保问题",
    illustrate: "未设置密保问题，密保问题可有效保护账户安全",
    button: "修改"
  },
  {
    title: "备用邮箱",
    illustrate: "已绑定邮箱：pure***@163.com",
    button: "修改"
  }
]);

function onClick(item) {
  console.log("onClick", item.title);
  message("请根据具体业务自行实现", { type: "success" });
}
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">账户管理</h3>
    <div v-for="(item, index) in list" :key="index">
      <div class="flex items-center">
        <div class="flex-1">
          <p>{{ item.title }}</p>
          <el-text class="mx-1" type="info">{{ item.illustrate }}</el-text>
        </div>
        <el-button type="primary" text @click="onClick(item)">
          {{ item.button }}
        </el-button>
      </div>
      <el-divider />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
