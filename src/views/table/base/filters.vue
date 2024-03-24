<script setup lang="ts">
import { ref } from "vue";

const tableRef = ref();

const clearFilter = val => {
  const { clearFilter } = tableRef.value.getTableRef();
  clearFilter(val);
};

const resetDateFilter = () => {
  clearFilter(["date"]);
};

const filterTag = (value, row) => {
  return row.tag === value;
};

const filterHandler = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};

const columns: TableColumnList = [
  {
    label: "日期",
    prop: "date",
    sortable: true,
    columnKey: "date",
    filters: [
      { text: "2016-05-01", value: "2016-05-01" },
      { text: "2016-05-02", value: "2016-05-02" },
      { text: "2016-05-03", value: "2016-05-03" },
      { text: "2016-05-04", value: "2016-05-04" }
    ],
    filterMethod: filterHandler
  },
  {
    label: "姓名",
    prop: "name"
  },
  {
    label: "地址",
    prop: "address"
  },
  {
    label: "标签",
    prop: "tag",
    filters: [
      { text: "Home", value: "Home" },
      { text: "Office", value: "Office" }
    ],
    filterMethod: filterTag,
    filterPlacement: "bottom-end",
    slot: "tag"
  }
];

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    tag: "Home"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    tag: "Office"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    tag: "Home"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    tag: "Office"
  }
];
</script>

<template>
  <div>
    <el-button @click="resetDateFilter">reset date filter</el-button>
    <el-button @click="clearFilter">reset all filters</el-button>
    <pure-table
      ref="tableRef"
      row-key="date"
      :data="tableData"
      :columns="columns"
    >
      <template #tag="{ row }">
        <el-tag
          :type="row.tag === 'Home' ? null : 'success'"
          disable-transitions
        >
          {{ row.tag }}
        </el-tag>
      </template>
    </pure-table>
  </div>
</template>
