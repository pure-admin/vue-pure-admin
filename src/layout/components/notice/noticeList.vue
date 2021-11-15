<script setup lang="ts">
import { PropType } from "vue";
import NoticeItem from "./noticeItem.vue";
import { noticeItemType } from "../../types";

const props = defineProps({
  list: {
    type: Array as PropType<Array<noticeItemType>>,
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
