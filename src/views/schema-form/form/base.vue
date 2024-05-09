<script setup lang="ts">
import { ref } from "vue";
// https://plus-pro-components.com/components/form.html
import "plus-pro-components/es/components/form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm
} from "plus-pro-components";

const state = ref<FieldValues>({
  status: "1",
  name: "",
  rate: 4,
  progress: 100,
  switch: true,
  time: new Date().toString(),
  endTime: []
});

const rules = {
  name: [
    {
      required: true,
      message: "请输入名称"
    }
  ]
};

const columns: PlusColumn[] = [
  {
    label: "名称",
    width: 120,
    prop: "name",
    valueType: "copy",
    tooltip: "我是名称"
  },
  {
    label: "状态",
    width: 120,
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
    label: "执行进度",
    width: 200,
    prop: "progress"
  },
  {
    label: "评分",
    width: 200,
    prop: "rate",
    valueType: "rate"
  },
  {
    label: "是否显示",
    width: 100,
    prop: "switch",
    valueType: "switch"
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
    label: "梦想",
    prop: "gift",
    valueType: "radio",
    options: [
      {
        label: "诗",
        value: "0"
      },
      {
        label: "远方",
        value: "1"
      },
      {
        label: "美食",
        value: "2"
      }
    ]
  },
  {
    label: "到期时间",
    prop: "endTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择开始时间",
      endPlaceholder: "请选择结束时间"
    }
  },
  {
    label: "说明",
    prop: "desc",
    valueType: "textarea",
    fieldProps: {
      maxlength: 10,
      showWordLimit: true,
      autosize: { minRows: 2, maxRows: 4 }
    }
  }
];

const handleChange = (values: FieldValues, prop: PlusColumn) => {
  console.log(values, prop, "change");
};
const handleSubmit = (values: FieldValues) => {
  console.log(values, "Submit");
};
const handleSubmitError = (err: any) => {
  console.log(err, "err");
};
const handleReset = () => {
  console.log("handleReset");
};
</script>

<template>
  <PlusForm
    v-model="state"
    class="w-[450px] m-auto"
    :columns="columns"
    :rules="rules"
    label-position="right"
    @change="handleChange"
    @submit="handleSubmit"
    @submit-error="handleSubmitError"
    @reset="handleReset"
  />
</template>
