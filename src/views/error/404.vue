<script setup lang="ts">
import { useRouter } from "vue-router";
import noExist from "@/assets/status/404.svg?component";

defineOptions({
  name: "404"
});

const router = useRouter();
</script>

<template>
  <div
    class="flex flex-col md:flex-row justify-center items-center min-h-full w-full p-4 md:p-0"
  >
    <noExist />
    <div class="mt-8 md:ml-12 md:mt-0 text-center md:text-left">
      <p
        v-motion
        class="font-medium text-4xl mb-4! dark:text-white"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80
          }
        }"
      >
        404
      </p>
      <p
        v-motion
        class="text-xl mb-4! text-gray-500"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 120
          }
        }"
      >
        抱歉，你访问的页面不存在
      </p>
      <el-button
        v-motion
        type="primary"
        class="block mx-auto md:inline-block md:mx-0"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 160
          }
        }"
        @click="router.push('/')"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  margin: 0 !important;
}
</style>
