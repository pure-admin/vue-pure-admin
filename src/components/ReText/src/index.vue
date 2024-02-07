<script lang="ts" setup>
import { useResizeObserver } from "@pureadmin/utils";
import { type TippyOptions, useTippy } from "vue-tippy";
import {
  type PropType,
  h,
  ref,
  computed,
  useAttrs,
  useSlots,
  onMounted,
  watchEffect
} from "vue";

const props = defineProps({
  // 行数
  lineClamp: {
    type: Number
  },
  tippyProps: {
    type: Object as PropType<TippyOptions>,
    default: () => ({})
  },
  watch: {
    type: Boolean,
    default: false
  },
  resize: {
    type: Boolean,
    default: false
  }
});

const $attrs = useAttrs();
const $slots = useSlots();

const textRef = ref();

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

  // 初始化 tippy 启用状态
  isTextEllipsis() ? enable() : disable();

  if (props.watch) {
    // 监听 props 变化
    watchEffect(() => {
      setProps(getTippyProps.value);
      isTextEllipsis() ? enable() : disable();
    });
  }

  if (props.resize) {
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
