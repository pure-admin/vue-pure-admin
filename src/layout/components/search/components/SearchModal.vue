<script setup lang="ts">
import { match } from "pinyin-pro";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import SearchResult from "./SearchResult.vue";
import SearchFooter from "./SearchFooter.vue";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { ref, computed, shallowRef } from "vue";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import { usePermissionStoreHook } from "@/store/modules/permission";
import Search from "@iconify-icons/ri/search-line";

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
const activePath = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const resultOptions = shallowRef([]);
const handleSearch = useDebounceFn(search, 300);

/** 菜单树形结构 */
const menusData = computed(() => {
  return cloneDeep(usePermissionStoreHook().wholeMenus);
});

const show = computed({
  get() {
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
  const scrollTop = resultRef.value.handleScroll(index);
  scrollbarRef.value.setScrollTop(scrollTop);
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(
    item => item.path === activePath.value
  );
  if (index === 0) {
    activePath.value = resultOptions.value[length - 1].path;
    scrollTo(resultOptions.value.length - 1);
  } else {
    activePath.value = resultOptions.value[index - 1].path;
    scrollTo(index - 1);
  }
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(
    item => item.path === activePath.value
  );
  if (index + 1 === length) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = resultOptions.value[index + 1].path;
  }
  scrollTo(index + 1);
}

/** key enter */
function handleEnter() {
  const { length } = resultOptions.value;
  if (length === 0 || activePath.value === "") return;
  router.push(activePath.value);
  handleClose();
}

onKeyStroke("Enter", handleEnter);
onKeyStroke("ArrowUp", handleUp);
onKeyStroke("ArrowDown", handleDown);
</script>

<template>
  <el-dialog
    top="5vh"
    class="pure-search-dialog"
    v-model="show"
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
      size="large"
      v-model="keyword"
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
          v-if="resultOptions.length === 0"
          description="暂无搜索结果"
        />
        <SearchResult
          v-else
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
