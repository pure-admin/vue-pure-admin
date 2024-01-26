<script setup lang="ts">
import { match } from "pinyin-pro";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import SearchResult from "./SearchResult.vue";
import SearchHistory from "./SearchHistory.vue";
import SearchFooter from "./SearchFooter.vue";
import { getConfig } from "@/config";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { ref, computed, shallowRef } from "vue";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { localForage } from "@/utils/localforage";
import Search from "@iconify-icons/ri/search-line";
import type { optionsItem } from "../types";

interface Props {
  /** 弹窗显隐 */
  value: boolean;
}

interface Emits {
  (e: "update:value", val: boolean): void;
}

const { device } = useNav();
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {});
const router = useRouter();
const { locale } = useI18n();

const keyword = ref("");
const scrollbarRef = ref();
const resultRef = ref();
const historyRef = ref();
const activePath = ref("");
const historyPath = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const resultOptions = shallowRef([]);
const historyOptions = shallowRef([]);
const handleSearch = useDebounceFn(search, 300);
const historyNum = getConfig().MenuSearchHistory;

/** 菜单树形结构 */
const menusData = computed(() => {
  return cloneDeep(usePermissionStoreHook().wholeMenus);
});

const show = computed({
  get() {
    if (props.value) {
      getHistory();
    }
    return props.value;
  },
  set(val: boolean) {
    emit("update:value", val);
  }
});

/** 将菜单树形结构扁平化为一维数组，用于菜单查询 */
function flatTree(arr) {
  const res = [];
  function deep(arr) {
    arr.forEach(item => {
      res.push(item);
      item.children && deep(item.children);
    });
  }
  deep(arr);
  return res;
}

/** 查询 */
function search() {
  const flatMenusData = flatTree(menusData.value);
  resultOptions.value = flatMenusData.filter(menu =>
    keyword.value
      ? transformI18n(menu.meta?.title)
          .toLocaleLowerCase()
          .includes(keyword.value.toLocaleLowerCase().trim()) ||
        (locale.value === "zh" &&
          !isAllEmpty(
            match(
              transformI18n(menu.meta?.title).toLocaleLowerCase(),
              keyword.value.toLocaleLowerCase().trim()
            )
          ))
      : false
  );
  if (resultOptions.value?.length > 0) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = "";
  }
}

function handleClose() {
  show.value = false;
  /** 延时处理防止用户看到某些操作 */
  setTimeout(() => {
    resultOptions.value = [];
    keyword.value = "";
  }, 200);
}

function scrollTo(index) {
  const ref = resultOptions.value.length ? resultRef.value : historyRef.value;
  const scrollTop = ref.handleScroll(index);
  scrollbarRef.value.setScrollTop(scrollTop);
}

/** 删除历史记录 */
function handleDelete(item) {
  localForage()
    .removeItem(item.type + ":" + item.path)
    .then(function () {
      const index = historyOptions.value.findIndex(
        historyItem => historyItem.path === item.path
      );
      if (index !== -1) {
        historyOptions.value.splice(index, 1);
      }
      if (item.path === activePath.value) {
        historyPath.value = historyOptions.value[0]?.path;
      }
      getHistory();
    });
}

/** 收藏历史记录 */
function handleCollect(item) {
  localForage()
    .removeItem("history:" + item.path)
    .then(function () {
      localForage()
        .setItem("collect:" + item.path, {
          ...item,
          type: "collect"
        })
        .then(() => {
          getHistory();
        });
    })
    .catch(function (error) {
      console.log("收藏失败：", error);
    });
}

/** 本地存储搜索记录 */
function saveHistory() {
  const { path, meta } = resultOptions.value.find(
    item => item.path === activePath.value
  );
  localForage()
    .keys()
    .then(function (keys) {
      const saveKeys = keys.filter(key => key.startsWith("history:"));
      const collectKeys = keys.filter(key => key.startsWith("collect:"));
      if (collectKeys.includes("collect:" + path)) return;

      if (saveKeys.length < historyNum) {
        localForage().setItem("history:" + path, {
          path,
          meta,
          type: "history"
        });
      } else {
        const lastSaveKey = saveKeys[saveKeys.length - 1];
        localForage()
          .removeItem(lastSaveKey)
          .then(function () {
            localForage().setItem("history:" + path, {
              path,
              meta,
              type: "history"
            });
          });
      }
    });
}

