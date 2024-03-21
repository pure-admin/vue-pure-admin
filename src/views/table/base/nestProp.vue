<script setup lang="ts">
const tableData = [
  {
    userInfo: { name: "Test1", age: 22 },
    other: [
      { sex: "女" },
      {
        more: {
          content: '<div><span style="color: red">我是 html 片段</span></div>'
        }
      }
    ],
    role: "设计师"
  },
  {
    userInfo: { name: "Test2", age: 28 },
    other: [
      { sex: "男" },
      {
        more: {
          content:
            '<img width="100" height="100" src="https://pure-admin.github.io/pure-admin-table/imgs/11.jpg">'
        }
      }
    ],
    role: "后端"
  },
  {
    userInfo: { name: "Test3", age: 20 },
    other: [
      { sex: "女" },
      {
        more: {
          content:
            '<img width="100" height="100" src="https://pure-admin.github.io/pure-admin-table/imgs/1.jpg">'
        }
      }
    ],
    role: "程序员鼓励师"
  },
  {
    userInfo: { name: "Test4", age: 26 },
    other: [
      { sex: "男" },
      {
        more: {
          content:
            '<a href="https://github.com/xiaoxian521" target="_black">我是链接，点我去 Follow</a>'
        }
      }
    ],
    role: "前端"
  }
];

const columns: TableColumnList = [
  {
    label: "姓名",
    prop: "userInfo.name"
  },
  {
    label: "性别",
    prop: "other[0].sex"
  },
  {
    label: "年龄",
    prop: "userInfo.age"
  },
  {
    label: "Html片段",
    slot: "content"
  },
  {
    label: "角色",
    prop: "role"
  }
];
</script>

<template>
  <pure-table :data="tableData" :columns="columns">
    <template #content="{ row }">
      <span v-html="row.other[1].more.content" />
    </template>
  </pure-table>
</template>
