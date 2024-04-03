<script setup lang="ts">
import { ref } from "vue";
import Vcode from "vue3-puzzle-vcode";
import ReCodePath from "@/components/ReCodePath";

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
      <ReCodePath>
        <template #title>
          <div class="font-medium">
            拼图人机验证、右滑拼图验证 基于
            <el-link
              href="https://github.com/javaLuo/vue-puzzle-vcode/tree/vue3"
              target="_blank"
              style="margin: 0 5px 4px 0; font-size: 16px"
              >vue3-puzzle-vcode
            </el-link>
          </div>
        </template>
      </ReCodePath>
    </template>
    <div class="bg-[rgba(15,23,42,0.2)] p-6 w-[360px]">
      <Vcode :show="isShow" type="inside" @fail="onFail" @success="onSuccess" />
    </div>
  </el-card>
</template>
