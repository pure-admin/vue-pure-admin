<script setup lang="ts">
import verticalList from "./vertical.vue";
import horizontalList from "./horizontal.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import ReCodePath from "@/components/ReCodePath";

defineOptions({
  name: "VirtualList"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <ReCodePath>
        <template #title>
          <el-link
            href="https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller"
            target="_blank"
            style="margin: 0 5px 4px 0; font-size: 16px"
          >
            虚拟列表
          </el-link>
        </template>
      </ReCodePath>
    </template>
    <div class="w-full flex justify-around flex-wrap">
      <vertical-list class="h-[500px] w-[500px]" />
      <horizontal-list class="h-[500px] w-[500px]" />
    </div>
  </el-card>
</template>
