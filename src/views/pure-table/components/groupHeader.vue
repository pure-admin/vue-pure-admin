<script setup lang="ts">
import { tableDataMore } from "./data";

const columns: TableColumnList = [
  {
    label: "日期",
    prop: "date",
    fixed: true
  },
  {
    label: "姓名",
    prop: "name",
    children: [
      {
        label: "地区",
        children: [
          {
            label: "城市",
            prop: "city"
          },
          {
            label: "地址",
            prop: "address"
          }
        ]
      }
    ]
  },
  {
    label: "邮编",
    prop: "post-code"
  }
];
</script>

<template>
  <PureTable :data="tableDataMore" :columns="columns" alignWhole="center" />
</template>
