<script setup lang="ts">
import { ref, watch } from "vue";
import { useDark } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineOptions({
  name: "PureButton"
});

const { isDark } = useDark();
const size = ref("default");
const dynamicSize = ref();

const baseRadio = ref("default");
const buttonList = [
  {
    type: "",
    text: "Default",
    icon: "ep:search"
  },
  {
    type: "primary",
    text: "Primary",
    icon: "ep:edit"
  },
  {
    type: "success",
    text: "Success",
    icon: "ep:check"
  },
  {
    type: "info",
    text: "Info",
    icon: "ep:message"
  },
  {
    type: "warning",
    text: "Warning",
    icon: "ep:star"
  },
  {
    type: "danger",
    text: "Danger",
    icon: "ep:delete"
  }
];

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <el-space wrap :size="40">
          <el-link
            v-tippy="{
              content: '点击查看详细文档'
            }"
            href="https://element-plus.org/zh-CN/component/button.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            Button 按钮
          </el-link>
          <el-radio-group v-model="size">
            <el-radio value="large">大尺寸</el-radio>
            <el-radio value="default">默认尺寸</el-radio>
            <el-radio value="small">小尺寸</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-space>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/el-button.vue"
        target="_blank"
      >
        代码位置 src/views/components/el-button.vue
      </el-link>
    </template>

    <p class="mb-2">基础按钮</p>
    <el-radio-group v-model="baseRadio" class="mb-3">
      <el-radio label="default" value="default" />
      <el-radio label="plain" value="plain" />
      <el-radio label="round" value="round" />
      <el-radio label="circle" value="circle" />
      <el-radio label="link" value="link" />
      <el-radio label="text" value="text" />
      <el-radio label="text-bg" value="text-bg" />
    </el-radio-group>
    <br />
    <el-space wrap>
      <el-button
        v-for="(button, index) in buttonList"
        :key="index"
        :type="button.type as any"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
        :plain="baseRadio === 'plain'"
        :round="baseRadio === 'round'"
        :circle="baseRadio === 'circle'"
        :link="baseRadio === 'link'"
        :text="baseRadio === 'text' || baseRadio === 'text-bg'"
        :bg="baseRadio === 'text-bg'"
        :icon="useRenderIcon(button.icon)"
      >
        <template v-if="baseRadio !== 'circle'" #default>
          <p>{{ button.text }}</p>
        </template>
      </el-button>
    </el-space>
    <el-divider />

    <p class="mb-4">加载状态按钮</p>
    <el-button
      text
      bg
      type="primary"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
      :loading="size !== 'disabled'"
    >
      {{ size === "disabled" ? "停止加载" : "加载中" }}
    </el-button>
    <el-button
      type="primary"
      plain
      :size="dynamicSize"
      :disabled="size === 'disabled'"
      :loading-icon="useRenderIcon('ep:eleme')"
      :loading="size !== 'disabled'"
    >
      {{ size === "disabled" ? "停止加载" : "加载中" }}
    </el-button>
    <el-button
      type="primary"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
      :loading="size !== 'disabled'"
    >
      <template #loading>
        <div class="custom-loading">
          <svg class="circular" viewBox="-10, -10, 50, 50">
            <path
              class="path"
              d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
              style="fill: rgb(0 0 0 / 0%); stroke-width: 4px"
            />
          </svg>
        </div>
      </template>
      {{ size === "disabled" ? "停止加载" : "加载中" }}
    </el-button>
    <el-divider />

    <p class="mb-4">自定义元素标签。例如：按钮、div、链接</p>
    <el-button :size="dynamicSize" :disabled="size === 'disabled'">
      button 标签
    </el-button>
    <el-button
      tag="div"
      role="button"
      tabindex="0"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      div 标签
    </el-button>
    <el-button
      type="primary"
      tag="a"
      :href="
        size === 'disabled'
          ? 'javascript:void(0);'
          : 'https://element-plus.org/zh-CN/component/button.html#tag'
      "
      :target="size === 'disabled' ? '_self' : '_blank'"
      rel="noopener noreferrer"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      a 链接
    </el-button>
    <el-divider />

    <p class="mb-4">自定义颜色</p>
    <el-space wrap>
      <el-button
        color="#626aef"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
        :dark="isDark"
      >
        Default
      </el-button>
      <el-button
        color="#626aef"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
        :dark="isDark"
        plain
      >
        Plain
      </el-button>
    </el-space>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-divider--horizontal) {
  margin: 17px 0;
}

.el-button .custom-loading .circular {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  animation: loading-rotate 2s linear infinite;
}

.el-button .custom-loading .circular .path {
  stroke: var(--el-button-text-color);
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke-width: 2;
  animation: loading-dash 1.5s ease-in-out infinite;
}
</style>
