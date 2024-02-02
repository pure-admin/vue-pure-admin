<script setup lang="ts">
import { transformI18n } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Bookmark2Line from "@iconify-icons/ri/bookmark-2-line";
import Star from "@iconify-icons/ep/star";
import Close from "@iconify-icons/ep/close";
import type { optionsItem } from "../types";

interface Props {
  item: optionsItem;
}
interface Emits {
  (e: "collectItem", val: optionsItem): void;
  (e: "deleteItem", val: optionsItem): void;
}
withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();

function handleCollect(item) {
  emit("collectItem", item);
}

function handleDelete(item) {
  emit("deleteItem", item);
}
</script>

<template>
  <component :is="useRenderIcon(item.meta?.icon ?? Bookmark2Line)" />
  <span class="history-item-title">
    {{ transformI18n(item.meta?.title) }}
  </span>
  <IconifyIconOffline
    v-if="item.type === 'history'"
    :icon="Star"
    class="w-[24px] h-[24px] mr-3 hover:text-[#d7d5d4]"
    @click.stop="handleCollect(item)"
  />
  <IconifyIconOffline
    :icon="Close"
    class="w-[24px] h-[24px] hover:text-[#d7d5d4] cursor-pointer"
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
