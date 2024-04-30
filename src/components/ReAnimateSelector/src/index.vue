<script setup lang="ts">
import { ref, computed } from "vue";
import { animates } from "./animate";
import { cloneDeep } from "@pureadmin/utils";

defineOptions({
  name: "ReAnimateSelector"
});

defineProps({
  placeholder: {
    type: String,
    default: "请选择动画"
  }
});

const inputValue = defineModel({ type: String });

const searchVal = ref();
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
  inputValue.value = animate;
}

function onClear() {
  inputValue.value = "";
}

function filterMethod(value: any) {
  searchVal.value = value;
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
    clearable
    filterable
    :placeholder="placeholder"
    popper-class="pure-animate-popper"
    :model-value="inputValue"
    :filter-method="filterMethod"
    @clear="onClear"
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
            :description="`${searchVal} 动画不存在`"
            :image-size="60"
          />
        </el-scrollbar>
      </div>
    </template>
  </el-select>
</template>

<style>
.pure-animate-popper {
  min-width: 0 !important;
}
</style>
