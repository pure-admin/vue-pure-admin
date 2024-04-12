<script lang="ts" setup>
import { h, onMounted, ref, useSlots } from "vue";
import { type TippyOptions, useTippy } from "vue-tippy";

defineOptions({
  name: "ReText"
});

const props = defineProps({
  // 行数
  lineClamp: {
    type: [String, Number]
  },
  tippyProps: {
    type: Object as PropType<TippyOptions>,
    default: () => ({})
  }
});

const $slots = useSlots();

const textRef = ref();
const tippyFunc = ref();

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
    tippyFunc.value.setProps(getTippyProps());
    tippyFunc.value.enable();
  } else {
    tippyFunc.value.disable();
  }
}

onMounted(() => {
  tippyFunc.value = useTippy(textRef.value?.$el, getTippyProps());
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
