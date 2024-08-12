<script setup lang="ts">
interface User {
  id: number;
  date: string;
  name: string;
  hasChildren?: boolean;
  children?: User[];
}

const load = (
  row: User,
  treeNode: unknown,
  resolve: (date: User[]) => void
) => {
  setTimeout(() => {
    resolve([
      {
        id: 31,
        date: "2016-05-01",
        name: "wangxiaohu"
      },
      {
        id: 32,
        date: "2016-05-01",
        name: "wangxiaohu"
      }
    ]);
  }, 1000);
};

const tableData: User[] = [
  {
    id: 1,
    date: "2016-05-02",
    name: "wangxiaohu"
  },
  {
    id: 2,
    date: "2016-05-04",
    name: "wangxiaohu"
  },
  {
    id: 3,
    date: "2016-05-01",
    name: "wangxiaohu",
    children: [
      {
        id: 31,
        date: "2016-05-01",
        name: "wangxiaohu"
      },
      {
        id: 32,
        date: "2016-05-01",
        name: "wangxiaohu"
      }
    ]
  },
  {
    id: 4,
    date: "2016-05-03",
    name: "wangxiaohu"
  }
];

const tableData1: User[] = [
  {
    id: 1,
    date: "2016-05-02",
    name: "wangxiaohu"
  },
  {
    id: 2,
    date: "2016-05-04",
    name: "wangxiaohu"
  },
  {
    id: 3,
    date: "2016-05-01",
    name: "wangxiaohu",
    hasChildren: true
  },
  {
    id: 4,
    date: "2016-05-03",
    name: "wangxiaohu"
  }
];

const columns: TableColumnList = [
  {
    label: "日期",
    prop: "date"
  },
  {
    label: "姓名",
    prop: "name"
  }
];
</script>

<template>
  <div>
    <pure-table
      :data="tableData"
      :columns="columns"
      row-key="id"
      border
      default-expand-all
      class="mb-6"
    />
    <pure-table
      :data="tableData1"
      :columns="columns"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{
        hasChildren: 'hasChildren',
        children: 'children',
        checkStrictly: false
      }"
    />
  </div>
</template>
