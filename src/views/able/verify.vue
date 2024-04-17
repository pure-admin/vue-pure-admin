<script setup lang="ts">
import { ref } from "vue";
import Vcode from "vue3-puzzle-vcode";

const isShow = ref(true);

function onSuccess() {
  console.log("验证成功");
}

function onFail() {
  console.log("验证失败");
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-medium">
        <el-link
          href="https://github.com/javaLuo/vue-puzzle-vcode/tree/vue3"
          target="_blank"
          style="margin: 0 5px 4px 0; font-size: 16px"
        >
          拼图人机验证、右滑拼图验证
        </el-link>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/verify.vue"
        target="_blank"
      >
        代码位置 src/views/able/verify.vue
      </el-link>
    </template>
    <div class="bg-[rgba(15,23,42,0.2)] p-6 w-[360px]">
      <Vcode :show="isShow" type="inside" @fail="onFail" @success="onSuccess" />
    </div>
  </el-card>
</template>
