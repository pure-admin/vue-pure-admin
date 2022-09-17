<script setup lang="ts">
import noExist from "/@/assets/status/404.svg?component";

defineOptions({
  name: "404"
});
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noExist />
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
        404
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
        抱歉，你访问的页面不存在
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
