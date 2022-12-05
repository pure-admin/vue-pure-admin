<script setup lang="ts">
import { ref } from "vue";
import Print from "@/utils/print";
import Line from "../welcome/components/Line.vue";

defineOptions({
  name: "Print"
});

interface User {
  date: string;
  name: string;
  address: string;
}

const value = ref("1");

const options = [
  {
    value: "1",
    el: ".el-table",
    label: "Element-Plus Table"
  },
  {
    value: "3",
    el: ".echart",
    label: "Echart"
  },
  {
    value: "4",
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
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
];
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">打印功能（报表、图表、图片）</span>
        <div>
          <el-select
            v-model="value"
            class="m-2"
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
      </div>
    </template>
    <el-row :gutter="24">
      <el-col
        :xs="22"
        :sm="22"
        :md="11"
        :lg="11"
        :xl="11"
        style="margin: 10px; border: 0.01rem solid var(--el-color-primary)"
        v-motion
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
        <p class="font-medium pt-1">Element-Plus Table</p>
        <el-table
          border
          :data="tableData"
          :row-class-name="tableRowClassName"
          class="el-table w-full mt-[40px] mr-[40px]"
        >
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-col>

      <el-col
        :xs="22"
        :sm="22"
        :md="11"
        :lg="11"
        :xl="11"
        style="
          width: 200px;
          height: 300px;
          margin: 10px;
          border: 0.01rem solid var(--el-color-primary);
        "
        v-motion
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
        <p class="font-medium pt-1">Echart</p>
        <Line class="echart" style="margin: 0 auto; height: 300px" />
      </el-col>

      <el-col
        :xs="22"
        :sm="22"
        :md="11"
        :lg="11"
        :xl="11"
        style="
          width: 200px;
          height: 300px;
          margin: 10px;
          border: 0.01rem solid var(--el-color-primary);
        "
        v-motion
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
        <p class="font-medium pt-1">Image</p>
        <img
          src="https://avatars.githubusercontent.com/u/44761321?v=4"
          alt="avatars"
          class="img"
          style="width: 200px; height: 200px; margin: 50px auto"
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
