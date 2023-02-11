<script setup lang="ts">
import { message } from "@/utils/message";
import { debounce, throttle } from "@pureadmin/utils";

defineOptions({
  name: "Debounce"
});

const handle = () => message("恭喜你，这是一条成功消息", { type: "success" });

const immediateDebounce = debounce(handle, 1000, true);

const debounceClick = debounce(handle, 1000);

const throttleClick = throttle(handle);
</script>

<template>
  <div>
    <el-card class="mb-5" shadow="never">
      <template #header>
        <div>防抖：debounce</div>
      </template>
      <div class="mb-5">
        所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n
        秒内又触发了事件，则会重新计算函数执行时间。
      </div>
      <el-button @click="immediateDebounce">
        连续点击我，只会执行第一次点击事件，立即执行
      </el-button>
      <el-button @click="debounceClick">
        连续点击我，只会执行最后一次点击事件，延后执行
      </el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div>节流：throttle</div>
      </template>
      <div class="mb-5">
        所谓节流，就是指连续触发事件但是在 n
        秒中只执行一次函数。节流会稀释函数的执行频率。
      </div>
      <el-button @click="throttleClick">
        连续点击我，每一秒只会执行一次点击事件
      </el-button>
    </el-card>
  </div>
</template>
