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
const disabled = ref(false);
const page = ref(0);
const total = ref(10);

const load = () => {
  if (disabled.value) return;

  page.value++;
  if (page.value <= total.value) {
    data.value = data.value.concat(dataTemplate);
  }

  if (page.value === total.value) {
    disabled.value = true;
  }
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-medium">
        表格无限滚动（
        <el-link
          href="https://github.com/yujinpan/el-table-infinite-scroll"
          target="_blank"
          style="font-size: 16px; margin: 0 5px 4px 0"
        >
          github地址
        </el-link>
        ）
      </div>
    </template>
    <div>
      <p class="mb-2">
        <span>loaded page(total: {{ total }}): {{ page }}, </span>
        disabled:
        <el-switch v-model="disabled" :disabled="page >= total" />
      </p>
      <el-table
        v-el-table-infinite-scroll="load"
        :data="data"
        :infinite-scroll-disabled="disabled"
        height="435px"
      >
        <el-table-column type="index" />
        <el-table-column prop="date" label="date" />
        <el-table-column prop="name" label="name" />
        <el-table-column prop="age" label="age" />
      </el-table>
    </div>
  </el-card>
</template>
