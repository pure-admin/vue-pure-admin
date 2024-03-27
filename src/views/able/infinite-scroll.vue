<script setup lang="ts">
import { ref } from "vue";
import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";

defineOptions({
  name: "InfiniteScroll"
});

const dataTemplate = new Array(10).fill({
  date: "2022-08-24",
  name: "RealityBoy",
  age: "18"
});

const data = ref([]);
const page = ref(0);
const total = ref(10);
const isBottom = ref(false);

const load = () => {
  if (isBottom.value) return;

  page.value++;
  if (page.value <= total.value) {
    data.value = data.value.concat(dataTemplate);
  }

  if (page.value === total.value) {
    isBottom.value = true;
  }
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-medium">
        <el-link
          href="https://github.com/yujinpan/el-table-infinite-scroll"
          target="_blank"
          style="margin: 0 5px 4px 0; font-size: 16px"
        >
          表格无限滚动
        </el-link>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/infinite-scroll.vue"
        target="_blank"
      >
        代码位置 src/views/able/infinite-scroll.vue
      </el-link>
    </template>
    <p class="mb-2">{{ isBottom ? "已加载全部页" : `加载到第 ${page} 页` }}</p>
    <el-table
      v-el-table-infinite-scroll="load"
      border
      height="435px"
      :data="data"
      :infinite-scroll-disabled="isBottom"
    >
      <el-table-column width="80" type="index" label="序号" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="age" label="年龄" />
    </el-table>
  </el-card>
</template>
