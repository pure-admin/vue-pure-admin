<script lang="ts" setup>
import { useResizeObserver } from "@vueuse/core";
import type { ElText } from "element-plus";
import {
  PropType,
  computed,
  h,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watchEffect
} from "vue";
import { TippyOptions, useTippy } from "vue-tippy";

const props = defineProps({
  // 行数
  lineClamp: {
    type: Number
  },
  tippyProps: {
    type: Object as PropType<TippyOptions>,
    default: () => ({})
  },
  needPropsWatch: {
    type: Boolean,
    default: true
  },
  needResizeObserver: {
    type: Boolean,
    default: true
  }
});
const $attrs = useAttrs();
const $slots = useSlots();

const textRef = ref<InstanceType<typeof ElText>>();

const isTextEllipsis = () => {
  if (!props.lineClamp) {
    // 单行省略判断
    return textRef.value?.$el.scrollWidth > textRef.value?.$el.clientWidth;
  } else {
    // 多行省略判断
    return textRef.value?.$el.scrollHeight > textRef.value?.$el.clientHeight;
  }
};

const getTextProps = computed(() => {
  return Object.assign(
    {
      truncated: !props.lineClamp,
      lineClamp: props.lineClamp
    },
    $attrs
  );
});

const getTippyProps = computed(() => {
  return Object.assign(
    {
      content: h($slots.content || $slots.default)
    },
    props.tippyProps
  );
});

onMounted(() => {
  const { disable, enable, setProps } = useTippy(
    textRef.value?.$el,
    getTippyProps.value
  );

  if (props.needPropsWatch) {
    // 监听 props 变化
    watchEffect(() => {
      setProps(getTippyProps.value);
      isTextEllipsis() ? enable() : disable();
    });
  }

  if (props.needResizeObserver) {
    // 监听文本宽度变化
    useResizeObserver(textRef, () => {
      isTextEllipsis() ? enable() : disable();
    });
  }
});
</script>

<template>
  <el-text v-bind="getTextProps" ref="textRef">
    <slot />
  </el-text>
</template>
