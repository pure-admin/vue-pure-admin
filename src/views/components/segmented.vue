<script setup lang="tsx">
import { h, ref, watch } from "vue";
import { message } from "@/utils/message";
import HomeFilled from "@iconify-icons/ep/home-filled";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Segmented, { type OptionsType } from "@/components/ReSegmented";

defineOptions({
  name: "Segmented"
});

/** 基础用法 */
const value = ref(4); // 必须为number类型
const size = ref("default");
const dynamicSize = ref();

const optionsBasis: Array<OptionsType> = [
  {
    label: "周一"
  },
  {
    label: "周二"
  },
  {
    label: "周三"
  },
  {
    label: "周四"
  },
  {
    label: "周五"
  }
];

/** tooltip 提示 */
const optionsTooltip: Array<OptionsType> = [
  {
    label: "周一",
    tip: "周一启航，新的篇章"
  },
  {
    label: "周二",
    tip: "周二律动，携手共进"
  },
  {
    label: "周三",
    tip: "周三昂扬，激情不减"
  },
  {
    label: "周四",
    tip: "周四精进，事半功倍"
  },
  {
    label: "周五",
    tip: "周五喜悦，收尾归档"
  }
];

/** 禁用 */
const optionsDisabled: Array<OptionsType> = [
  {
    label: "周一"
  },
  {
    label: "周二"
  },
  {
    label: "周三",
    disabled: true
  },
  {
    label: "周四"
  },
  {
    label: "周五",
    disabled: true
  }
];

/** block */
const optionsBlock: Array<OptionsType> = [
  {
    label: "周一"
  },
  {
    label: "周二"
  },
  {
    label: "周三"
  },
  {
    label: "周四"
  },
  {
    label: "周五喜悦，收尾归档，周末倒计时",
    tip: "周五喜悦，收尾归档，周末倒计时"
  }
];

/** 可设置图标 */
const optionsIcon: Array<OptionsType> = [
  {
    label: "周一",
    icon: HomeFilled
  },
  {
    label: "周二"
  },
  {
    label: "周三",
    icon: "ri:terminal-window-line"
  },
  {
    label: "周四"
  },
  {
    label: "周五",
    icon: "streamline-emojis:2"
  }
];

/** 只设置图标 */
const optionsOnlyIcon: Array<OptionsType> = [
  {
    icon: HomeFilled
  },
  {
    icon: "ri:terminal-window-line"
  },
  {
    icon: "streamline-emojis:cow-face"
  },
  {
    icon: "streamline-emojis:airplane"
  },
  {
    icon: "streamline-emojis:2"
  }
];

/** 自定义渲染 */
const optionsLabel: Array<OptionsType> = [
  {
    label: () => (
      <div>
        {h(useRenderIcon(HomeFilled), {
          class: "m-auto mt-1 w-[18px] h-[18px]"
        })}
        <p>周一</p>
      </div>
    )
  },
  {
    label: () => (
      <div>
        {h(useRenderIcon("ri:terminal-window-line"), {
          class: "m-auto mt-1 w-[18px] h-[18px]"
        })}
        <p>周二</p>
      </div>
    )
  },
  {
    label: () => (
      <div>
        {h(useRenderIcon("streamline-emojis:cow-face"), {
          class: "m-auto mt-1 w-[18px] h-[18px]"
        })}
        <p>周三</p>
      </div>
    )
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

/** change 事件 */
function onChange({ index, option }) {
  const { label, value } = option;
  message(`当前选中项索引为：${index}，名字为${label}，值为${value}`, {
    type: "success"
  });
}

watch(size, val => (dynamicSize.value = size.value));
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <el-space wrap :size="40">
          <span style="font-size: 16px; font-weight: 800"> 分段控制器 </span>
          <el-radio-group v-model="size">
            <el-radio value="large">大尺寸</el-radio>
            <el-radio value="default">默认尺寸</el-radio>
            <el-radio value="small">小尺寸</el-radio>
          </el-radio-group>
        </el-space>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/segmented.vue"
        target="_blank"
      >
        代码位置 src/views/components/segmented.vue
      </el-link>
    </template>
    <el-scrollbar>
      <p class="mb-2">
        基础用法（v-model）<span class="text-primary">
          {{ optionsBasis[value].label }}
        </span>
      </p>
      <Segmented v-model="value" :options="optionsBasis" :size="dynamicSize" />
      <el-divider />
      <p class="mb-2">tooltip 提示</p>
      <Segmented :options="optionsTooltip" :size="dynamicSize" />
      <el-divider />
      <p class="mb-2">change 事件</p>
      <Segmented
        :options="optionsChange"
        :size="dynamicSize"
        @change="onChange"
      />
      <el-divider />
      <p class="mb-2">禁用</p>
      <Segmented :options="optionsDisabled" :size="dynamicSize" />
      <el-divider />
      <p class="mb-2">全局禁用</p>
      <Segmented :options="optionsBasis" :size="dynamicSize" disabled />
      <el-divider />
      <p class="mb-2">block 属性(将宽度调整为父元素宽度)</p>
      <Segmented :options="optionsBlock" block :size="dynamicSize" />
      <el-divider />
      <p class="mb-2">可设置图标</p>
      <Segmented :options="optionsIcon" :size="dynamicSize" />
      <el-divider />
      <p class="mb-2">只设置图标</p>
      <Segmented :options="optionsOnlyIcon" :size="dynamicSize" />
      <el-divider />
      <p class="mb-2">自定义渲染</p>
      <Segmented :options="optionsLabel" :size="dynamicSize" />
    </el-scrollbar>
  </el-card>
</template>

<style scoped>
:deep(.el-divider--horizontal) {
  margin: 17px 0;
}
</style>
