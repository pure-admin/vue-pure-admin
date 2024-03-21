<script setup lang="ts">
import { ref } from "vue";
// https://plus-pro-components.com/components/dialog-form.html
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";

const columns: PlusColumn[] = [
  {
    label: "名称",
    width: 120,
    prop: "name",
    valueType: "copy",
    tooltip: "名称最多显示6个字符"
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
    label: "要求",
    prop: "demand",
    valueType: "checkbox",
    options: [
      {
        label: "四六级",
        value: "0"
      },
      {
        label: "计算机二级证书",
        value: "1"
      },
      {
        label: "普通话证书",
        value: "2"
      }
    ]
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
      // @ts-expect-error
      autosize: { minRows: 2, maxRows: 4 }
    }
  }
];

const visible = ref(false);
const values = ref<FieldValues>({});

const handleOpen = () => {
  visible.value = true;
};
</script>

<template>
  <div>
    <el-button @click="handleOpen">打开弹窗表单</el-button>
    <PlusDialogForm
      v-model:visible="visible"
      v-model="values"
      :form="{ columns }"
    />
  </div>
</template>
