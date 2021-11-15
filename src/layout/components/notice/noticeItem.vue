<script setup lang="ts">
import { PropType } from "vue";
import { noticeItemType } from "../../types";

const props = defineProps({
  noticeItem: {
    type: Object as PropType<noticeItemType>,
    default: () => {}
  }
});
</script>

<template>
  <div class="notice-container">
    <el-avatar
      :size="30"
      :src="props.noticeItem.imgUrl"
      class="notice-container-avatar"
    ></el-avatar>
    <div class="notice-container-text">
      <div class="container-text-title">{{ props.noticeItem.title }}</div>
      <div class="container-text-description">
        {{ props.noticeItem.description }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notice-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  .notice-container-avatar {
    margin-right: 16px;
  }

  .notice-container-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;

    .container-text-title {
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;
    }

    .container-text-description {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 22px;
    }
  }
}
</style>
