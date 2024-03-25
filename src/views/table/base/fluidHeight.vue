<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { tableDataMore } from "./data";

const columns: TableColumnList = [
  {
    label: "日期",
    prop: "date",
    width: "260",
    fixed: true
  },
  {
    label: "姓名",
    prop: "name",
    width: "260"
  },
  {
    label: "地区",
    prop: "state",
    width: "260"
  },
  {
    label: "城市",
    prop: "city",
    width: "260"
  },
  {
    label: "地址",
    prop: "address",
    width: "260"
  },
  {
    label: "邮编",
    prop: "post-code",
    width: "260"
  },
  {
    label: "操作",
    width: "120",
    fixed: "right",
    slot: "operation"
  }
];

const now = new Date();
const tableData = ref(tableDataMore);

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1);
};

const onAddItem = () => {
  now.setDate(now.getDate() + 1);
  tableData.value.push({
    date: dayjs(now).format("YYYY-MM-DD"),
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    state: "California",
    city: "Los Angeles",
    "post-code": "CA 90036"
  });
};
</script>

<template>
  <div>
    <pure-table :data="tableData" :columns="columns" maxHeight="500">
      <template #operation="{ $index }">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow($index)"
        >
          Remove
        </el-button>
      </template>
    </pure-table>
    <el-button class="mt-4" style="width: 100%" @click="onAddItem">
      Add Item
    </el-button>
  </div>
</template>
