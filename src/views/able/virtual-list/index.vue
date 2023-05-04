<script setup lang="ts">
import verticalList from "./vertical.vue";
import horizontalList from "./horizontal.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

defineOptions({
  name: "VirtualList"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-medium">
        虚拟列表组件（
        <el-link
          href="https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller"
          target="_blank"
          style="margin: 0 5px 4px 0; font-size: 16px"
        >
          github地址
        </el-link>
        ）
      </div>
    </template>
    <div class="w-full flex justify-around flex-wrap">
      <vertical-list class="h-[500px] w-[500px]" />
      <horizontal-list class="h-[500px] w-[500px]" />
    </div>
  </el-card>
</template>
