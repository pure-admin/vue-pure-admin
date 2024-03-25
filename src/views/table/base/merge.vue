<script setup lang="ts">
interface User {
  id: string;
  name: string;
  amount1: string;
  amount2: string;
  amount3: number;
}

interface SpanMethodProps {
  row: User;
  column: any;
  rowIndex: number;
  columnIndex: number;
}

const arraySpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2];
    } else if (columnIndex === 1) {
      return [0, 0];
    }
  }
};

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

const tableData: User[] = [
  {
    id: "12987122",
    name: "Tom",
    amount1: "234",
    amount2: "3.2",
    amount3: 10
  },
  {
    id: "12987123",
    name: "Tom",
    amount1: "165",
    amount2: "4.43",
    amount3: 12
  },
  {
    id: "12987124",
    name: "Tom",
    amount1: "324",
    amount2: "1.9",
    amount3: 9
  },
  {
    id: "12987125",
    name: "Tom",
    amount1: "621",
    amount2: "2.2",
    amount3: 17
  },
  {
    id: "12987126",
    name: "Tom",
    amount1: "539",
    amount2: "4.1",
    amount3: 15
  }
];

const columns: TableColumnList = [
  {
    label: "ID",
    prop: "id"
  },
  {
    label: "Name",
    prop: "name"
  },
  {
    label: "Amount 1",
    prop: "amount1",
    sortable: true
  },
  {
    label: "Amount 2",
    prop: "amount2",
    sortable: true
  },
  {
    label: "Amount 3",
    prop: "amount3",
    sortable: true
  }
];
</script>

<template>
  <div>
    <pure-table
      :data="tableData"
      :columns="columns"
      :span-method="arraySpanMethod"
      border
    />

    <pure-table
      :data="tableData"
      :columns="columns"
      :span-method="objectSpanMethod"
      border
    />
  </div>
</template>
