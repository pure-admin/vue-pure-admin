<script setup lang="ts">
import { reactive } from "vue";
import { VxeGridProps } from "vxe-table";

const gridOptions = reactive({
  border: true,
  resizable: true,
  keepSource: true,
  height: 578,
  printConfig: {},
  importConfig: {},
  exportConfig: {},
  pagerConfig: {
    perfect: true,
    pageSize: 15
  },
  editConfig: {
    trigger: "click",
    mode: "row",
    showStatus: true
  },
  toolbarConfig: {
    buttons: [
      {
        code: "insert_actived",
        name: "message.hsadd",
        status: "perfect",
        icon: "fa fa-plus"
      },
      {
        code: "mark_cancel",
        name: "message.hsmark",
        status: "perfect",
        icon: "fa fa-trash-o"
      },
      {
        code: "save",
        name: "message.hssave",
        status: "perfect",
        icon: "fa fa-save"
      }
    ],
    perfect: true,
    refresh: {
      icon: "fa fa-refresh",
      iconLoading: "fa fa-spinner fa-spin"
    },
    import: {
      icon: "fa fa-upload"
    },
    export: {
      icon: "fa fa-download"
    },
    print: {
      icon: "fa fa-print"
    },
    zoom: {
      iconIn: "fa fa-arrows-alt",
      iconOut: "fa fa-expand"
    },
    custom: {
      icon: "fa fa-cog"
    }
  },
  proxyConfig: {
    props: {
      result: "result",
      total: "page.total"
    },
    ajax: {
      // 接收 Promise
      query: ({ page }) => {
        return new Promise(resolve => {
          setTimeout(() => {
            const list = [
              {
                id: 10001,
                name: "Test1",
                nickname: "T1",
                role: "Develop",
                sex: "Man",
                age: 28,
                address: "Shenzhen"
              },
              {
                id: 10002,
                name: "Test2",
                nickname: "T2",
                role: "Test",
                sex: "Women",
                age: 22,
                address: "Guangzhou"
              },
              {
                id: 10003,
                name: "Test3",
                nickname: "T3",
                role: "PM",
                sex: "Man",
                age: 32,
                address: "Shanghai"
              },
              {
                id: 10004,
                name: "Test4",
                nickname: "T4",
                role: "Designer",
                sex: "Women ",
                age: 23,
                address: "Shenzhen"
              },
              {
                id: 10005,
                name: "Test5",
                nickname: "T5",
                role: "Develop",
                sex: "Women ",
                age: 30,
                address: "Shanghai"
              },
              {
                id: 10006,
                name: "Test6",
                nickname: "T6",
                role: "Designer",
                sex: "Women ",
                age: 21,
                address: "Shenzhen"
              },
              {
                id: 10007,
                name: "Test7",
                nickname: "T7",
                role: "Test",
                sex: "Man ",
                age: 29,
                address: "vxe-table 从入门到放弃"
              },
              {
                id: 10008,
                name: "Test8",
                nickname: "T8",
                role: "Develop",
                sex: "Man ",
                age: 35,
                address: "Shenzhen"
              },
              {
                id: 10009,
                name: "Test9",
                nickname: "T9",
                role: "Develop",
                sex: "Man ",
                age: 35,
                address: "Shenzhen"
              },
              {
                id: 100010,
                name: "Test10",
                nickname: "T10",
                role: "Develop",
                sex: "Man ",
                age: 35,
                address: "Guangzhou"
              }
            ];
            resolve({
              page: {
                total: list.length
              },
              result: list.slice(
                (page.currentPage - 1) * page.pageSize,
                page.currentPage * page.pageSize
              )
            });
          }, 100);
        });
      },
      // body 对象： { removeRecords }
      delete: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({});
          }, 100);
        });
      },
      // body 对象： { insertRecords, updateRecords, removeRecords, pendingRecords }
      save: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({});
          }, 100);
        });
      }
    }
  },
  columns: [
    { type: "checkbox", width: 50 },
    { type: "seq", width: 60 },
    { field: "name", title: "Name", editRender: { name: "input" } },
    { field: "nickname", title: "Nickname", editRender: { name: "input" } },
    { field: "role", title: "Role", editRender: { name: "input" } },
    {
      field: "address",
      title: "Address",
      showOverflow: true,
      editRender: { name: "input" }
    }
  ]
} as VxeGridProps);
</script>

<template>
  <vxe-grid v-bind="gridOptions"></vxe-grid>
</template>
