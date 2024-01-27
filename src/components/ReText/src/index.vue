<script lang="ts" setup>
import { useResizeObserver } from "@vueuse/core";
import type { ElText } from "element-plus";
import { PropType, computed, h, onMounted, ref, useAttrs, useSlots } from "vue";
import { TippyOptions } from "vue-tippy";

const props = defineProps({
  // 行数
  lineClamp: {
    type: Number
  },
  tippyProps: {
    type: Object as PropType<TippyOptions>,
    default: () => ({})
  }
});
const $attrs = useAttrs();
const $slots = useSlots();

const tippyVisible = ref(false);
const textRef = ref<InstanceType<typeof ElText>>();

const getTippyVisible = () => {
  if (!props.lineClamp) {
    // 单行省略判断
    tippyVisible.value =
      textRef.value?.$el.scrollWidth > textRef.value?.$el.clientWidth;
  } else {
    // 多行省略判断
    tippyVisible.value =
      textRef.value?.$el.scrollHeight > textRef.value?.$el.clientHeight;
  }
};

const getTippyProps = computed(() => {
  return tippyVisible.value
    ? Object.assign(
        {
          content: h($slots.content || $slots.default)
        },
        props.tippyProps
      )
    : undefined;
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
  getTippyVisible();

  useResizeObserver(textRef, () => {
    getTippyVisible();
  });
});
</script>

<template>
  <el-text v-bind="getTextProps" ref="textRef" v-tippy="getTippyProps">
    <slot />
  </el-text>
</template>
