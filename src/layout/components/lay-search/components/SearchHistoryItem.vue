<script setup lang="ts">
import type { optionsItem } from "../types";
import { transformI18n } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import StarIcon from "@iconify-icons/ep/star";
import CloseIcon from "@iconify-icons/ep/close";

interface Props {
  item: optionsItem;
}

interface Emits {
  (e: "collectItem", val: optionsItem): void;
  (e: "deleteItem", val: optionsItem): void;
}

const emit = defineEmits<Emits>();
withDefaults(defineProps<Props>(), {});

function handleCollect(item) {
  emit("collectItem", item);
}

function handleDelete(item) {
  emit("deleteItem", item);
}
</script>

<template>
  <component :is="useRenderIcon(item.meta?.icon)" />
  <span class="history-item-title">
    {{ transformI18n(item.meta?.title) }}
  </span>
  <IconifyIconOffline
    v-show="item.type === 'history'"
    :icon="StarIcon"
    class="w-[18px] h-[18px] mr-2 hover:text-[#d7d5d4]"
    @click.stop="handleCollect(item)"
  />
  <IconifyIconOffline
    :icon="CloseIcon"
    class="w-[18px] h-[18px] hover:text-[#d7d5d4] cursor-pointer"
    @click.stop="handleDelete(item)"
  />
</template>

<style lang="scss" scoped>
.history-item-title {
  display: flex;
  flex: 1;
  margin-left: 5px;
}
</style>
