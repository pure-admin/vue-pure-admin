<script setup lang="ts">
import { animates } from "./animate";
import { ref, computed, toRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";

defineOptions({
  name: "ReAnimateSelector"
});

const props = defineProps({
  modelValue: {
    require: false,
    type: String
  }
});
const emit = defineEmits<{ (e: "update:modelValue", v: string) }>();

const inputValue = toRef(props, "modelValue");
const animatesList = ref(animates);
const copyAnimatesList = cloneDeep(animatesList);

const animateClass = computed(() => {
  return [
    "mt-1",
    "flex",
    "border",
    "w-[130px]",
    "h-[100px]",
    "items-center",
    "cursor-pointer",
    "transition-all",
    "justify-center",
    "border-[#e5e7eb]",
    "hover:text-primary",
    "hover:duration-[700ms]"
  ];
});

const animateStyle = computed(
  () => (i: string) =>
    inputValue.value === i
      ? {
          borderColor: "var(--el-color-primary)",
          color: "var(--el-color-primary)"
        }
      : ""
);

function onChangeIcon(animate: string) {
  emit("update:modelValue", animate);
}

function onClear() {
  emit("update:modelValue", "");
}

function filterMethod(value: any) {
  animatesList.value = copyAnimatesList.value.filter((i: string | any[]) =>
    i.includes(value)
  );
}

const animateMap = ref({});
function onMouseEnter(index: string | number) {
  animateMap.value[index] = animateMap.value[index]?.loading
    ? Object.assign({}, animateMap.value[index], {
        loading: false
      })
    : Object.assign({}, animateMap.value[index], {
        loading: true
      });
}
function onMouseleave() {
  animateMap.value = {};
}
</script>

<template>
  <el-select
    :model-value="inputValue"
    placeholder="请选择动画"
    clearable
    filterable
    @clear="onClear"
    :filter-method="filterMethod"
  >
    <template #empty>
      <div class="w-[280px]">
        <el-scrollbar
          noresize
          height="212px"
          :view-style="{ overflow: 'hidden' }"
          class="border-t border-[#e5e7eb]"
        >
          <ul class="flex flex-wrap justify-around mb-1">
            <li
              v-for="(animate, index) in animatesList"
              :key="index"
              :class="animateClass"
              :style="animateStyle(animate)"
              @mouseenter.prevent="onMouseEnter(index)"
              @mouseleave.prevent="onMouseleave"
              @click="onChangeIcon(animate)"
            >
              <h4
                :class="[
                  `animate__animated animate__${
                    animateMap[index]?.loading
                      ? animate + ' animate__infinite'
                      : ''
                  } `
                ]"
              >
                {{ animate }}
              </h4>
            </li>
          </ul>
          <el-empty
            v-show="animatesList.length === 0"
            description="暂无动画"
            :image-size="60"
          />
        </el-scrollbar>
      </div>
    </template>
  </el-select>
</template>
