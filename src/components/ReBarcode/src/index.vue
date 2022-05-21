<script setup lang="ts">
import JsBarcode from "jsbarcode";
import { ref, onMounted } from "vue";

defineOptions({
  name: "ReBarcode"
});

const props = defineProps({
  tag: {
    type: String,
    default: "canvas"
  },
  text: {
    type: String,
    default: null
  },
  // 完整配置 https://github.com/lindell/JsBarcode/wiki/Options
  options: {
    type: Object,
    default() {
      return {};
    }
  },
  // type 相当于 options.format，如果 type 和 options.format 同时存在，type 值优先；
  type: {
    type: String,
    default: "CODE128"
  }
});

const wrapEl = ref(null);

onMounted(() => {
  const opt = { ...props.options, format: props.type };
  JsBarcode(wrapEl.value, props.text, opt);
});
</script>

<template>
  <component :is="tag" ref="wrapEl" />
</template>
