<script lang="ts" setup>
import { useResizeObserver } from "@vueuse/core";
import type { ElText } from "element-plus";
import { ElTooltipProps } from "element-plus/es/components/tooltip";
import { PropType, computed, onMounted, ref, useAttrs } from "vue";
const props = defineProps({
  // 文本内容
  text: {
    type: String,
    default: ""
  },
  // 行数
  lineClamp: {
    type: Number
  },
  // tooltip props
  tooltipProps: {
    type: Object as PropType<Partial<ElTooltipProps>>,
    default: () => ({})
  }
});

const tooltipVisible = ref(false);
const textRef = ref<InstanceType<typeof ElText>>();
const $attrs = useAttrs();

const getTooltipVisible = () => {
  if (!props.lineClamp) {
    // 单行省略判断
    tooltipVisible.value =
      textRef.value?.$el.scrollWidth > textRef.value?.$el.clientWidth;
  } else {
    // 多行省略判断
    tooltipVisible.value =
      textRef.value?.$el.scrollHeight > textRef.value?.$el.clientHeight;
  }
};

const getTooltipProps = computed(() => {
  return Object.assign(
    {
      placement: "top",
      content: props.text,
      disabled: !tooltipVisible.value || !props.text,
      popperClass: "max-w-300px"
    },
    props.tooltipProps
  );
});

const getTextProps = computed(() => {
  return Object.assign(
    {
      truncated: !props.lineClamp,
      lineClamp: props.lineClamp
    },
    $attrs
  );
});

onMounted(() => {
  getTooltipVisible();

  useResizeObserver(textRef, () => {
    getTooltipVisible();
  });
});
</script>

<template>
  <el-tooltip v-bind="getTooltipProps">
    <template #content>
      <slot name="content" />
    </template>
    <el-text v-bind="getTextProps" ref="textRef">
      {{ text }}
      <slot />
    </el-text>
  </el-tooltip>
</template>
