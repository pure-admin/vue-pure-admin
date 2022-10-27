<script setup lang="ts">
import noServer from "@/assets/status/500.svg?component";

defineOptions({
  name: "500"
});
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noServer />
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
        500
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
        抱歉，服务器出错了
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
