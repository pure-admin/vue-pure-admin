<script lang="ts" setup>
import { h, onMounted, reactive, ref, useAttrs, useSlots } from "vue";
import { useTippy, type TippyOptions } from "vue-tippy";

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

const textRef = ref();
const tippyFunc = reactive<{
  enable: () => void;
  disable: () => void;
  setProps: (prop: TippyOptions) => void;
}>({
  enable: () => {},
  disable: () => {},
  setProps: () => {}
});

const isTextEllipsis = (el: HTMLElement) => {
  if (!props.lineClamp) {
    // 单行省略判断
    return el.scrollWidth > el.clientWidth;
  } else {
    // 多行省略判断
    return el.scrollHeight > el.clientHeight;
  }
};

const getTippyProps = () => ({
  content: h($slots.content || $slots.default),
  ...props.tippyProps
});

function handleHover(event: MouseEvent) {
  if (isTextEllipsis(event.target as HTMLElement)) {
    tippyFunc.setProps(getTippyProps());
    tippyFunc.enable();
  } else {
    tippyFunc.disable();
  }
}

onMounted(() => {
  const { disable, enable, setProps } = useTippy(
    textRef.value?.$el,
    getTippyProps()
  );
  tippyFunc.enable = enable;
  tippyFunc.disable = disable;
  tippyFunc.setProps = setProps;
});
</script>

<template>
  <el-text
    v-bind="{
      truncated: !lineClamp,
      lineClamp,
      ...$attrs
    }"
    ref="textRef"
    @mouseover.self="handleHover"
  >
    <slot />
  </el-text>
</template>
