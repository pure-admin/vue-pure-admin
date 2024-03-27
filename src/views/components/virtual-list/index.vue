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
        <el-link
          href="https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller"
          target="_blank"
          style="margin: 0 5px 4px 0; font-size: 16px"
        >
          虚拟列表
        </el-link>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/virtual-list"
        target="_blank"
      >
        代码位置 src/views/components/virtual-list
      </el-link>
    </template>
    <div class="w-full flex justify-around flex-wrap">
      <vertical-list class="h-[500px] w-[500px]" />
      <horizontal-list class="h-[500px] w-[500px]" />
    </div>
  </el-card>
</template>
