<script setup lang="ts">
import { PropType } from "vue";
import NoticeItem from "./noticeItem.vue";
import { ListItem } from "./data";

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
    ></NoticeItem>
  </div>
  <el-empty v-else description="暂无数据"></el-empty>
</template>
