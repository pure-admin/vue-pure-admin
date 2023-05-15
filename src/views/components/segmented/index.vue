<script setup lang="tsx">
import { h } from "vue";
import { message } from "@/utils/message";
import HomeFilled from "@iconify-icons/ep/home-filled";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Segmented, { type OptionsType } from "@/components/ReSegmented";

defineOptions({
  name: "Segmented"
});

/** 基础用法 */
const optionsBasis: Array<OptionsType> = [
  {
    label: "周一",
    value: 1
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3
  },
  {
    label: "周四",
    value: 4
  },
  {
    label: "周五",
    value: 5
  }
];

/** 禁用 */
const optionsDisabled: Array<OptionsType> = [
  {
    label: "周一",
    value: 1
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3,
    disabled: true
  },
  {
    label: "周四",
    value: 4
  },
  {
    label: "周五",
    value: 5,
    disabled: true
  }
];

/** 设置图标 */
const optionsIcon: Array<OptionsType> = [
  {
    label: "周一",
    value: 1,
    icon: HomeFilled
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3,
    icon: "terminalWindowLine"
  },
  {
    label: "周四",
    value: 4,
    icon: "streamline-emojis:airplane"
  },
  {
    label: "周五",
    value: 5,
    icon: "streamline-emojis:2"
  }
];

/** 只设置图标 */
const optionsOnlyIcon: Array<OptionsType> = [
  {
    value: 1,
    icon: HomeFilled
  },
  {
    value: 2,
    icon: "terminalWindowLine"
  },
  {
    value: 3,
    icon: "streamline-emojis:cow-face"
  },
  {
    value: 4,
    icon: "streamline-emojis:airplane"
  },
  {
    value: 5,
    icon: "streamline-emojis:2"
  }
];

/** 自定义渲染 */
const optionsLabel: Array<OptionsType> = [
  {
    label: () => (
      <div>
        {h(useRenderIcon(HomeFilled), {
          class: "m-auto w-[20px] h-[20px]"
        })}
        <p>周一</p>
      </div>
    ),
    value: 1
  },
  {
    label: () => (
      <div>
        {h(useRenderIcon("terminalWindowLine"), {
          class: "m-auto w-[20px] h-[20px]"
        })}
        <p>周二</p>
      </div>
    ),
    value: 2
  },
  {
    label: () => (
      <div>
        {h(useRenderIcon("streamline-emojis:cow-face"), {
          class: "m-auto w-[20px] h-[20px]"
        })}
        <p>周三</p>
      </div>
    ),
    value: 3
  }
];

const optionsChange: Array<OptionsType> = [
  {
    label: "周一",
    value: 1
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3
  }
];

/** change事件 */
function onChange({ index, option }) {
  const { label, value } = option;
  message(`当前选中项索引为：${index}，名字为${label}，值为${value}`, {
    type: "success"
  });
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">分段控制器</span>
      </div>
    </template>
    <p class="mb-2">基础用法</p>
    <Segmented :options="optionsBasis" />
    <el-divider />
    <p class="mb-2">默认选中和禁用</p>
    <Segmented :options="optionsDisabled" :defaultValue="2" />
    <el-divider />
    <p class="mb-2">设置图标</p>
    <Segmented :options="optionsIcon" />
    <el-divider />
    <p class="mb-2">只设置图标</p>
    <Segmented :options="optionsOnlyIcon" />
    <el-divider />
    <p class="mb-2">自定义渲染</p>
    <Segmented :options="optionsLabel" />
    <el-divider />
    <p class="mb-2">change事件</p>
    <Segmented :options="optionsChange" @change="onChange" />
    <el-divider />
  </el-card>
</template>
