<template>
  <div class="result">
    <template v-for="item in options" :key="item.path">
      <div
        class="result-item"
        :style="{
          background:
            item?.path === active ? useEpThemeStoreHook().epThemeColor : '',
          color: item.path === active ? '#fff' : ''
        }"
        @click="handleTo"
        @mouseenter="handleMouse(item)"
      >
        <component
          :is="useRenderIcon(item.meta?.icon ?? 'bookmark-2-line')"
        ></component>
        <span class="result-item-title">{{ t(item.meta?.title) }}</span>
        <enterOutlined />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import enterOutlined from "/@/assets/svg/enter_outlined.svg?component";

const { t } = useI18n();

interface optionsItem {
  path: string;
  meta?: {
    icon?: string;
    title?: string;
  };
}

interface Props {
  value: string;
  options: Array<optionsItem>;
}

interface Emits {
  (e: "update:value", val: string): void;
  (e: "enter"): void;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();

const active = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit("update:value", val);
  }
});

/** 鼠标移入 */
async function handleMouse(item) {
  active.value = item.path;
}

function handleTo() {
  emit("enter");
}
</script>
<style lang="scss" scoped>
.result {
  padding-bottom: 12px;

  &-item {
    display: flex;
    align-items: center;
    height: 56px;
    margin-top: 8px;
    padding: 14px;
    border-radius: 4px;
    background: #e5e7eb;
    cursor: pointer;

    &-title {
      display: flex;
      flex: 1;
      margin-left: 5px;
    }
  }
}
</style>
