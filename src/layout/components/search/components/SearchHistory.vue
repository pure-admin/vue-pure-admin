<script setup lang="ts">
import draggable from "vuedraggable/src/vuedraggable";
import SearchHistoryItem from "./SearchHistoryItem.vue";
import type { optionsItem, dragItem, Props } from "../types";
import { useResizeObserver, isArray } from "@pureadmin/utils";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { ref, computed, watch, getCurrentInstance, onMounted } from "vue";

interface Emits {
  (e: "update:value", val: string): void;
  (e: "enter"): void;
  (e: "collect", val: optionsItem): void;
  (e: "delete", val: optionsItem): void;
  (e: "drag", val: dragItem): void;
}

const historyRef = ref();
const innerHeight = ref();
/** 判断是否停止鼠标移入事件处理 */
const stopMouseEvent = ref(false);

const emit = defineEmits<Emits>();
const instance = getCurrentInstance()!;
const props = withDefaults(defineProps<Props>(), {});

const itemStyle = computed(() => {
  return item => {
    return {
      background:
        item?.path === active.value ? useEpThemeStoreHook().epThemeColor : "",
      color: item.path === active.value ? "#fff" : "",
      fontSize: item.path === active.value ? "16px" : "14px"
    };
  };
});

const titleStyle = computed(() => {
  return {
    color: useEpThemeStoreHook().epThemeColor,
    fontSize: "14px",
    fontWeight: 500
  };
});

const active = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit("update:value", val);
  }
});

watch(
  () => props.value,
  newValue => {
    if (newValue) {
      if (stopMouseEvent.value) {
        setTimeout(() => {
          stopMouseEvent.value = false;
        }, 100);
      }
    }
  }
);

const historyList = computed(() => {
  return props.options.filter(item => item.type === "history");
});

const collectList = computed(() => {
  return props.options.filter(item => item.type === "collect");
});

function handleCollect(item) {
  emit("collect", item);
}

function handleDelete(item) {
  stopMouseEvent.value = true;
  emit("delete", item);
}

/** 鼠标移入 */
async function handleMouse(item) {
  if (!stopMouseEvent.value) active.value = item.path;
}

function handleTo() {
  emit("enter");
}

function resizeResult() {
  // el-scrollbar max-height="calc(90vh - 140px)"
  innerHeight.value = window.innerHeight - window.innerHeight / 10 - 140;
}

useResizeObserver(historyRef, resizeResult);

function handleScroll(index: number) {
  const curInstance = instance?.proxy?.$refs[`historyItemRef${index}`];
  if (!curInstance) return 0;
  const curRef = isArray(curInstance)
    ? (curInstance[0] as ElRef)
    : (curInstance as ElRef);
  const scrollTop = curRef.offsetTop + 128; // 128 两个history-item（56px+56px=112px）高度加上下margin（8px+8px=16px）
  return scrollTop > innerHeight.value ? scrollTop - innerHeight.value : 0;
}

const handleChangeIndex = (evt): void => {
  emit("drag", { oldIndex: evt.oldIndex, newIndex: evt.newIndex });
};

onMounted(() => {
  resizeResult();
});

defineExpose({ handleScroll });
</script>

<template>
  <div ref="historyRef" class="history">
    <template v-if="historyList.length">
      <div :style="titleStyle">搜索历史</div>
      <div
        v-for="(item, index) in historyList"
        :key="item.path"
        :ref="'historyItemRef' + index"
        class="history-item dark:bg-[#1d1d1d]"
        :style="itemStyle(item)"
        @click="handleTo"
        @mouseenter="handleMouse(item)"
      >
        <SearchHistoryItem
          :item="item"
          @delete-item="handleDelete"
          @collect-item="handleCollect"
        />
      </div>
    </template>
    <template v-if="collectList.length">
      <div :style="titleStyle" class="mt-4">
        收藏{{ collectList.length > 1 ? "（可拖拽排序）" : "" }}
      </div>
      <draggable
        :list="collectList"
        item-key="path"
        chosen-class="chosen"
        animation="200"
        @update="handleChangeIndex"
      >
        <template #item="{ element, index }">
          <div
            :ref="'historyItemRef' + (index + historyList.length)"
            class="history-item dark:bg-[#1d1d1d] !cursor-move"
            :style="itemStyle(element)"
            @click="handleTo"
            @mouseenter="handleMouse(element)"
          >
            <SearchHistoryItem :item="element" @delete-item="handleDelete" />
          </div>
        </template>
      </draggable>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.history {
  padding-bottom: 12px;

  &-item {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 14px;
    margin-top: 8px;
    cursor: pointer;
    border: 0.1px solid #ccc;
    border-radius: 4px;
    transition: font-size 0.16s;
  }

  .chosen {
    border: solid 2px #3089dc !important;
  }
}
</style>
