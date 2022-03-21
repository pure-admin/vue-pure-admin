<script setup lang="ts">
import { PropType } from "vue";
import { ListItem } from "./data";
import NoticeItem from "./noticeItem.vue";

const props = defineProps({
  list: {
    type: Array as PropType<Array<ListItem>>,
    default: () => []
  }
});
</script>

<template>
  <div v-if="props.list.length">
    <NoticeItem
      v-for="(item, index) in props.list"
      :noticeItem="item"
      :key="index"
    />
  </div>
  <el-empty v-else description="暂无数据" />
</template>
