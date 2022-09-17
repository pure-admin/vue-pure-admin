<script setup lang="ts">
import noAccess from "/@/assets/status/403.svg?component";

defineOptions({
  name: "403"
});
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noAccess />
    <div class="ml-12">
      <p
        class="font-medium text-4xl mb-4 dark:text-white"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 100
          }
        }"
      >
        403
      </p>
      <p
        class="mb-4 text-gray-500"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 300
          }
        }"
      >
        抱歉，你无权访问该页面
      </p>
      <el-button
        type="primary"
        @click="$router.push('/')"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 500
          }
        }"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>
