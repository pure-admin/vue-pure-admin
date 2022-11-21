<script setup lang="ts">
import { ref } from "vue";
import { tableDataExpand } from "./data";

const parentBorder = ref(false);
const childBorder = ref(false);

const columns: TableColumnList = [
  {
    type: "expand",
    slot: "expand"
  },
  {
    label: "日期",
    prop: "date"
  },
  {
    label: "姓名",
    prop: "name"
  }
];

const childColumns: TableColumnList = [
  {
    label: "Name",
    prop: "name"
  },
  {
    label: "State",
    prop: "state"
  },
  {
    label: "City",
    prop: "city"
  },
  {
    label: "Address",
    prop: "address"
  },
  {
    label: "Zip",
    prop: "zip"
  }
];
</script>

<template>
  <div>
    switch parent border: <el-switch v-model="parentBorder" /> switch child
    border: <el-switch v-model="childBorder" />
    <pure-table
      :data="tableDataExpand"
      :columns="columns"
      :border="parentBorder"
    >
      <template #expand="{ row }">
        <div class="m-4">
          <p class="mb-2">State: {{ row.state }}</p>
          <p class="mb-2">City: {{ row.city }}</p>
          <p class="mb-2">Address: {{ row.address }}</p>
          <p class="mb-4">Zip: {{ row.zip }}</p>
          <h3>Family</h3>
          <pure-table
            :data="row.family"
            :columns="childColumns"
            :border="childBorder"
          />
        </div>
      </template>
    </pure-table>
  </div>
</template>
