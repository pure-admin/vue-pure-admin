<script setup lang="ts">
import Motion from "../utils/motion";
import { useUserStoreHook } from "/@/store/modules/user";
</script>

<template>
  <div>
    <Motion> 1 </Motion>
    <Motion :delay="200">
      <el-divider>
        <p class="text-gray-500 text-xs">扫码后点击"确认"，即可完成登录</p>
      </el-divider>
    </Motion>
    <Motion :delay="300">
      <el-button
        class="w-full mt-4"
        @click="useUserStoreHook().SET_CURRENTPAGE(0)"
      >
        返回
      </el-button>
    </Motion>
  </div>
</template>