/** 获取本地历史记录 */
async function getHistory() {
  try {
    const keys = await localForage().keys();
    const historyPromises = keys.map(
      key => localForage().getItem(key) as Promise<optionsItem>
    );
    const historyItems: optionsItem[] = await Promise.all(historyPromises);
    historyOptions.value = historyItems;
    const historyPathItem = historyItems.find(item => item.type === "history");
    if (historyPathItem) {
      historyPath.value = historyPathItem.path;
    } else if (historyItems.length > 0) {
      historyPath.value = historyItems[0].path;
    }
  } catch (error) {
    console.log("获取记录失败：", error);
  }
}

/** key up */
function handleUp() {
  const options = resultOptions.value.length
    ? resultOptions.value
    : historyOptions.value;
  const currentPath = resultOptions.value.length
    ? activePath.value
    : historyPath.value;

  if (options.length === 0) return;

  const index = options.findIndex(item => item.path === currentPath);
  const prevIndex = (index - 1 + options.length) % options.length;

  if (resultOptions.value.length) {
    activePath.value = resultOptions.value[prevIndex].path;
  } else {
    historyPath.value = historyOptions.value[prevIndex].path;
  }

  scrollTo(prevIndex);
}

/** key down */
function handleDown() {
  const options = resultOptions.value.length
    ? resultOptions.value
    : historyOptions.value;
  const currentPath = resultOptions.value.length
    ? activePath.value
    : historyPath.value;

  if (options.length === 0) return;

  const index = options.findIndex(item => item.path === currentPath);
  const nextIndex = (index + 1) % options.length;

  if (resultOptions.value.length) {
    activePath.value = resultOptions.value[nextIndex].path;
  } else {
    historyPath.value = historyOptions.value[nextIndex].path;
  }

  scrollTo(nextIndex);
}

/** key enter */
function handleEnter() {
  const options = resultOptions.value.length
    ? resultOptions.value
    : historyOptions.value;
  const currentPath = resultOptions.value.length
    ? activePath.value
    : historyPath.value;

  if (options.length === 0 || currentPath === "") return;
  const index = options.findIndex(item => item.path === currentPath);
  if (resultOptions.value.length) {
    saveHistory();
  }
  router.push(options[index].path);
  handleClose();
}

onKeyStroke("Enter", handleEnter);
onKeyStroke("ArrowUp", handleUp);
onKeyStroke("ArrowDown", handleDown);
</script>

<template>
  <el-dialog
    v-model="show"
    top="5vh"
    class="pure-search-dialog"
    :show-close="false"
    :width="device === 'mobile' ? '80vw' : '40vw'"
    :before-close="handleClose"
    :style="{
      borderRadius: '6px'
    }"
    append-to-body
    @opened="inputRef.focus()"
    @closed="inputRef.blur()"
  >
    <el-input
      ref="inputRef"
      v-model="keyword"
      size="large"
      clearable
      placeholder="搜索菜单（中文模式下支持拼音搜索）"
      @input="handleSearch"
    >
      <template #prefix>
        <IconifyIconOffline
          :icon="Search"
          class="text-primary w-[24px] h-[24px]"
        />
      </template>
    </el-input>
    <div class="search-result-container">
      <el-scrollbar ref="scrollbarRef" max-height="calc(90vh - 140px)">
        <el-empty
          v-if="resultOptions.length === 0 && historyOptions.length === 0"
          description="暂无搜索结果"
        />
        <SearchHistory
          v-if="historyOptions.length !== 0 && resultOptions.length === 0"
          ref="historyRef"
          v-model:value="historyPath"
          :options="historyOptions"
          @click="handleEnter"
          @delete="handleDelete"
          @collect="handleCollect"
        />
        <SearchResult
          v-if="resultOptions.length !== 0"
          ref="resultRef"
          v-model:value="activePath"
          :options="resultOptions"
          @click="handleEnter"
        />
      </el-scrollbar>
    </div>
    <template #footer>
      <SearchFooter :total="resultOptions.length" />
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.search-result-container {
  margin-top: 12px;
}
</style>
