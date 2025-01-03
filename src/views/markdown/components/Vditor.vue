<script setup lang="ts">
import "vditor/dist/index.css";
import Vditor from "vditor";
import { useDark } from "@pureadmin/utils";
import { useIntervalFn } from "@vueuse/core";
import { onMounted, ref, watch, toRaw, onUnmounted } from "vue";

const emit = defineEmits([
  "update:modelValue",
  "after",
  "focus",
  "blur",
  "esc",
  "ctrlEnter",
  "select"
]);

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    }
  },
  modelValue: {
    type: String,
    default: ""
  }
});

const { isDark } = useDark();
const editor = ref<Vditor | null>(null);
const markdownRef = ref<HTMLElement | null>(null);

onMounted(() => {
  editor.value = new Vditor(markdownRef.value as HTMLElement, {
    ...props.options,
    value: props.modelValue,
    cache: {
      enable: false
    },
    fullscreen: {
      index: 10000
    },
    after() {
      emit("after", toRaw(editor.value));
    },
    input(value: string) {
      emit("update:modelValue", value);
    },
    focus(value: string) {
      emit("focus", value);
    },
    blur(value: string) {
      emit("blur", value);
    },
    esc(value: string) {
      emit("esc", value);
    },
    ctrlEnter(value: string) {
      emit("ctrlEnter", value);
    },
    select(value: string) {
      emit("select", value);
    }
  });
});

watch(
  () => props.modelValue,
  newVal => {
    if (newVal !== editor.value?.getValue()) {
      editor.value?.setValue(newVal);
    }
  }
);

watch(
  () => isDark.value,
  newVal => {
    const { pause } = useIntervalFn(() => {
      if (editor.value.vditor) {
        newVal
          ? editor.value.setTheme("dark", "dark", "rose-pine")
          : editor.value.setTheme("classic", "light", "github");
        pause();
      }
    }, 20);
  }
);

onUnmounted(() => {
  const editorInstance = editor.value;
  if (!editorInstance) return;
  try {
    editorInstance?.destroy?.();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div ref="markdownRef" />
</template>
