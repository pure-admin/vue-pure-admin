<script setup lang="ts">
import { ref } from "vue";
// https://plus-pro-components.com/components/search.html
import "plus-pro-components/es/components/search/style/css";
import { type PlusColumn, PlusSearch } from "plus-pro-components";

const state = ref({
  status: "0",
  time: new Date().toString()
});

const columns: PlusColumn[] = [
  {
    label: "名称",
    prop: "name",
    valueType: "copy",
    tooltip: "名称最多显示6个字符"
  },
  {
    label: "状态",
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "未解决",
        value: "0",
        color: "red"
      },
      {
        label: "已解决",
        value: "1",
        color: "blue"
      },
      {
        label: "解决中",
        value: "2",
        color: "yellow"
      },
      {
        label: "失败",
        value: "3",
        color: "red"
      }
    ]
  },
  {
    label: "时间",
    prop: "time",
    valueType: "date-picker"
  },
  {
    label: "数量",
    prop: "number",
    valueType: "input-number",
    fieldProps: { precision: 2, step: 2 }
  },
  {
    label: "城市",
    prop: "city",
    valueType: "cascader",
    options: [
      {
        value: "0",
        label: "陕西",
        children: [
          {
            value: "0-0",
            label: "西安",
            children: [
              {
                value: "0-0-0",
                label: "新城区"
              },
              {
                value: "0-0-1",
                label: "高新区"
              },
              {
                value: "0-0-2",
                label: "灞桥区"
              }
            ]
          }
        ]
      },
      {
        value: "1",
        label: "山西",
        children: [
          {
            value: "1-0",
            label: "太原",
            children: [
              {
                value: "1-0-0",
                label: "小店区"
              },
              {
                value: "1-0-1",
                label: "古交市"
              },
              {
                value: "1-0-2",
                label: "万柏林区"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "地区",
    prop: "place",
    tooltip: "请精确到门牌号",
    fieldProps: {
      placeholder: "请精确到门牌号"
    }
  },
  {
    label: "到期时间",
    prop: "endTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择"
    }
  },
  {
    label: "奖励",
    prop: "price"
  },
  {
    label: "提成",
    prop: "percentage"
  }
];

const handleChange = (values: any) => {
  console.log(values, "change");
};
const handleSearch = (values: any) => {
  console.log(values, "search");
};
const handleRest = () => {
  console.log("handleRest");
};
</script>

<template>
  <PlusSearch
    v-model="state"
    :columns="columns"
    :show-number="2"
    label-width="80"
    label-position="right"
    @change="handleChange"
    @search="handleSearch"
    @reset="handleRest"
  />
</template>
