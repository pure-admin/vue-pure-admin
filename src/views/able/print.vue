<script setup lang="ts">
import Print from "/@/utils/print";
import { reactive, ref } from "vue";
import { VxeTablePropTypes } from "vxe-table";
import { ReLine } from "../welcome/components";

defineOptions({
  name: "Print"
});

interface User {
  date: string;
  name: string;
  address: string;
}

const demo1 = reactive({
  tableData: [
    {
      id: 10001,
      name: "Test1",
      role: "Develop",
      sex: "Man",
      age: 28,
      address: "test abc"
    },
    {
      id: 10002,
      name: "Test2",
      role: "Test",
      sex: "Women",
      age: 22,
      address: "Guangzhou"
    },
    {
      id: 10003,
      name: "Test3",
      role: "PM",
      sex: "Man",
      age: 32,
      address: "Shanghai"
    },
    {
      id: 10004,
      name: "Test4",
      role: "Designer",
      sex: "Women",
      age: 24,
      address: "Shanghai"
    }
  ]
});

const value = ref("1");

const options = [
  {
    value: "1",
    el: ".el-table",
    label: "Element-Plus Table"
  },
  {
    value: "2",
    el: ".vxe-table",
    label: "Vxe Table"
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
  let el = options.filter(v => v.value === value.value)[0]?.el;
  Print(el).toPrint;
}

const headerCellStyle: VxeTablePropTypes.HeaderCellStyle = ({ column }) => {
  if (column.property === "name") {
    return {
      backgroundColor: "#f60",
      color: "#ffffff"
    };
  }
};

const rowStyle: VxeTablePropTypes.RowStyle = ({ rowIndex }) => {
  if ([2, 3, 5].includes(rowIndex)) {
    return {
      backgroundColor: "red",
      color: "#ffffff"
    };
  }
};

const cellStyle: VxeTablePropTypes.CellStyle = ({ row, column }) => {
  if (column.property === "sex") {
    if (row.sex >= "1") {
      return {
        backgroundColor: "#187"
      };
    } else if (row.age === 26) {
      return {
        backgroundColor: "#2db7f5"
      };
    }
  }
};

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
          <el-button size="small" type="primary" @click="onPrint"
            >打印</el-button
          >
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
          class="el-table"
          :data="tableData"
          border
          style="margin: 40px auto; width: 100%"
          :row-class-name="tableRowClassName"
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
        <p class="font-medium pt-1">Vxe Table</p>
        <vxe-table
          class="vxe-table"
          border
          style="margin: 40px auto"
          :header-cell-style="headerCellStyle"
          :row-style="rowStyle"
          :cell-style="cellStyle"
          :data="demo1.tableData"
        >
          <vxe-column type="seq" width="60" />
          <vxe-column field="name" title="Name" />
          <vxe-column field="sex" title="Sex" />
          <vxe-column field="age" title="Age" />
          <vxe-column field="attr1" title="Attr1" />
          <vxe-column field="address" title="Address" show-overflow />
        </vxe-table>
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
        <ReLine class="echart" style="margin: 0 auto" />
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
          src="../../assets/avatars.jpg"
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
