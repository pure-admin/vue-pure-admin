<script setup lang="ts">
import { ref } from "vue";
import Print from "@/utils/print";
import pieChart from "./pieChart.vue";

defineOptions({
  name: "Print"
});

interface User {
  date: string;
  name: string;
  age: number;
  address: string;
}

const value = ref("1");

const options = [
  {
    value: "1",
    el: ".el-table",
    label: "Table"
  },
  {
    value: "2",
    el: ".echart",
    label: "Echart"
  },
  {
    value: "3",
    el: ".img",
    label: "Image"
  }
];

function onPrint() {
  const el = options.filter(v => v.value === value.value)[0]?.el;
  Print(el).toPrint;
}

const tableRowClassName = ({ rowIndex }: { row: User; rowIndex: number }) => {
  if (rowIndex === 1) {
    return "warning-row";
  } else if (rowIndex === 3) {
    return "success-row";
  }
  return "";
};

const tableData: User[] = [
  {
    date: "2016-05-03",
    name: "Tom",
    age: 18,
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    age: 18,
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    age: 18,
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    age: 18,
    address: "No. 189, Grove St, Los Angeles"
  }
];
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">打印功能（报表、图表、图片）</span>
        <el-select
          v-model="value"
          class="!w-[100px] mr-2"
          placeholder="Select"
          size="small"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="small" type="primary" @click="onPrint">
          打印
        </el-button>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/print"
        target="_blank"
      >
        代码位置 src/views/able/print
      </el-link>
    </template>
    <el-row :gutter="24">
      <el-col
        v-motion
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <p class="font-medium text-lg text-center">Table</p>
        <el-table
          border
          :data="tableData"
          :row-class-name="tableRowClassName"
          class="el-table w-full mt-[10px]"
        >
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="age" label="age" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-col>

      <el-col
        v-motion
        :xs="11"
        :sm="11"
        :md="11"
        :lg="11"
        :xl="11"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <p class="font-medium text-lg text-center">Echart</p>
        <pieChart class="echart mt-[10px]" />
      </el-col>

      <el-col
        v-motion
        :xs="11"
        :sm="11"
        :md="11"
        :lg="11"
        :xl="11"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <p class="font-medium text-lg text-center">Image</p>
        <img
          src="https://pure-admin-utils.netlify.app/logo.png"
          alt="avatars"
          class="img mt-[10px] m-auto"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-table__row.warning-row) {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

:deep(.el-table__row.success-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
